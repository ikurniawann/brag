import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  await requireUser();

  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (q.length < 3) {
    return Response.json({ members: [] });
  }

  const { rows } = await query<{
    id: string;
    full_name: string;
    nama_tim: string | null;
    klasifikasi_nama: string | null;
  }>(`
    select m.id, u.full_name, t.nama_tim, c.nama as klasifikasi_nama
    from members m
    join app_users u on u.id = m.user_id
    join event_seasons es on es.id = m.season_id
    left join teams t on t.id = m.team_id
    left join classifications c on c.id = m.klasifikasi_id
    where es.nama = 'BRAG 2026'
      and u.full_name ilike $1
    order by u.full_name
    limit 10
  `, [`%${q}%`]);

  return Response.json({ members: rows });
}
