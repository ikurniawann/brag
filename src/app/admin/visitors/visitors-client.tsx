"use client";

import { Star, UserCheck, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type VisitorRow = {
  id: string;
  inviter_name: string;
  visitor_name: string;
  kontak: string;
  tanggal_undang: string;
  status_hadir: "terdaftar" | "hadir" | "hadir_penuh";
  is_converted: boolean;
};

type Filter = "all" | "terdaftar" | "hadir" | "hadir_penuh";

const STATUS_STYLE: Record<string, string> = {
  terdaftar:   "bg-brand-50 text-brand-700",
  hadir:       "bg-blue-50 text-blue-700",
  hadir_penuh: "bg-green-50 text-green-700",
};
const STATUS_LABEL: Record<string, string> = {
  terdaftar:   "Terdaftar",
  hadir:       "Hadir",
  hadir_penuh: "Hadir Penuh",
};
const STATUS_ORDER = ["terdaftar", "hadir", "hadir_penuh"];
const NEXT_STATUS: Record<string, string> = {
  terdaftar: "hadir",
  hadir:     "hadir_penuh",
};
const NEXT_LABEL: Record<string, string> = {
  terdaftar: "Tandai Hadir (+20 pts)",
  hadir:     "Hadir Penuh (+30 pts)",
};

export function VisitorsAdminClient({ initial }: { initial: VisitorRow[] }) {
  const router = useRouter();
  const [visitors, setVisitors] = useState(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function patch(id: string, body: object, optimistic: Partial<VisitorRow>) {
    setLoading(id);
    setError("");
    const res = await fetch(`/api/admin/visitors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const d = await res.json();
    setLoading(null);
    if (!res.ok) { setError(d.error ?? "Gagal."); return; }
    setVisitors((prev) => prev.map((v) => v.id === id ? { ...v, ...optimistic } : v));
    router.refresh();
  }

  const counts = {
    all:         visitors.length,
    terdaftar:   visitors.filter((v) => v.status_hadir === "terdaftar").length,
    hadir:       visitors.filter((v) => v.status_hadir === "hadir").length,
    hadir_penuh: visitors.filter((v) => v.status_hadir === "hadir_penuh").length,
  };

  const visible = filter === "all" ? visitors : visitors.filter((v) => v.status_hadir === filter);

  return (
    <>
      {/* Filter tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {(["all", "terdaftar", "hadir", "hadir_penuh"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-bold transition ${
              filter === f ? "bg-brand-600 text-white" : "bg-white border border-brand-100 text-muted hover:text-ink"
            }`}
          >
            {f === "all" ? "Semua" : STATUS_LABEL[f]} ({counts[f]})
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>
      )}

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-200 bg-white py-16 text-center text-muted">
          Tidak ada visitor.
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((v) => {
            const nextStatus = NEXT_STATUS[v.status_hadir];
            const idx = STATUS_ORDER.indexOf(v.status_hadir);
            return (
              <div key={v.id} className="rounded-2xl border border-brand-100 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black text-ink">{v.visitor_name}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${STATUS_STYLE[v.status_hadir]}`}>
                        {STATUS_LABEL[v.status_hadir]}
                      </span>
                      {v.is_converted && (
                        <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-black text-purple-700">
                          <Star className="h-3 w-3" /> Member
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      Diundang oleh <span className="font-bold">{v.inviter_name}</span>
                      {" · "}{v.kontak} · {v.tanggal_undang}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {nextStatus && idx < STATUS_ORDER.length - 1 && (
                      <button
                        onClick={() => patch(v.id, { status_hadir: nextStatus }, { status_hadir: nextStatus as VisitorRow["status_hadir"] })}
                        disabled={loading === v.id}
                        className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2 text-xs font-black text-white hover:bg-brand-700 disabled:opacity-50"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        {NEXT_LABEL[v.status_hadir]}
                      </button>
                    )}
                    {!v.is_converted && (
                      <button
                        onClick={() => patch(v.id, { is_converted: true }, { is_converted: true })}
                        disabled={loading === v.id}
                        className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-xs font-black text-purple-700 hover:bg-purple-100 disabled:opacity-50"
                      >
                        <Star className="h-3.5 w-3.5" />
                        Konversi (+100 pts)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
