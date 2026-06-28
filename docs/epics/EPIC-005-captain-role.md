---
status: backlog
environment: dev
phase: 5
priority: P1
area: captain
retries: 0
prd: ../product/PRD.md
stories: ../product/USER-STORIES.md
tasks: ../product/ENGINEERING-TASKS.md
---

# EPIC-005: Captain Role

## Goal

Introduce a `captain` role sitting between `member` and `admin`. Each team has one Captain who can manage their own team members: submit TYFCB and Visitors on their behalf, reset member passwords, and void incorrectly submitted entries (pending only). Admin appoints/removes Captains via the existing member management page.

## Role Hierarchy

```
admin     → full access to all teams
captain   → scoped to their own team only
member    → scoped to themselves only
```

A Captain is still a regular competition member (their own scores count). They additionally have management access over the members sharing their `team_id`.

## Constraints

- Captain can only manage members in the **same team** (`m.team_id = captain.team_id`).
- Captain **cannot** manage other captains or admins.
- Void is only allowed on **pending** TYFCB entries and **terdaftar** visitors (not yet admin-verified/attended).
- Password reset generates a new password chosen by the captain — they are responsible for communicating it to the member.
- Captain cannot promote/demote roles — only Admin can.
- All captain actions are logged via existing DB fields (`submitted_by`, `keterangan`).

## Database Migrations (manual — `db/local/`)

Two migrations required before code is merged:

### `db/local/005_captain_role.sql`

```sql
-- 1. Add 'captain' to app_role enum
alter type app_role add value 'captain';

-- 2. Add 'void' to tyfcb_status enum
alter type tyfcb_status add value 'void';

-- 3. Track who submitted a TYFCB entry on behalf of a member
alter table tyfcb_entries
  add column if not exists submitted_by uuid references app_users(id);

-- 4. Track who voided an entry
alter table tyfcb_entries
  add column if not exists voided_by uuid references app_users(id),
  add column if not exists voided_at timestamptz;

alter table visitors
  add column if not exists voided_by uuid references app_users(id),
  add column if not exists voided_at timestamptz,
  add column if not exists is_void boolean not null default false;
```

## Tasks

### Phase 1 — Auth & Admin wiring

- [ ] **T-E05-01** DB migration `db/local/005_captain_role.sql` (manual apply on server)
- [ ] **T-E05-02** Update `LocalUser` type (`src/lib/local-auth.ts`) to include `'captain'` in role union
- [ ] **T-E05-03** Add `requireCaptain()` helper (`src/lib/auth.ts`) — allows `captain` **and** `admin`
- [ ] **T-E05-04** Extend `PATCH /api/admin/members/[id]` to allow `role = 'captain'`
- [ ] **T-E05-05** Admin member list UI — 3-way role toggle: Member / Captain / Admin (replace current binary toggle)
- [ ] **T-E05-06** Middleware (`src/middleware.ts`) — `/captain/*` requires session; non-captain/admin redirected to `/`

### Phase 2 — Captain API endpoints

- [ ] **T-E05-07** `GET /api/captain/team` — return list of members in captain's team (id, full_name, email, color_status)
- [ ] **T-E05-08** `POST /api/captain/tyfcb` — submit TYFCB on behalf of `member_id` (must be same team); sets `submitted_by = captain.id`
- [ ] **T-E05-09** `POST /api/captain/visitors` — submit visitor on behalf of `member_id` (must be same team); sets `submitted_by = captain.id`
- [ ] **T-E05-10** `PATCH /api/captain/members/[id]/password` — reset password for a team member; body: `{ new_password: string }` (min 6 chars); hashes with `crypt($1, gen_salt('bf'))`
- [ ] **T-E05-11** `PATCH /api/captain/tyfcb/[id]/void` — set `status = 'void'`, `voided_by`, `voided_at`; only allowed if `status = 'pending'`; entry must belong to a member in captain's team
- [ ] **T-E05-12** `PATCH /api/captain/visitors/[id]/void` — set `is_void = true`, `voided_by`, `voided_at`; only allowed if `status_hadir = 'terdaftar'`; entry must belong to captain's team

### Phase 3 — Captain panel UI

- [ ] **T-E05-13** Captain panel page `/captain` (Server Component) — header with team name + member count; tabs: `Kirim TYFCB`, `Kirim Visitor`, `Anggota Tim`
- [ ] **T-E05-14** Captain TYFCB form — member picker (dropdown: team members only, excluding self), nilai, tanggal; calls `POST /api/captain/tyfcb`
- [ ] **T-E05-15** Captain visitor form — member picker, nama visitor, kontak, tanggal_undang; calls `POST /api/captain/visitors`
- [ ] **T-E05-16** Captain member list tab — per member: name, email, TYFCB count, visitor count; action buttons: "Reset Password", "Lihat Entri"; void button appears on each pending TYFCB/visitor entry
- [ ] **T-E05-17** Navigation — show "Panel Kapten" link in `ProfileMenu` when `isAdmin` or `isCaptain`

## Acceptance Criteria

- [ ] Admin can set role to `captain` for any member; cannot set role to `captain` for themselves if they are admin
- [ ] Captain sees "Panel Kapten" in nav; member without captain role cannot access `/captain/*` (redirected to `/`)
- [ ] Captain TYFCB submit: entry appears in admin verify queue with correct `giver_id` (the team member, not the captain), `submitted_by` = captain
- [ ] Captain TYFCB self-block: cannot submit TYFCB where `member_id = captain's own member id`
- [ ] Captain Visitor submit: entry appears with correct `inviter_id` (the team member)
- [ ] Void: can only void pending/terdaftar entries; verified entries return 409
- [ ] Void: only entries from captain's team; entries from other teams return 403
- [ ] Password reset: affected member can log in with new password immediately
- [ ] QA, Test, Security gates pass

## Automation Log

| Date | Event | Result |
|------|-------|--------|

## Dependencies

- EPIC-000: schema + auth
- EPIC-001: TYFCB + visitor submission flows
- EPIC-002: admin member management page (extends existing role toggle)
