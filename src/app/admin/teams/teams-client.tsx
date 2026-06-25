"use client";

import { Edit2, Plus, Save, Trash2, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export type TeamRow = {
  id: string;
  nama_tim: string;
  jumlah_member: number;
};

function EditRow({ team, onDone }: { team: TeamRow; onDone: () => void }) {
  const [nama, setNama] = useState(team.nama_tim);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/admin/teams/${team.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama_tim: nama }),
    });
    setSaving(false);
    onDone();
  }

  return (
    <div className="flex items-center gap-2">
      <input
        className="flex-1 rounded-xl border border-brand-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
        value={nama}
        onChange={e => setNama(e.target.value)}
        autoFocus
      />
      <button onClick={save} disabled={saving} className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50">
        <Save className="h-4 w-4" />
      </button>
      <button onClick={onDone} className="grid h-9 w-9 place-items-center rounded-xl border border-brand-100 text-muted hover:bg-brand-50">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function TeamsClient({ initial }: { initial: TeamRow[] }) {
  const router = useRouter();
  const [teams, setTeams] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addName, setAddName] = useState("");
  const [adding, setAdding] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState("");

  async function reload() {
    const res = await fetch("/api/admin/teams");
    const d = await res.json();
    setTeams(d.teams ?? []);
    router.refresh();
  }

  async function handleAdd() {
    if (!addName.trim()) return;
    setAdding(true);
    setError("");
    const res = await fetch("/api/admin/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama_tim: addName.trim() }),
    });
    setAdding(false);
    if (res.ok) {
      setAddName("");
      setShowAdd(false);
      reload();
    } else {
      const d = await res.json();
      setError(d.error ?? "Gagal menyimpan.");
    }
  }

  async function handleDelete(id: string, jumlah: number) {
    if (jumlah > 0) {
      setError("Team masih memiliki member. Pindahkan member terlebih dahulu.");
      return;
    }
    if (!confirm("Hapus tim ini?")) return;
    const res = await fetch(`/api/admin/teams/${id}`, { method: "DELETE" });
    if (res.ok) reload();
    else { const d = await res.json(); setError(d.error ?? "Gagal menghapus."); }
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black text-ink">Daftar Team</h2>
        <Button onClick={() => { setShowAdd(true); setError(""); }}>
          <Plus className="h-4 w-4" />
          Tambah Tim
        </Button>
      </div>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>
      )}

      {showAdd && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-brand-200 bg-white p-4">
          <input
            className="flex-1 rounded-xl border border-brand-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Nama tim baru…"
            value={addName}
            onChange={e => setAddName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            autoFocus
          />
          <Button onClick={handleAdd} disabled={adding}>
            {adding ? "…" : "Simpan"}
          </Button>
          <Button variant="secondary" onClick={() => { setShowAdd(false); setAddName(""); }}>
            Batal
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {teams.map((team) => (
          <div key={team.id} className="rounded-2xl border border-brand-100 bg-white p-4">
            {editingId === team.id ? (
              <EditRow team={team} onDone={() => { setEditingId(null); reload(); }} />
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-700">
                    <Users className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-black text-ink">{team.nama_tim}</p>
                    <p className="text-xs text-muted">{team.jumlah_member} member</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(team.id)}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-brand-100 text-brand-600 hover:bg-brand-50"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(team.id, team.jumlah_member)}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-red-100 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
