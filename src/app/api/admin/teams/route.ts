import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const { user } = await requireUser();
  if (user.role !== "admin" && user.role !== "super_admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { rows } = await query(`
    select t.id, t.nama_tim,
           count(m.id)::int as jumlah_member
    from teams t
    join event_seasons es on es.id = t.season_id
    left join members m on m.team_id = t.id
    where es.nama = 'BRAG 2026'
    group by t.id, t.nama_tim
    order by substring(t.nama_tim, 5)::int
  `, []);

  return Response.json({ teams: rows });
}

export async function POST(req: NextRequest) {
  const { user } = await requireUser();
  if (user.role !== "admin" && user.role !== "super_admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { nama_tim } = await req.json();
  if (!nama_tim?.trim()) {
    return Response.json({ error: "Nama tim wajib diisi." }, { status: 400 });
  }

  const { rows: season } = await query<{ id: string }>(
    `select id from event_seasons where nama = 'BRAG 2026' limit 1`, []
  );
  if (!season[0]) return Response.json({ error: "Season tidak ditemukan." }, { status: 404 });

  const { rows } = await query<{ id: string }>(
    `insert into teams (season_id, nama_tim) values ($1, $2) returning id`,
    [season[0].id, nama_tim.trim()]
  );
  return Response.json({ id: rows[0].id }, { status: 201 });
}
