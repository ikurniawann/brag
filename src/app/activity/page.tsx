import { Banknote, UserPlus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";

type ActivityRow = {
  id: string;
  type: "tyfcb" | "visitor";
  actor_name: string;
  target_name: string;
  amount: string | null;
  status: string;
  created_at: string;
};

async function getAllActivities(): Promise<ActivityRow[]> {
  const { rows } = await query<ActivityRow>(`
    (
      select
        te.id,
        'tyfcb' as type,
        u_giver.full_name   as actor_name,
        u_receiver.full_name as target_name,
        te.nilai::text as amount,
        te.status::text as status,
        te.created_at
      from tyfcb_entries te
      join members m_giver     on m_giver.id     = te.giver_id
      join app_users u_giver   on u_giver.id     = m_giver.user_id
      join members m_receiver  on m_receiver.id  = te.receiver_id
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
    limit 100
  `, []);
  return rows;
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

const STATUS_STYLE: Record<string, string> = {
  verified:    "bg-green-50 text-green-700",
  rejected:    "bg-red-50 text-red-700",
  hadir_penuh: "bg-green-50 text-green-700",
  hadir:       "bg-blue-50 text-blue-700",
  pending:     "bg-brand-50 text-brand-700",
  terdaftar:   "bg-brand-50 text-brand-700",
};

const STATUS_LABEL: Record<string, string> = {
  pending:     "menunggu",
  terdaftar:   "terdaftar",
  hadir:       "hadir",
  hadir_penuh: "hadir penuh",
  verified:    "terverifikasi",
  rejected:    "ditolak",
};

export default async function ActivityPage() {
  await requireUser();
  const activities = await getAllActivities();

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-700">Feed</p>
        <h1 className="mt-2 text-3xl font-black text-ink">Semua Aktivitas</h1>
        <p className="mt-1 text-muted">
          Seluruh aktivitas TYFCB dan undangan tamu oleh member.
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-brand-200 bg-white py-20 text-center">
          <p className="text-lg font-black text-ink">Belum ada aktivitas</p>
          <p className="text-sm text-muted">Aktivitas akan muncul setelah member submit TYFCB atau undang tamu.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activities.map((a) => (
            <div
              key={a.id}
              className="flex items-start gap-4 rounded-2xl border border-brand-100 bg-white p-4"
            >
              <span className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                a.type === "tyfcb" ? "bg-brand-50 text-brand-600" : "bg-orange-50 text-orange-600"
              }`}>
                {a.type === "tyfcb"
                  ? <Banknote className="h-5 w-5" />
                  : <UserPlus className="h-5 w-5" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-ink">
                  <span className="font-bold">{a.actor_name}</span>
                  {a.type === "tyfcb" ? (
                    <>
                      {" "}mengirim TYFCB ke{" "}
                      <span className="font-bold">{a.target_name}</span>
                      {" "}· Rp {Number(a.amount).toLocaleString("id-ID")}
                    </>
                  ) : (
                    <>
                      {" "}mengundang tamu{" "}
                      <span className="font-bold">{a.target_name}</span>
                    </>
                  )}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-black uppercase tracking-wide ${
                    STATUS_STYLE[a.status] ?? "bg-gray-100 text-gray-600"
                  }`}>
                    {STATUS_LABEL[a.status] ?? a.status}
                  </span>
                  <span className="text-xs text-muted">{timeAgo(a.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
