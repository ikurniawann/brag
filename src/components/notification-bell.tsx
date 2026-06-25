"use client";

import { Banknote, Bell, UserPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type NotifItem = {
  id: string;
  type: "tyfcb" | "visitor";
  actor_name: string;
  target_name: string;
  amount: string | null;
  status: string;
  created_at: string;
};

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotifItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function toggle() {
    setOpen((v) => !v);
    if (!fetched) {
      setLoading(true);
      const res = await fetch("/api/notifications");
      const d = await res.json();
      setItems(d.notifications ?? []);
      setLoading(false);
      setFetched(true);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={toggle}
        className="grid h-10 w-10 place-items-center rounded-full border border-brand-100 bg-white text-brand-600 shadow-sm transition hover:bg-brand-50"
        aria-label="Notifikasi aktivitas"
      >
        <Bell className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-xl">
          <div className="border-b border-brand-100 px-4 py-3">
            <p className="font-black text-ink">Aktivitas Terbaru</p>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-muted">Memuat…</p>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">Belum ada aktivitas.</p>
          ) : (
            <div className="max-h-[420px] overflow-y-auto divide-y divide-brand-50">
              {items.map((n) => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3">
                  <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                    n.type === "tyfcb"
                      ? "bg-brand-50 text-brand-600"
                      : "bg-orange-50 text-orange-600"
                  }`}>
                    {n.type === "tyfcb"
                      ? <Banknote className="h-4 w-4" />
                      : <UserPlus className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug text-ink">
                      <span className="font-bold">{n.actor_name.split(" ")[0]}</span>
                      {n.type === "tyfcb" ? (
                        <>
                          {" "}mengirim TYFCB ke{" "}
                          <span className="font-bold">{n.target_name.split(" ")[0]}</span>
                          {" "}· Rp {Number(n.amount).toLocaleString("id-ID")}
                        </>
                      ) : (
                        <>
                          {" "}mengundang tamu{" "}
                          <span className="font-bold">{n.target_name}</span>
                        </>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{timeAgo(n.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-brand-100 px-4 py-3">
            <Link
              href="/activity"
              onClick={() => setOpen(false)}
              className="text-sm font-bold text-brand-600 hover:underline"
            >
              Lihat semua aktivitas →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
