"use client";

import { KeyRound, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const WA_NUMBER = "6281809078014";

export function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (next !== confirm) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    if (next.length < 6) {
      setError("Password baru minimal 6 karakter.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/profile/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_password: current, new_password: next }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Terjadi kesalahan.");
      return;
    }

    setSuccess(true);
    setCurrent("");
    setNext("");
    setConfirm("");
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>
      )}
      {success && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
          Password berhasil diperbarui.
        </p>
      )}

      <label className="block">
        <span className="mb-1.5 block text-sm font-bold text-ink">Password lama</span>
        <input
          className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500"
          type="password"
          placeholder="••••••••"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-bold text-ink">Password baru</span>
        <input
          className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500"
          type="password"
          placeholder="Min. 6 karakter"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-bold text-ink">Konfirmasi password baru</span>
        <input
          className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500"
          type="password"
          placeholder="Ulangi password baru"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </label>

      <Button className="w-full" type="submit" disabled={loading}>
        <KeyRound className="h-4 w-4" />
        {loading ? "Menyimpan…" : "Simpan Password"}
      </Button>
    </form>
  );
}

export function ForgotPasswordButton({ fullName, email }: { fullName: string; email: string }) {
  const text = encodeURIComponent(
    `Halo Ilham, saya ${fullName} (${email}) ingin meminta reset password akun BRAG 2026 saya. Mohon bantuannya ya. Terima kasih 🙏`
  );
  const url = `https://wa.me/${WA_NUMBER}?text=${text}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700 transition hover:bg-green-100"
    >
      <MessageCircle className="h-4 w-4" />
      Lupa password? Hubungi Admin via WhatsApp
    </a>
  );
}

export function LoginForgotPasswordButton() {
  const text = encodeURIComponent(
    `Halo Ilham, saya ingin meminta reset password akun BRAG 2026 saya. Mohon bantuannya ya. Terima kasih 🙏`
  );
  const url = `https://wa.me/${WA_NUMBER}?text=${text}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700 transition hover:bg-green-100"
    >
      <Send className="h-4 w-4" />
      Lupa password? Chat Admin via WhatsApp
    </a>
  );
}
