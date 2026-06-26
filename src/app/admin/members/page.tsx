import { UserPlus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { MemberTable } from "./members-client";

async function getMembers() {
  const { rows } = await query<{
    id: string;
    user_id: string;
    full_name: string;
    email: string;
    role: string;
    team_id: string | null;
    nama_tim: string | null;
    klasifikasi_id: string | null;
    klasifikasi_nama: string | null;
    color_status: string;
    is_active: boolean;
  }>(`
    select
      m.id, m.user_id, m.team_id, m.klasifikasi_id,
      m.color_status, m.is_active,
      u.full_name, u.email, u.role,
      t.nama_tim,
      c.nama as klasifikasi_nama
    from members m
    join app_users u on u.id = m.user_id
    join event_seasons es on es.id = m.season_id
    left join teams t on t.id = m.team_id
    left join classifications c on c.id = m.klasifikasi_id
    where es.nama = 'BRAG 2026'
    order by
      substring(t.nama_tim, 5)::int,
      u.full_name
  `);
  return rows;
}

async function getTeams() {
  const { rows } = await query<{ id: string; nama_tim: string }>(`
    select t.id, t.nama_tim
    from teams t
    join event_seasons es on es.id = t.season_id
    where es.nama = 'BRAG 2026'
    order by substring(t.nama_tim, 5)::int
  `);
  return rows;
}

async function getKlasifikasi() {
  const { rows } = await query<{ id: string; nama: string }>(
    `select id, nama from classifications order by nama`
  );
  return rows;
}

export default async function AdminMembersPage() {
  await requireAdmin();
  const [members, teams, klasifikasi] = await Promise.all([
    getMembers(),
    getTeams(),
    getKlasifikasi(),
  ]);

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-ink">Kelola Member</h1>
          <p className="mt-1 text-muted">
            {members.length} member · 10 tim · BRAG 2026
          </p>
        </div>
        <a
          href="/admin/members/new"
          className="flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-black text-white shadow hover:bg-brand-700 transition"
        >
          <UserPlus className="h-4 w-4" />
          Tambah Member
        </a>
      </div>

      <MemberTable members={members} teams={teams} klasifikasi={klasifikasi} />
    </AppShell>
  );
}
