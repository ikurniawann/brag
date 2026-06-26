import { KeyRound, Mail, User } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { ChangePasswordForm, ForgotPasswordButton } from "./profile-client";

async function getMemberStatus(userId: string) {
  const { rows } = await query<{ color_status: string; nama_tim: string | null }>(`
    select m.color_status, t.nama_tim
    from members m
    left join teams t on t.id = m.team_id
    join event_seasons es on es.id = m.season_id
    where m.user_id = $1 and es.nama = 'BRAG 2026'
    limit 1
  `, [userId]);
  return rows[0] ?? null;
}

const COLOR_BADGE: Record<string, string> = {
  merah:  "bg-red-50 text-red-700",
  kuning: "bg-yellow-50 text-yellow-700",
  hijau:  "bg-green-50 text-green-700",
};

export default async function ProfilePage() {
  const { user } = await requireUser();
  const memberStatus = await getMemberStatus(user.id);

  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AppShell>
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <h1 className="text-3xl font-black text-ink">Profil</h1>
          <p className="mt-1 text-muted">Informasi akun dan pengaturan password.</p>
        </div>

        {/* Identity card */}
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brand-600 text-xl font-black text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xl font-black text-ink">{user.full_name}</p>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                  <User className="h-3 w-3" />
                  {user.role === "admin" ? "Admin" : "Member"}
                </span>
                {memberStatus && (
                  <>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${COLOR_BADGE[memberStatus.color_status]}`}>
                      {memberStatus.color_status}
                    </span>
                    {memberStatus.nama_tim && (
                      <span className="rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                        {memberStatus.nama_tim}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="glass-panel rounded-2xl p-5">
          <div className="mb-5 flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-brand-600" />
            <h2 className="text-lg font-black text-ink">Ganti Password</h2>
          </div>
          <ChangePasswordForm />
        </div>

        {/* Forgot password */}
        <ForgotPasswordButton fullName={user.full_name} email={user.email} />
      </div>
    </AppShell>
  );
}
