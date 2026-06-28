import { NextRequest, NextResponse } from "next/server";
import { requireCaptain } from "@/lib/auth";
import { query } from "@/lib/db";
import { getCaptainContext, assertTeamMember } from "@/lib/captain";

export async function POST(req: NextRequest) {
  const { user } = await requireCaptain();

  const ctx = await getCaptainContext(user.id);
  if (!ctx) {
    return NextResponse.json({ error: "Profil captain tidak ditemukan." }, { status: 404 });
  }

  const body = await req.json();
  const { member_id, nama, kontak, tanggal_undang } = body;

  if (!member_id || !nama?.trim() || !kontak?.trim() || !tanggal_undang) {
    return NextResponse.json(
      { error: "member_id, nama, kontak, dan tanggal_undang wajib diisi." },
      { status: 400 }
    );
  }

  // member_id must be in captain's team
  const inTeam = await assertTeamMember(member_id, ctx.team_id, ctx.season_id);
  if (!inTeam) {
    return NextResponse.json({ error: "Member tidak ada di tim kamu." }, { status: 403 });
  }

  try {
    const { rows } = await query<{ id: string }>(`
      insert into visitors (season_id, inviter_id, nama, kontak, tanggal_undang, status_hadir, submitted_by)
      values ($1, $2, $3, $4, $5, 'terdaftar', $6)
      returning id
    `, [ctx.season_id, member_id, nama.trim(), kontak.trim(), tanggal_undang, user.id]);

    return NextResponse.json({ id: rows[0].id, status: "terdaftar" }, { status: 201 });
  } catch (err: unknown) {
    const msg = (err as { message?: string }).message ?? "";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return NextResponse.json({ error: "Kontak ini sudah terdaftar di season ini." }, { status: 409 });
    }
    throw err;
  }
}
