"use client";

import { Camera, CheckCircle2, ChevronDown, Gift, Search, Send, UserPlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Tab = "tyfcb" | "visitor";
type MemberOption = { id: string; full_name: string; nama_tim: string | null; klasifikasi_nama: string | null };

const today = new Date().toISOString().split("T")[0];

const KLASIFIKASI = [
  "Retail", "Jasa", "Properti", "Keuangan",
  "Kuliner", "Teknologi", "Kesehatan", "Pendidikan",
  "Manufaktur", "Lainnya",
];

function formatIDR(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("id-ID");
}

export function SubmitClient() {
  const [tab, setTab] = useState<Tab>("tyfcb");

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-ink">Catat Kontribusi</h1>
        <p className="mt-2 text-muted">
          Semua submission berstatus{" "}
          <span className="font-bold text-brand-700">pending</span> sampai
          diverifikasi oleh Grow Coordinator.
        </p>
      </div>

      <div className="mb-6 flex rounded-full border border-brand-100 bg-white p-1">
        <button
          type="button"
          onClick={() => setTab("tyfcb")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-black transition ${
            tab === "tyfcb" ? "bg-brand-600 text-white shadow" : "text-muted hover:text-ink"
          }`}
        >
          <Gift className="h-4 w-4" />
          TYFCB
        </button>
        <button
          type="button"
          onClick={() => setTab("visitor")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-black transition ${
            tab === "visitor" ? "bg-brand-600 text-white shadow" : "text-muted hover:text-ink"
          }`}
        >
          <UserPlus className="h-4 w-4" />
          Visitor
        </button>
      </div>

      {tab === "tyfcb" ? <TyfcbForm /> : <VisitorForm />}
    </div>
  );
}

function TyfcbForm() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<MemberOption[]>([]);
  const [selected, setSelected] = useState<{ id: string; label: string } | null>(null);
  const [open, setOpen] = useState(false);
  const [displayNilai, setDisplayNilai] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ id: string; score: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tanggalRef = useRef<HTMLInputElement>(null);

  async function handleSearch(val: string) {
    setSearchQuery(val);
    setSelected(null);
    if (val.length < 3) { setResults([]); setOpen(false); return; }
    const res = await fetch(`/api/members/search?q=${encodeURIComponent(val)}`);
    const data = await res.json();
    setResults(data.members ?? []);
    setOpen(true);
  }

  function handleSelect(m: MemberOption) {
    setSelected({ id: m.id, label: `${m.full_name} — ${m.nama_tim ?? ""}` });
    setSearchQuery(m.full_name);
    setOpen(false);
  }

  function handleClear() {
    setSelected(null);
    setSearchQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  }

  function resetForm() {
    setSelected(null);
    setSearchQuery("");
    setResults([]);
    setDisplayNilai("");
    if (tanggalRef.current) tanggalRef.current.value = "";
  }

  const rawNilai = displayNilai.replace(/\./g, "").replace(/,/g, "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!selected) { setError("Pilih penerima bisnis terlebih dahulu."); return; }
    if (!rawNilai || Number(rawNilai) <= 0) { setError("Masukkan nilai transaksi yang valid."); return; }
    if (!tanggalRef.current?.value) { setError("Masukkan tanggal transaksi."); return; }

    setSubmitting(true);
    const res = await fetch("/api/tyfcb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiver_id: selected.id,
        nilai: rawNilai,
        tanggal: tanggalRef.current.value,
      }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Terjadi kesalahan.");
      return;
    }

    setSuccess({ id: data.id, score: data.computed_score });
    resetForm();
  }

  if (success) {
    return (
      <div className="glass-panel flex flex-col items-center gap-4 rounded-2xl p-8 text-center">
        <CheckCircle2 className="h-14 w-14 text-green-500" />
        <div>
          <p className="text-xl font-black text-ink">TYFCB Tersubmit!</p>
          <p className="mt-1 text-muted">
            Perkiraan skor: <span className="font-bold text-brand-700">+{success.score} pts</span> (pending verifikasi admin)
          </p>
        </div>
        <Button onClick={() => setSuccess(null)}>Catat TYFCB Lagi</Button>
      </div>
    );
  }

  return (
    <form className="glass-panel space-y-5 rounded-2xl p-5" onSubmit={handleSubmit}>
      <div>
        <p className="mb-1 text-sm font-bold uppercase tracking-[0.12em] text-brand-700">TYFCB</p>
        <p className="text-sm text-muted">
          Catat bisnis yang kamu bantu closing untuk sesama member BNI Grow.
          Skor masuk ke akunmu (giver), bukan penerima.
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>
      )}

      <div>
        <label className="mb-2 block text-sm font-black text-ink">
          Penerima bisnis <span className="text-brand-600">*</span>
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted">
            <Search className="h-4 w-4" />
          </span>
          <input
            ref={inputRef}
            className="w-full rounded-2xl border border-brand-100 bg-white py-3 pl-10 pr-10 outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Ketik min. 3 huruf nama member…"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchQuery.length >= 3 && setOpen(true)}
            autoComplete="off"
          />
          {searchQuery && (
            <button type="button" onClick={handleClear} className="absolute inset-y-0 right-4 flex items-center text-muted hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          )}
          {open && results.length > 0 && (
            <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-lift">
              {results.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-brand-50"
                    onMouseDown={(e) => { e.preventDefault(); handleSelect(m); }}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                      {m.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="font-bold text-ink">{m.full_name}</p>
                      <p className="text-xs text-muted">{m.nama_tim} · {m.klasifikasi_nama}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {open && searchQuery.length >= 3 && results.length === 0 && (
            <div className="absolute z-20 mt-1 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-muted shadow-lift">
              Tidak ada member dengan nama tersebut.
            </div>
          )}
        </div>
        {selected && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {selected.label}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-black text-ink">
          Nilai transaksi <span className="text-brand-600">*</span>
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-bold text-muted">IDR</span>
          <input
            className="w-full rounded-2xl border border-brand-100 bg-white py-3 pl-14 pr-4 text-right font-bold tabular-nums text-ink outline-none focus:ring-2 focus:ring-brand-500"
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={displayNilai}
            onChange={(e) => setDisplayNilai(formatIDR(e.target.value))}
          />
        </div>
        {displayNilai && (
          <p className="mt-1 text-right text-xs text-muted">
            {(() => {
              const n = Number(rawNilai);
              if (n < 500_000) return "Band 1 → 10 pts";
              if (n < 2_000_000) return "Band 2 → 25 pts";
              if (n < 10_000_000) return "Band 3 → 50 pts";
              if (n < 50_000_000) return "Band 4 → 80 pts";
              if (n < 250_000_000) return "Band 5 → 120 pts";
              if (n < 500_000_000) return "Band 6 → 150 pts";
              return "Band 7 → 200 pts";
            })()}
          </p>
        )}
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-black text-ink">
          Tanggal transaksi <span className="text-brand-600">*</span>
        </span>
        <input
          ref={tanggalRef}
          className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500"
          name="tanggal"
          type="date"
          max={today}
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-black text-ink">Bukti (opsional)</span>
        <span className="flex items-center gap-3 rounded-2xl border border-dashed border-brand-200 bg-white px-4 py-3 text-muted">
          <Camera className="h-5 w-5 shrink-0 text-brand-600" />
          <input className="w-full text-sm" name="bukti" type="file" accept="image/*,.pdf" />
        </span>
      </label>

      <Button className="w-full" type="submit" disabled={submitting}>
        <Send className="h-5 w-5" />
        {submitting ? "Mengirim…" : "Submit TYFCB"}
      </Button>
    </form>
  );
}

function VisitorForm() {
  const [klasifikasi, setKlasifikasi] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const fd = new FormData(e.currentTarget);
    const nama = fd.get("nama") as string;
    const kontak = fd.get("kontak") as string;
    const tanggal_undang = fd.get("tanggal_undang") as string;

    if (!nama.trim() || !kontak.trim() || !tanggal_undang) {
      setError("Nama, kontak, dan tanggal undang wajib diisi.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, kontak, tanggal_undang }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Terjadi kesalahan.");
      return;
    }

    setSuccess(true);
    formRef.current?.reset();
    setKlasifikasi("");
  }

  if (success) {
    return (
      <div className="glass-panel flex flex-col items-center gap-4 rounded-2xl p-8 text-center">
        <CheckCircle2 className="h-14 w-14 text-green-500" />
        <div>
          <p className="text-xl font-black text-ink">Visitor Terdaftar!</p>
          <p className="mt-1 text-muted">
            Status awal: <span className="font-bold text-brand-700">terdaftar</span>.
            Admin akan update ke hadir/konversi setelah meeting.
          </p>
        </div>
        <Button onClick={() => setSuccess(false)}>Daftarkan Visitor Lagi</Button>
      </div>
    );
  }

  return (
    <form ref={formRef} className="glass-panel space-y-5 rounded-2xl p-5" onSubmit={handleSubmit}>
      <div>
        <p className="mb-1 text-sm font-bold uppercase tracking-[0.12em] text-brand-700">Visitor</p>
        <p className="text-sm text-muted">
          Daftarkan tamu yang kamu undang ke meeting BNI Grow. Status awal:{" "}
          <span className="font-bold">terdaftar</span>. Admin akan update ke hadir/konversi.
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>
      )}

      <label className="block">
        <span className="mb-2 block text-sm font-black text-ink">Nama Visitor <span className="text-brand-600">*</span></span>
        <input className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500" name="nama" type="text" placeholder="Nama lengkap visitor" required />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-black text-ink">Nama perusahaan</span>
        <input className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500" name="nama_perusahaan" type="text" placeholder="Contoh: PT Maju Jaya" />
      </label>

      <div>
        <label className="mb-2 block text-sm font-black text-ink">Klasifikasi bisnis</label>
        <div className="relative">
          <select
            className="w-full appearance-none rounded-2xl border border-brand-100 bg-white px-4 py-3 text-ink outline-none focus:ring-2 focus:ring-brand-500"
            name="klasifikasi_bisnis"
            value={klasifikasi}
            onChange={(e) => setKlasifikasi(e.target.value)}
          >
            <option value="">Pilih kategori bisnis tamu…</option>
            {KLASIFIKASI.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-3.5 h-4 w-4 text-muted" />
        </div>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-black text-ink">Kontak (WhatsApp / email) <span className="text-brand-600">*</span></span>
        <input className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500" name="kontak" type="text" placeholder="Contoh: 08123456789" required />
        <p className="mt-1 text-xs text-muted">Harus unik per season — satu kontak hanya bisa didaftarkan sekali.</p>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-black text-ink">Tanggal undang <span className="text-brand-600">*</span></span>
        <input className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500" name="tanggal_undang" type="date" max={today} required />
      </label>

      <div className="rounded-xl bg-brand-50 p-4 text-sm text-muted">
        <p className="font-bold text-ink">Milestone skor visitor:</p>
        <ul className="mt-2 space-y-1">
          <li>Terdaftar → Hadir: <span className="font-bold text-brand-700">+20 pts</span></li>
          <li>Hadir → Hadir Penuh: <span className="font-bold text-brand-700">+30 pts</span></li>
          <li>Konversi jadi member: <span className="font-bold text-brand-700">+100 pts</span></li>
        </ul>
        <p className="mt-2 text-xs">Update milestone dilakukan oleh Grow Coordinator.</p>
      </div>

      <Button className="w-full" type="submit" disabled={submitting}>
        <Send className="h-5 w-5" />
        {submitting ? "Mendaftarkan…" : "Daftarkan Visitor"}
      </Button>
    </form>
  );
}
