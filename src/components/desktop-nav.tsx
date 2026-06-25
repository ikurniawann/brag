"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, Plus, Users, Zap } from "lucide-react";

const navItems = [
  { href: "/",            label: "Dashboard",   icon: Home },
  { href: "/leaderboard", label: "Leaderboard", icon: BarChart3 },
  { href: "/submit",      label: "Contribute",  icon: Plus, primary: true },
  { href: "/booster",     label: "Booster",     icon: Zap },
  { href: "/admin/members", label: "Member",    icon: Users },
];

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 z-20 hidden -translate-x-1/2 lg:block">
      <div className="flex items-center gap-1 rounded-full border border-brand-100/70 bg-white/88 px-3 py-2 shadow-[0_8px_48px_rgba(196,18,48,0.13)] backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="mx-1 flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-md transition hover:bg-brand-700 active:scale-95"
                aria-label="Contribute"
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-brand-600 text-white"
                  : "text-muted hover:bg-brand-50 hover:text-brand-600"
              }`}
            >
              <Icon className="h-[1.1rem] w-[1.1rem]" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
