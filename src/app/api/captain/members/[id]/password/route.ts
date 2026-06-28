import { NextRequest, NextResponse } from "next/server";
import { requireCaptain } from "@/lib/auth";
import { query } from "@/lib/db";
import { getCaptainContext, assertTeamMember } from "@/lib/captain";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await requireCaptain();

  const ctx = await getCaptainContext(user.id);
  if (!ctx) {
    return NextResponse.json({ error: "Profil captain tidak ditemukan." }, { status: 404 });
  }

  const { id: memberId } = await params;
  const { new_password } = await req.json();

  if (!new_password || new_password.length < 6) {
    return NextResponse.json({ error: "Password minimal 6 karakter." }, { status: 400 });
  }

  // Target member must be in captain's team
  const inTeam = await assertTeamMember(memberId, ctx.team_id, ctx.season_id);
  if (!inTeam) {
    return NextResponse.json({ error: "Member tidak ada di tim kamu." }, { status: 403 });
  }

  // Get the user_id from the member record
  const { rows: memberRows } = await query<{ user_id: string }>(
    `select user_id from members where id = $1 limit 1`,
    [memberId]
  );
  if (!memberRows[0]) {
    return NextResponse.json({ error: "Member tidak ditemukan." }, { status: 404 });
  }

  await query(
    `update app_users set password_hash = crypt($1, gen_salt('bf')) where id = $2`,
    [new_password, memberRows[0].user_id]
  );

  return NextResponse.json({ ok: true });
}
