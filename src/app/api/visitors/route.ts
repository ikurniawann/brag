import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { user } = await requireUser();

  const body = await req.json();
  const { nama, kontak, tanggal_undang } = body;

  if (!nama?.trim() || !kontak?.trim() || !tanggal_undang) {
    return NextResponse.json({ error: "nama, kontak, dan tanggal_undang wajib diisi." }, { status: 400 });
  }

  const { rows: memberRows } = await query<{ id: string; season_id: string }>(`
    select m.id, m.season_id
    from members m
    join event_seasons es on es.id = m.season_id
    where m.user_id = $1 and es.nama = 'BRAG 2026'
    limit 1
  `, [user.id]);

  if (!memberRows[0]) {
    return NextResponse.json({ error: "Profil member tidak ditemukan di season ini." }, { status: 404 });
  }

  const member = memberRows[0];

  try {
    const { rows } = await query<{ id: string }>(`
      insert into visitors (season_id, inviter_id, nama, kontak, tanggal_undang, status_hadir)
      values ($1, $2, $3, $4, $5, 'terdaftar')
      returning id
    `, [member.season_id, member.id, nama.trim(), kontak.trim(), tanggal_undang]);

    return NextResponse.json({ id: rows[0].id, status: "terdaftar" }, { status: 201 });
  } catch (err: unknown) {
    const msg = (err as { message?: string }).message ?? "";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return NextResponse.json({ error: "Kontak ini sudah terdaftar di season ini." }, { status: 409 });
    }
    throw err;
  }
}
