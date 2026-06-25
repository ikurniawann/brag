import { Mail, LockKeyhole, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { login } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:grid-cols-[1fr_440px] lg:px-8">
      <section className="hidden pr-12 lg:block">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-700">
          BRAG
        </p>
        <h1 className="mt-3 max-w-xl text-6xl font-black tracking-normal text-ink">
          Compete together. Win as a group.
        </h1>
        <p className="mt-5 max-w-lg text-lg text-muted">
          Submit TYFCB, visitors, and referrals. The committee verifies every
          contribution before points move the leaderboard.
        </p>
      </section>

      <section className="glass-panel rounded-3xl p-5 shadow-glass sm:p-7">
        <div className="mb-8">
          <p className="text-4xl font-black text-brand-600">BRAG</p>
          <h2 className="mt-6 text-3xl font-black text-ink">Sign in</h2>
          <p className="mt-2 text-sm text-muted">
            Use the email and password prepared by the committee.
          </p>
        </div>

        {params.error ? (
          <div className="mb-5 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700">
            {params.error}
          </div>
        ) : null}

        <form action={login} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-ink">Email</span>
            <span className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-brand-500">
              <Mail className="h-5 w-5 text-brand-600" />
              <input
                className="w-full bg-transparent text-base outline-none"
                name="email"
                placeholder="member@bnigrow.id"
                required
                type="email"
              />
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-ink">Password</span>
            <span className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-brand-500">
              <LockKeyhole className="h-5 w-5 text-brand-600" />
              <input
                className="w-full bg-transparent text-base outline-none"
                name="password"
                placeholder="••••••••"
                required
                type="password"
              />
            </span>
          </label>
          <Button className="w-full" type="submit">
            <LogIn className="h-5 w-5" />
            Login
          </Button>
        </form>
      </section>
    </main>
  );
}
