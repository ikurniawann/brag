import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  await requireUser();

  const { rows } = await query(`
    (
      select
        te.id,
        'tyfcb' as type,
        u_giver.full_name  as actor_name,
        u_receiver.full_name as target_name,
        te.nilai::text as amount,
        te.status::text as status,
        te.created_at
      from tyfcb_entries te
      join members m_giver    on m_giver.id    = te.giver_id
      join app_users u_giver  on u_giver.id    = m_giver.user_id
      join members m_receiver on m_receiver.id = te.receiver_id
      join app_users u_receiver on u_receiver.id = m_receiver.user_id
    )
    union all
    (
      select
        v.id,
        'visitor' as type,
        u_inviter.full_name as actor_name,
        v.nama              as target_name,
        null                as amount,
        v.status_hadir::text as status,
        v.created_at
      from visitors v
      join members m_inviter   on m_inviter.id  = v.inviter_id
      join app_users u_inviter on u_inviter.id  = m_inviter.user_id
    )
    order by created_at desc
    limit 10
  `, []);

  return NextResponse.json({ notifications: rows });
}
