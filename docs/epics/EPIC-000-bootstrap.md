---
status: on-progress
environment: dev
phase: 0
priority: P0
area: infra
retries: 0
prd: ../product/PRD.md
stories: ../product/USER-STORIES.md
tasks: ../product/ENGINEERING-TASKS.md
---

# EPIC-000: Bootstrap & Infrastructure

## Goal

Establish a working Next.js app with PostgreSQL schema aligned to spec v1.0, local auth, and role-based route protection so all subsequent epics have a stable foundation.

## User Stories

- US-AUTH-1 to US-AUTH-4

## Tasks

- [x] T-002: Local auth (bcrypt + user_sessions) ✅
- [ ] T-001: DB schema v2 rewrite (score_ledger architecture)
- [ ] T-003: Next.js middleware (route protection + role guard)

## Acceptance Criteria

- [ ] `psql -d brag_dev -f db/local/001_initial.sql` completes without error
- [ ] All tables exist: app_users, user_sessions, event_seasons, classifications, teams, members, tyfcb_entries, visitors, weekly_events, score_ledger, badges, member_badges, prize_pool, raffle_tickets
- [ ] Badge seed data: all 12 badges inserted
- [ ] 10 teams seeded for BRAG 2026 season
- [ ] Classifications seeded (Retail, Jasa, Properti, etc.)
- [ ] `POST /api/auth/login` with valid credentials → session cookie
- [ ] `POST /api/auth/login` with invalid credentials → 401
- [ ] Navigating to `/` without session → redirect to `/login`
- [ ] Navigating to `/admin/*` as member → 403
- [ ] `npm run lint` exits 0
- [ ] `npm run typecheck` exits 0

## Automation Log

| Date | Event | Result |
|------|-------|--------|
| 2026-06-24 | Initial scaffold: Next.js App Router, TypeScript, Tailwind | Done |
| 2026-06-24 | DB schema v1 created (point_events architecture) | Done |
| 2026-06-24 | Local auth implemented in src/lib/local-auth.ts | Done |
| 2026-06-24 | Agentic Workflow Kit integrated | Done |
| 2026-06-24 | DB schema rewritten to v2 (score_ledger architecture per spec v1.0) | Applied ✅ |
| 2026-06-24 | TypeScript types rewritten to match spec v1.0 | Done ✅ |
| 2026-06-24 | mock-data.ts updated to new domain model | Done ✅ |
| 2026-06-24 | All pages updated to use new types (no TypeScript errors) | Done ✅ |

## Dependencies

None — foundation epic.

## Breaking Changes from v1 Schema

- Removed: `contributions`, `contribution_types`, `scoring_rules`, `booster_rules`, `point_events`, `awards`, `award_assignments`
- Removed: `referral` as contribution category (spec only has TYFCB + Visitor)
- Added: `tyfcb_entries` (replaces contributions for TYFCB)
- Added: `visitors` (replaces contributions for Visitor, now separate table)
- Added: `score_ledger` (replaces point_events — single source of truth)
- Added: `weekly_events` (replaces booster_rules)
- Added: `classifications`, `members` (competition profile separate from app_users)
- Added: `badges`, `member_badges`, `prize_pool`, `raffle_tickets`
- Changed: `groups` → `teams`; `app_users.role` now only `member|admin` (no super_admin)
