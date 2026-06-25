import { Check, SlidersHorizontal, Users, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { mockTeams, mockTyfcbEntries } from "@/lib/domain/mock-data";
import { formatPoints } from "@/lib/utils";

export default async function AdminPage() {
  await requireAdmin();

  const pending = mockTyfcbEntries.filter((e) => e.status === "pending");

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-ink">Admin — Grow Coordinator</h1>
        <p className="mt-2 text-muted">
          Verifikasi TYFCB, update milestone visitor, konfirmasi naik level, set event mingguan.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Pending TYFCB */}
        <section className="glass-panel rounded-2xl p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-ink">Verifikasi TYFCB</h2>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700">
              {pending.length} pending
            </span>
          </div>

          <div className="space-y-3">
            {pending.map((entry) => (
              <article className="rounded-2xl border border-brand-100 bg-white p-4" key={entry.id}>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-lg font-black text-ink">
                      {entry.giver_name} → {entry.receiver_name}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Rp {entry.nilai.toLocaleString("id-ID")} · {entry.tanggal}
                    </p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-700">
                      TYFCB
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary">
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button variant="danger">
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </article>
            ))}
            {pending.length === 0 && (
              <p className="text-center text-sm text-muted py-8">Tidak ada entri pending.</p>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          {/* Team standings */}
          <section className="glass-panel rounded-2xl p-4">
            <div className="mb-4 flex items-center gap-3">
              <Users className="h-5 w-5 text-brand-600" />
              <h2 className="text-xl font-black">Team</h2>
            </div>
            <div className="space-y-2">
              {mockTeams.map((team) => (
                <div className="flex items-center justify-between rounded-xl bg-white p-3" key={team.team_id}>
                  <div>
                    <p className="font-black text-ink">{team.nama_tim}</p>
                    <p className="text-xs text-muted">
                      TYFCB {formatPoints(team.score_tyfcb)} · Visitor {formatPoints(team.score_visitor)}
                    </p>
                  </div>
                  <p className="font-black text-brand-600">
                    {formatPoints(team.score_overall)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Scoring info */}
          <section className="glass-panel rounded-2xl p-4">
            <div className="mb-4 flex items-center gap-3">
              <SlidersHorizontal className="h-5 w-5 text-brand-600" />
              <h2 className="text-xl font-black">Scoring Rules</h2>
            </div>
            <div className="space-y-2 text-sm text-muted">
              <p><span className="font-bold text-ink">TYFCB:</span> Band × Penalti × Event Multiplier</p>
              <p><span className="font-bold text-ink">Visitor hadir:</span> +20 pts</p>
              <p><span className="font-bold text-ink">Hadir penuh:</span> +30 pts (total 50)</p>
              <p><span className="font-bold text-ink">Konversi member:</span> +100 pts (total 150)</p>
              <p><span className="font-bold text-ink">Full Roster:</span> Team +100/minggu</p>
              <p><span className="font-bold text-ink">Naik Level (merah→kuning):</span> Team +75</p>
              <p><span className="font-bold text-ink">Naik Level (kuning→hijau):</span> Team +150</p>
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
