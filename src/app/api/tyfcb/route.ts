import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";

function getBand(nilai: number): number {
  if (nilai < 500_000) return 10;
  if (nilai < 2_000_000) return 25;
  if (nilai < 10_000_000) return 50;
  if (nilai < 50_000_000) return 80;
  if (nilai < 250_000_000) return 120;
  if (nilai < 500_000_000) return 150;
  return 200;
}

export async function POST(req: NextRequest) {
  const { user } = await requireUser();

  const body = await req.json();
  const { receiver_id, nilai: nilaiRaw, tanggal } = body;

  if (!receiver_id || !nilaiRaw || !tanggal) {
    return NextResponse.json({ error: "receiver_id, nilai, dan tanggal wajib diisi." }, { status: 400 });
  }

  const nilai = Number(nilaiRaw);
  if (isNaN(nilai) || nilai <= 0) {
    return NextResponse.json({ error: "Nilai tidak valid." }, { status: 400 });
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

  if (receiver_id === member.id) {
    return NextResponse.json({ error: "Tidak bisa TYFCB ke diri sendiri." }, { status: 400 });
  }

  const { rows: receiverRows } = await query(
    `select id from members where id = $1 and season_id = $2 limit 1`,
    [receiver_id, member.season_id]
  );
  if (!receiverRows[0]) {
    return NextResponse.json({ error: "Penerima tidak ditemukan di season ini." }, { status: 400 });
  }

  // pair_ordinal = existing entries between this pair + 1
  const { rows: pairRows } = await query<{ count: string }>(
    `select count(*) as count from tyfcb_entries
     where giver_id = $1 and receiver_id = $2 and season_id = $3`,
    [member.id, receiver_id, member.season_id]
  );
  const pairOrdinal = Number(pairRows[0]?.count ?? 0) + 1;

  const B = getBand(nilai);
  const P = 1 / pairOrdinal;
  const M = 1.0;
  const computedScore = Math.round(B * P * M);

  const { rows: inserted } = await query<{ id: string }>(`
    insert into tyfcb_entries
      (season_id, giver_id, receiver_id, nilai, tanggal, status, computed_score, pair_ordinal, event_multiplier_applied)
    values ($1, $2, $3, $4, $5, 'pending', $6, $7, $8)
    returning id
  `, [member.season_id, member.id, receiver_id, nilai, tanggal, computedScore, pairOrdinal, M]);

  return NextResponse.json({ id: inserted[0].id, computed_score: computedScore, status: "pending" }, { status: 201 });
}
