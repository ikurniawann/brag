import { Award, Medal, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";

const awards = [
  { title: "Top Group of the Week", winner: "Red Falcons", icon: Award },
  { title: "BRAG MVP Member", winner: "Nadia Putri", icon: Medal },
  { title: "Booster Hunter", winner: "Ilham Kurniawan", icon: Sparkles }
];

export default async function AwardsPage() {
  await requireUser();

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-ink">Awards</h1>
        <p className="mt-2 text-muted">
          Weekly and final recognition will appear here after rules are confirmed.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {awards.map((award) => {
          const Icon = award.icon;
          return (
            <article className="glass-panel rounded-2xl p-5" key={award.title}>
              <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600">
                <Icon className="h-7 w-7" />
              </span>
              <h2 className="mt-5 text-xl font-black text-ink">{award.title}</h2>
              <p className="mt-2 text-brand-600 font-black">{award.winner}</p>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
