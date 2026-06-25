"use client";

import { ChevronDown, Send, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Team = { id: string; nama_tim: string };
type Klas = { id: string; nama: string };

export function NewMemberForm() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [klasifikasi, setKlasifikasi] = useState<Klas[]>([]);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    team_id: "",
    klasifikasi_id: "",
    color_status: "merah",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/teams-meta")
      .then((r) => r.json())
      .then((d) => {
        setTeams(d.teams ?? []);
        setKlasifikasi(d.klasifikasi ?? []);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/members");
      router.refresh();
    } else {
      const d = await res.json();
      setError(d.error ?? "Gagal menyimpan.");
    }
  }

  const field = (
    label: string,
    key: keyof typeof form,
    opts?: { type?: string; placeholder?: string; required?: boolean }
  ) => (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-ink">
        {label} {opts?.required !== false && <span className="text-brand-600">*</span>}
      </span>
      <input
        className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500"
        type={opts?.type ?? "text"}
        placeholder={opts?.placeholder}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        required={opts?.required !== false}
      />
    </label>
  );

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/members" className="text-sm font-bold text-brand-600 hover:underline">
          ← Kembali
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="flex items-center gap-3 text-3xl font-black text-ink">
          <UserPlus className="h-7 w-7 text-brand-600" />
          Tambah Member
        </h1>
        <p className="mt-2 text-muted">Member baru akan masuk ke season BRAG 2026.</p>
      </div>

      <form className="glass-panel space-y-5 rounded-2xl p-5" onSubmit={handleSubmit}>
        {field("Nama Lengkap", "full_name", { placeholder: "Nama lengkap member" })}
        {field("Email", "email", { type: "email", placeholder: "email@domain.com" })}
        {field("Password", "password", { type: "password", placeholder: "Default: member123", required: false })}

        <label className="block">
          <span className="mb-2 block text-sm font-black text-ink">
            Team <span className="text-brand-600">*</span>
          </span>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-2xl border border-brand-100 bg-white px-4 py-3 text-ink outline-none focus:ring-2 focus:ring-brand-500"
              value={form.team_id}
              onChange={(e) => setForm({ ...form, team_id: e.target.value })}
              required
            >
              <option value="">Pilih tim…</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.nama_tim}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-3.5 h-4 w-4 text-muted" />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-black text-ink">Klasifikasi Bisnis</span>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-2xl border border-brand-100 bg-white px-4 py-3 text-ink outline-none focus:ring-2 focus:ring-brand-500"
              value={form.klasifikasi_id}
              onChange={(e) => setForm({ ...form, klasifikasi_id: e.target.value })}
            >
              <option value="">Pilih klasifikasi…</option>
              {klasifikasi.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-3.5 h-4 w-4 text-muted" />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-black text-ink">Status Warna</span>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-2xl border border-brand-100 bg-white px-4 py-3 text-ink outline-none focus:ring-2 focus:ring-brand-500"
              value={form.color_status}
              onChange={(e) => setForm({ ...form, color_status: e.target.value })}
            >
              <option value="merah">Merah</option>
              <option value="kuning">Kuning</option>
              <option value="hijau">Hijau</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-3.5 h-4 w-4 text-muted" />
          </div>
        </label>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>
        )}

        <Button className="w-full" type="submit" disabled={saving}>
          <Send className="h-5 w-5" />
          {saving ? "Menyimpan…" : "Tambah Member"}
        </Button>
      </form>
    </div>
  );
}
