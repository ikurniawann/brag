import { NextResponse } from "next/server";
import { requireCaptain } from "@/lib/auth";
import { query } from "@/lib/db";
import { getCaptainContext } from "@/lib/captain";

export async function GET() {
  const { user } = await requireCaptain();

  const ctx = await getCaptainContext(user.id);
  if (!ctx) {
    return NextResponse.json({ error: "Profil captain tidak ditemukan." }, { status: 404 });
  }

  const { rows } = await query<{
    id: string;
    full_name: string;
    email: string;
    color_status: string;
    is_active: boolean;
  }>(`
    select m.id, u.full_name, u.email, m.color_status, m.is_active
    from members m
    join app_users u on u.id = m.user_id
    where m.team_id = $1 and m.season_id = $2
    order by u.full_name
  `, [ctx.team_id, ctx.season_id]);

  return NextResponse.json({ members: rows, captain_member_id: ctx.member_id });
}
