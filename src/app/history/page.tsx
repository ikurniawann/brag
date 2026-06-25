import { Clock, Gift, UserPlus } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  verified: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
  terdaftar: "bg-slate-50 text-slate-600",
  hadir: "bg-blue-50 text-blue-700",
  hadir_penuh: "bg-green-50 text-green-700",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  verified: "Verified",
  rejected: "Ditolak",
  terdaftar: "Terdaftar",
  hadir: "Hadir",
  hadir_penuh: "Hadir Penuh",
};

type TyfcbEntry = {
  id: string;
  receiver_name: string | null;
  nilai: number;
  tanggal: string;
  status: string;
  computed_score: number | null;
  rejection_reason: string | null;
};

type VisitorEntry = {
  id: string;
  nama: string;
  kontak: string;
  tanggal_undang: string;
  status_hadir: string;
  is_converted: boolean;
  tanggal_konversi: string | null;
};

async function getMemberHistory(userId: string) {
  const { rows: memberRows } = await query<{ id: string; season_id: string }>(`
    select m.id, m.season_id
    from members m
    join event_seasons es on es.id = m.season_id
    where m.user_id = $1 and es.nama = 'BRAG 2026'
    limit 1
  `, [userId]);

  if (!memberRows[0]) return { tyfcb: [], visitors: [] };

  const { id: memberId } = memberRows[0];

  const [tyfcbResult, visitorsResult] = await Promise.all([
    query<TyfcbEntry>(`
      select
        te.id,
        u.full_name as receiver_name,
        te.nilai::int,
        to_char(te.tanggal, 'DD Mon YYYY') as tanggal,
        te.status::text as status,
        te.computed_score,
        te.rejection_reason
      from tyfcb_entries te
      left join members mr on mr.id = te.receiver_id
      left join app_users u on u.id = mr.user_id
      where te.giver_id = $1
      order by te.created_at desc
    `, [memberId]),
    query<VisitorEntry>(`
      select
        id, nama, kontak,
        to_char(tanggal_undang, 'DD Mon YYYY') as tanggal_undang,
        status_hadir::text as status_hadir,
        is_converted,
        to_char(tanggal_konversi, 'DD Mon YYYY') as tanggal_konversi
      from visitors
      where inviter_id = $1
      order by created_at desc
    `, [memberId]),
  ]);

  return { tyfcb: tyfcbResult.rows, visitors: visitorsResult.rows };
}

export default async function HistoryPage() {
  const { user } = await requireUser();
  const { tyfcb: myTyfcb, visitors: myVisitors } = await getMemberHistory(user.id);

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-ink">Riwayat Kontribusi</h1>
          <p className="mt-2 text-muted">Semua TYFCB dan Visitor yang pernah kamu submit.</p>
        </div>

        {/* TYFCB section */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-brand-600" />
              <h2 className="text-xl font-black text-ink">TYFCB</h2>
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                {myTyfcb.length}
              </span>
            </div>
            <Link href="/submit?type=tyfcb" className="text-sm font-bold text-brand-600">
              + Tambah
            </Link>
          </div>

          {myTyfcb.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 text-center text-muted">
              Belum ada TYFCB.{" "}
              <Link href="/submit?type=tyfcb" className="font-bold text-brand-600">
                Submit sekarang →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myTyfcb.map((entry) => (
                <article
                  key={entry.id}
                  className="glass-panel flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-black text-ink">
                      → {entry.receiver_name ?? "—"}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">
                      Rp {Number(entry.nilai).toLocaleString("id-ID")} · {entry.tanggal}
                    </p>
                    {entry.status === "rejected" && entry.rejection_reason && (
                      <p className="mt-1 text-xs text-red-600">
                        Alasan: {entry.rejection_reason}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {entry.status === "verified" && entry.computed_score != null && (
                      <span className="text-lg font-black text-brand-600">
                        +{entry.computed_score} pts
                      </span>
                    )}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        STATUS_STYLE[entry.status] ?? "bg-slate-50 text-slate-600"
                      }`}
                    >
                      {STATUS_LABEL[entry.status] ?? entry.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Visitor section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-brand-600" />
              <h2 className="text-xl font-black text-ink">Visitor</h2>
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                {myVisitors.length}
              </span>
            </div>
            <Link href="/submit?type=visitor" className="text-sm font-bold text-brand-600">
              + Tambah
            </Link>
          </div>

          {myVisitors.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 text-center text-muted">
              Belum ada visitor.{" "}
              <Link href="/submit?type=visitor" className="font-bold text-brand-600">
                Daftarkan sekarang →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myVisitors.map((v) => (
                <article
                  key={v.id}
                  className="glass-panel flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-black text-ink">{v.nama}</p>
                    <p className="mt-0.5 text-sm text-muted">
                      {v.kontak} · Diundang {v.tanggal_undang}
                    </p>
                    {v.is_converted && (
                      <p className="mt-1 text-xs font-bold text-green-700">
                        Konversi member {v.tanggal_konversi ? `· ${v.tanggal_konversi}` : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        STATUS_STYLE[v.status_hadir] ?? "bg-slate-50 text-slate-600"
                      }`}
                    >
                      {STATUS_LABEL[v.status_hadir] ?? v.status_hadir}
                    </span>
                    {v.is_converted && (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                        Converted
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted">
          <Clock className="h-3.5 w-3.5" />
          <span>Data diperbarui langsung dari database.</span>
        </div>
      </div>
    </AppShell>
  );
}
