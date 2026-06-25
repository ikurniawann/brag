import Link from "next/link";
import { BarChart3, Home, Plus, Users, Zap } from "lucide-react";
import { getCurrentUser } from "@/lib/local-auth";
import { NotificationBell } from "./notification-bell";
import { ProfileMenu } from "./profile-menu";

const navItems = [
  { href: "/",             label: "Dashboard",   icon: Home },
  { href: "/leaderboard",  label: "Leaderboard", icon: BarChart3 },
  { href: "/submit",       label: "Contribute",  icon: Plus, primary: true },
  { href: "/booster",      label: "Booster",     icon: Zap },
  { href: "/admin/members",label: "Member",      icon: Users },
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "admin";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-8">
      <header className="mb-6 flex items-center justify-between">
        <Link href="/" className="leading-none" aria-label="BRAG dashboard">
          <span className="block text-4xl font-black tracking-normal text-brand-600">
            BRAG 2026
          </span>
          <span className="mt-1 block text-[0.68rem] font-bold uppercase tracking-[0.18em] text-brand-700">
            BNI Grow Annual Challenge
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-ink">Season 2026</p>
            <p className="text-xs text-muted">Week 2 of 12</p>
          </div>
          <NotificationBell />
          <ProfileMenu
            initials={
              user?.full_name
                ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                : "?"
            }
            isAdmin={isAdmin}
          />
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-20 border-t border-brand-100 bg-white/92 px-2 pt-2 shadow-[0_-14px_40px_rgba(80,0,18,0.10)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 items-end gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                className={
                  item.primary
                    ? "-mt-7 flex h-16 w-16 flex-col items-center justify-center justify-self-center rounded-full bg-brand-600 text-white shadow-lift"
                    : "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[0.68rem] font-semibold text-muted"
                }
                href={item.href}
                key={item.href}
              >
                <Icon className="h-5 w-5" />
                <span className={item.primary ? "sr-only" : ""}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
