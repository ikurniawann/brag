import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";

type TyfcbStatus = "pending" | "verified" | "rejected";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await requireUser();
  if (user.role !== "admin" && user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { status: newStatus }: { status: TyfcbStatus } = await req.json();

  if (!["pending", "verified", "rejected"].includes(newStatus)) {
    return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
  }

  // Get current entry with giver's team_id
  const { rows } = await query<{
    id: string;
    season_id: string;
    giver_id: string;
    team_id: string | null;
    computed_score: number;
    status: TyfcbStatus;
  }>(`
    select te.id, te.season_id, te.giver_id, m.team_id, te.computed_score, te.status::text as status
    from tyfcb_entries te
    join members m on m.id = te.giver_id
    where te.id = $1
    limit 1
  `, [id]);

  const entry = rows[0];
  if (!entry) return NextResponse.json({ error: "Entry tidak ditemukan." }, { status: 404 });

  const oldStatus = entry.status;
  if (oldStatus === newStatus) {
    return NextResponse.json({ error: "Status sudah sama." }, { status: 400 });
  }

  // Determine whether to write/reverse score
  const needsAdd     = (oldStatus !== "verified") && (newStatus === "verified");
  const needsReverse = (oldStatus === "verified")  && (newStatus !== "verified");

  if (needsAdd && entry.computed_score) {
    await query(`
      insert into score_ledger (season_id, member_id, team_id, kategori, points, sumber_ref, keterangan)
      values ($1, $2, $3, 'tyfcb', $4, $5, 'TYFCB verified')
    `, [entry.season_id, entry.giver_id, entry.team_id, entry.computed_score, entry.id]);
  }

  if (needsReverse && entry.computed_score) {
    await query(`
      insert into score_ledger (season_id, member_id, team_id, kategori, points, sumber_ref, keterangan)
      values ($1, $2, $3, 'tyfcb', $4, $5, 'TYFCB reversal')
    `, [entry.season_id, entry.giver_id, entry.team_id, -(entry.computed_score), entry.id]);
  }

  const verifiedAt = newStatus === "verified" ? new Date().toISOString() : null;
  const verifiedBy = newStatus === "verified" ? user.id : null;

  await query(`
    update tyfcb_entries
    set status = $1, verified_by = $2, verified_at = $3
    where id = $4
  `, [newStatus, verifiedBy, verifiedAt, id]);

  return NextResponse.json({ ok: true, status: newStatus });
}
