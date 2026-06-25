import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/local-auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });

  const [teamsResult, klasResult] = await Promise.all([
    query<{ id: string; nama_tim: string }>(`
      select t.id, t.nama_tim
      from teams t
      join event_seasons es on es.id = t.season_id
      where es.nama = 'BRAG 2026'
      order by substring(t.nama_tim, 5)::int
    `),
    query<{ id: string; nama: string }>(
      `select id, nama from classifications order by nama`
    ),
  ]);

  return Response.json({ teams: teamsResult.rows, klasifikasi: klasResult.rows });
}
