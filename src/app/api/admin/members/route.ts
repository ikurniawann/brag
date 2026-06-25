import { NextRequest } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/local-auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });

  const { rows } = await query<{
    id: string;
    user_id: string;
    full_name: string;
    email: string;
    team_id: string | null;
    nama_tim: string | null;
    klasifikasi_id: string | null;
    klasifikasi_nama: string | null;
    color_status: string;
    is_active: boolean;
  }>(`
    select
      m.id, m.user_id, m.team_id, m.klasifikasi_id, m.color_status, m.is_active,
      u.full_name, u.email,
      t.nama_tim,
      c.nama as klasifikasi_nama
    from members m
    join app_users u on u.id = m.user_id
    join event_seasons es on es.id = m.season_id
    left join teams t on t.id = m.team_id
    left join classifications c on c.id = m.klasifikasi_id
    where es.nama = 'BRAG 2026'
    order by t.nama_tim, u.full_name
  `);

  return Response.json(rows);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { full_name, email, password, team_id, klasifikasi_id, color_status } = body;

  if (!full_name || !email) {
    return Response.json({ error: "full_name dan email wajib diisi" }, { status: 400 });
  }

  const { rows: seasonRows } = await query<{ id: string }>(
    `select id from event_seasons where nama = 'BRAG 2026' limit 1`
  );
  if (!seasonRows[0]) return Response.json({ error: "Season tidak ditemukan" }, { status: 404 });
  const season_id = seasonRows[0].id;

  const pw = password || "member123";
  const { rows: userRows } = await query<{ id: string }>(
    `insert into app_users (email, password_hash, full_name, role)
     values ($1, crypt($2, gen_salt('bf')), $3, 'member')
     returning id`,
    [email, pw, full_name]
  );
  const new_user_id = userRows[0].id;

  const { rows: memberRows } = await query<{ id: string }>(
    `insert into members (user_id, season_id, team_id, klasifikasi_id, color_status, is_active)
     values ($1, $2, $3, $4, $5, true)
     returning id`,
    [new_user_id, season_id, team_id || null, klasifikasi_id || null, color_status || "merah"]
  );

  return Response.json({ id: memberRows[0].id }, { status: 201 });
}
