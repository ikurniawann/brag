import { query } from "@/lib/db";

export type CaptainContext = {
  member_id: string;
  team_id: string;
  season_id: string;
};

export async function getCaptainContext(userId: string): Promise<CaptainContext | null> {
  const { rows } = await query<CaptainContext>(`
    select m.id as member_id, m.team_id, m.season_id
    from members m
    join event_seasons es on es.id = m.season_id
    where m.user_id = $1 and es.nama = 'BRAG 2026'
    limit 1
  `, [userId]);
  return rows[0] ?? null;
}

export async function assertTeamMember(
  memberId: string,
  teamId: string,
  seasonId: string
): Promise<boolean> {
  const { rows } = await query(
    `select 1 from members where id = $1 and team_id = $2 and season_id = $3 limit 1`,
    [memberId, teamId, seasonId]
  );
  return rows.length > 0;
}
