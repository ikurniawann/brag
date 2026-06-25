# BRAG — Project OS

> Gamification platform for the BNI Grow annual member challenge.

@docs/CONVENTIONS.md @docs/AGENTS.md

---

## Stack

| Key | Value |
|-----|-------|
| Type | Single Next.js app |
| Package manager | npm |
| Framework | Next.js App Router + TypeScript |
| Database | PostgreSQL — local dev via `pg` client |
| Auth | Local bcrypt + cookie session (`src/lib/local-auth.ts`) |
| Styling | Tailwind CSS + glassmorphism, BNI red brand |
| Page pattern | `src/app/**/page.tsx` |
| Shared types | `src/lib/domain/types.ts` |
| DB client | `src/lib/db.ts` |
| Integration branch | `main` |

**Protected paths** (require explicit approval before editing):
- `db/local/` — schema migrations
- `.env.local`, `.env` — never commit

## Domain Model (Spec v1.0)

**Roles:** `member` | `admin` (Growth Coordinator — satu-satunya approver)

**Core tables:**
- `members` — competition profile (user_id, team_id, klasifikasi_id, color_status: merah|kuning|hijau)
- `tyfcb_entries` — TYFCB submissions (giver_id ≠ receiver_id, nilai, status: pending|verified|rejected)
- `visitors` — visitor registrations (inviter_id, status_hadir: terdaftar|hadir|hadir_penuh, is_converted)
- `weekly_events` — 12 event codes, one active per week
- **`score_ledger`** — single source of truth for ALL aggregation (append-only)
- `badges` + `member_badges` — 12 badges, auto-awarded
- `prize_pool` + `raffle_tickets` — two-layer prize system

**Scoring:**
- TYFCB: `computed_score = round(B × P × M)` — Band × Pair Penalty × Event Multiplier
- Visitor: milestone increments (20 → +30 → +100) via admin update
- Team bonus: Full Roster +100/week, Level Up +75/+150
- Flat bonus (NOT multiplied): HIGH_ROLLER +50, ONE_TO_ONE +30, STREAK +40

**NO "referral" category** — spec only has TYFCB + Visitor.

---

## The Front Door — Commands

| Command | Purpose |
|---------|---------|
| `/epic-loop [EPIC-FILE]` | Autonomous epic execution — plan, code, review, test, deploy DEV |
| `/task-work EPIC-XXX [n]` | Implement one task from an epic |
| `/epic-new` | Plan a new epic and write docs/epics/EPIC-XXX.md |
| `/nerve "<task>"` | Three-layer intelligent task execution |
| `/engage <persona> "<task>"` | Activate expert persona then execute |
| `/code-review` | Review current diff for bugs and cleanups |
| `/verify` | Run app and verify a change works end-to-end |

---

## The Nervous System

Three-layer routing for all tasks:

```
L1 SENSE     → Classify task; handle trivial cases directly
L2 COORDINATE → Route to best agent; run gates (QA → Test → Security)
L3 ESCALATE  → Human judgment for ambiguity, conflicts, or retry exhaustion (3+)
```

**Gate scripts:**
- `scripts/qa.sh` — ESLint + TypeScript check
- `scripts/test.sh` — Next.js build
- `scripts/security-check.sh` — Secrets scan + npm audit
- `scripts/deploy-dev.sh` — DEV-only build + health check

**Guardrails (always enforced):**
- No `git push --force` to any branch
- No production deployments from autonomous runs
- No SQL `DROP`, `TRUNCATE`, or unguarded `DELETE FROM` (without WHERE)
- No hardcoded secrets — always use `process.env.*`
- `point_events` table is insert-only in application code

---

## Agents

| Agent | Role | Reuse Policy |
|-------|------|--------------|
| `code-agent` | Implements one task; no commits, no scope invention | Project conventions-aware coder |
| `epic-orchestrator` | Drives epic loop across all agents | Swarm coordinator |
| `review-qa-agent` | Checks change against acceptance criteria | QA gate |
| `security-agent` | Runs security-check.sh + checks tenant guards | Security gate |
| `test-agent` | Runs lint, typecheck, build | Test gate |
| `deploy-agent` | Runs deploy-dev.sh; DEV only | Deploy gate |

Prefer ECC/Ruflo pre-built agents for generic tasks. Custom agents above for BRAG-specific conventions only.

---

## Expert Personas

| Activation | Best For |
|------------|---------|
| `/engage startup-mvp "..."` | Build a new feature from scratch end-to-end |
| `/engage frontend-engineer "..."` | Mobile-first UI, Tailwind components |
| `/engage backend-systems "..."` | API design, DB schema, scoring engine |
| `/engage security-audit "..."` | Auth flows, SQL injection checks |
| `/engage codebase-audit "..."` | Understand an unfamiliar part of BRAG |
| `/engage debug-production "..."` | Investigate a live bug |
| `/engage clean-architecture "..."` | Refactor without behavior change |

---

## Epic Lifecycle

```
backlog → on-progress → coding → review → testing → deploying-dev → ready-for-qa → done
                                                                             ↓
                                                                          blocked
```

Epics live in `docs/epics/`. The registry is `docs/epics/README.md`.  
Every code decision is logged in the epic's **Automation Log**.

---

## Key Paths

```
src/app/               Next.js pages (App Router)
src/lib/domain/        Shared TypeScript types
src/lib/db.ts          PostgreSQL client
src/lib/local-auth.ts  Auth: sign-in, session, bcrypt
src/lib/auth.ts        Session helpers and role checks
src/components/        Shared React components
db/local/              SQL migration files
docs/product/          PRD, user stories, acceptance criteria, tasks
docs/epics/            EPIC-XXX.md files (canonical work tracking)
scripts/               Gate scripts (qa, test, security, deploy-dev)
.agentic/config.yml    Project manifest
```

---

## Deployment & Security Rules

**Allowed in autonomous runs:**
- All local DB operations
- `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`
- Creating branches, commits, and PRs

**Manual-only (never autonomous):**
- Production Vercel deployments
- Database schema migrations (`db/local/*.sql`)
- Changing `.env.local` or any secret value
- Force-push to `main`
