import { NextRequest, NextResponse } from "next/server";
import { requireCaptain } from "@/lib/auth";
import { query } from "@/lib/db";
import { getCaptainContext, assertTeamMember } from "@/lib/captain";
import { getBand } from "@/lib/scoring";

export async function POST(req: NextRequest) {
  const { user } = await requireCaptain();

  const ctx = await getCaptainContext(user.id);
  if (!ctx) {
    return NextResponse.json({ error: "Profil captain tidak ditemukan." }, { status: 404 });
  }

  const body = await req.json();
  const { member_id, receiver_id, nilai: nilaiRaw, tanggal } = body;

  if (!member_id || !receiver_id || !nilaiRaw || !tanggal) {
    return NextResponse.json(
      { error: "member_id, receiver_id, nilai, dan tanggal wajib diisi." },
      { status: 400 }
    );
  }

  // member_id must be in captain's team
  const inTeam = await assertTeamMember(member_id, ctx.team_id, ctx.season_id);
  if (!inTeam) {
    return NextResponse.json({ error: "Member tidak ada di tim kamu." }, { status: 403 });
  }

  if (member_id === receiver_id) {
    return NextResponse.json({ error: "Tidak bisa TYFCB ke diri sendiri." }, { status: 400 });
  }

  const nilai = Number(nilaiRaw);
  if (isNaN(nilai) || nilai <= 0) {
    return NextResponse.json({ error: "Nilai tidak valid." }, { status: 400 });
  }

  // Validate receiver exists in same season
  const { rows: receiverRows } = await query(
    `select id from members where id = $1 and season_id = $2 limit 1`,
    [receiver_id, ctx.season_id]
  );
  if (!receiverRows[0]) {
    return NextResponse.json({ error: "Penerima tidak ditemukan di season ini." }, { status: 400 });
  }

  // pair_ordinal = existing entries between this pair + 1
  const { rows: pairRows } = await query<{ count: string }>(
    `select count(*) as count from tyfcb_entries
     where giver_id = $1 and receiver_id = $2 and season_id = $3`,
    [member_id, receiver_id, ctx.season_id]
  );
  const pairOrdinal = Number(pairRows[0]?.count ?? 0) + 1;

  const B = getBand(nilai);
  const P = 1 / pairOrdinal;
  const M = 1.0;
  const computedScore = Math.round(B * P * M);

  const { rows: inserted } = await query<{ id: string }>(`
    insert into tyfcb_entries
      (season_id, giver_id, receiver_id, nilai, tanggal, status, computed_score,
       pair_ordinal, event_multiplier_applied, submitted_by)
    values ($1, $2, $3, $4, $5, 'pending', $6, $7, $8, $9)
    returning id
  `, [ctx.season_id, member_id, receiver_id, nilai, tanggal, computedScore, pairOrdinal, M, user.id]);

  return NextResponse.json(
    { id: inserted[0].id, computed_score: computedScore, status: "pending" },
    { status: 201 }
  );
}
