import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";

const STATUS_ORDER = ["terdaftar", "hadir", "hadir_penuh"];
const STATUS_POINTS: Record<string, number> = {
  hadir:       20,
  hadir_penuh: 30,
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await requireUser();
  if (user.role !== "admin" && user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body: { status_hadir?: string; is_converted?: boolean } = await req.json();

  // Get current visitor with inviter's team_id
  const { rows } = await query<{
    id: string;
    season_id: string;
    inviter_id: string;
    team_id: string | null;
    status_hadir: string;
    is_converted: boolean;
  }>(`
    select v.id, v.season_id, v.inviter_id, m.team_id,
           v.status_hadir::text as status_hadir, v.is_converted
    from visitors v
    join members m on m.id = v.inviter_id
    where v.id = $1
    limit 1
  `, [id]);

  const visitor = rows[0];
  if (!visitor) return NextResponse.json({ error: "Visitor tidak ditemukan." }, { status: 404 });

  // Handle status_hadir update (only forward transitions)
  if (body.status_hadir && body.status_hadir !== visitor.status_hadir) {
    const oldIdx = STATUS_ORDER.indexOf(visitor.status_hadir);
    const newIdx = STATUS_ORDER.indexOf(body.status_hadir);

    if (newIdx < 0) {
      return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
    }

    // Award points for each step crossed
    for (let i = oldIdx + 1; i <= newIdx; i++) {
      const pts = STATUS_POINTS[STATUS_ORDER[i]];
      if (pts) {
        await query(`
          insert into score_ledger (season_id, member_id, team_id, kategori, points, sumber_ref, keterangan)
          values ($1, $2, $3, 'visitor', $4, $5, $6)
        `, [
          visitor.season_id, visitor.inviter_id, visitor.team_id,
          pts, visitor.id,
          `Visitor ${STATUS_ORDER[i]}`
        ]);
      }
    }

    await query(
      `update visitors set status_hadir = $1 where id = $2`,
      [body.status_hadir, id]
    );
  }

  // Handle conversion bonus
  if (body.is_converted === true && !visitor.is_converted) {
    await query(`
      insert into score_ledger (season_id, member_id, team_id, kategori, points, sumber_ref, keterangan)
      values ($1, $2, $3, 'visitor', 100, $4, 'Visitor konversi')
    `, [visitor.season_id, visitor.inviter_id, visitor.team_id, visitor.id]);

    await query(
      `update visitors set is_converted = true, tanggal_konversi = current_date where id = $1`,
      [id]
    );
  }

  return NextResponse.json({ ok: true });
}
