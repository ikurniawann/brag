import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { TeamsClient, type TeamRow } from "./teams-client";

async function getTeams(): Promise<TeamRow[]> {
  const { rows } = await query<TeamRow>(`
    select t.id, t.nama_tim,
           count(m.id)::int as jumlah_member
    from teams t
    join event_seasons es on es.id = t.season_id
    left join members m on m.team_id = t.id
    where es.nama = 'BRAG 2026'
    group by t.id, t.nama_tim
    order by substring(t.nama_tim, 5)::int
  `, []);
  return rows;
}

export default async function AdminTeamsPage() {
  const { user } = await requireUser();
  if (user.role !== "admin" && user.role !== "super_admin") {
    return <div className="p-8 text-center text-muted">Akses ditolak.</div>;
  }

  const teams = await getTeams();

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-700">Admin Area</p>
        <h1 className="mt-2 text-3xl font-black text-ink">Kelola Team</h1>
        <p className="mt-1 text-muted">Tambah, ubah nama, atau hapus team dalam season BRAG 2026.</p>
      </div>
      <TeamsClient initial={teams} />
    </AppShell>
  );
}
