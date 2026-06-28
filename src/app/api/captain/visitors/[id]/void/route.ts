import { NextRequest, NextResponse } from "next/server";
import { requireCaptain } from "@/lib/auth";
import { query } from "@/lib/db";
import { getCaptainContext } from "@/lib/captain";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await requireCaptain();

  const ctx = await getCaptainContext(user.id);
  if (!ctx) {
    return NextResponse.json({ error: "Profil captain tidak ditemukan." }, { status: 404 });
  }

  const { id: visitorId } = await params;

  // Fetch visitor and verify inviter is in captain's team
  const { rows } = await query<{
    id: string;
    status_hadir: string;
    is_void: boolean;
    team_id: string | null;
  }>(`
    select v.id, v.status_hadir::text as status_hadir, v.is_void, m.team_id
    from visitors v
    join members m on m.id = v.inviter_id
    where v.id = $1
    limit 1
  `, [visitorId]);

  const visitor = rows[0];
  if (!visitor) {
    return NextResponse.json({ error: "Visitor tidak ditemukan." }, { status: 404 });
  }

  if (visitor.team_id !== ctx.team_id) {
    return NextResponse.json({ error: "Visitor tidak ada di tim kamu." }, { status: 403 });
  }

  if (visitor.is_void) {
    return NextResponse.json({ error: "Visitor sudah di-void sebelumnya." }, { status: 409 });
  }

  if (visitor.status_hadir !== "terdaftar") {
    return NextResponse.json(
      { error: "Hanya visitor berstatus terdaftar yang bisa di-void." },
      { status: 409 }
    );
  }

  await query(
    `update visitors
     set is_void = true, voided_by = $1, voided_at = now()
     where id = $2`,
    [user.id, visitorId]
  );

  return NextResponse.json({ ok: true });
}
