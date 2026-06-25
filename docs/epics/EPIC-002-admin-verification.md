---
status: backlog
environment: dev
phase: 2
priority: P0
area: admin
retries: 0
prd: ../product/PRD.md
stories: ../product/USER-STORIES.md
tasks: ../product/ENGINEERING-TASKS.md
---

# EPIC-002: Admin — Verifikasi & Management

## Goal

Enable the Growth Coordinator to verify TYFCB entries (triggering score computation B×P×M), update visitor milestones (triggering milestone scores), manage member color_status (triggering team bonuses), and manage members/teams.

## User Stories

- US-VERIFY-1 to US-VERIFY-4
- US-VISITOR-ADMIN-1 to US-VISITOR-ADMIN-2
- US-ADMIN-MEMBER-1 to US-ADMIN-MEMBER-3
- US-ADMIN-TEAM-1

## Tasks

- [ ] T-011: Admin verify TYFCB page (FE)
- [ ] T-012: `POST /api/admin/tyfcb/[id]/approve` — B×P×M + ledger + badges (BE)
- [ ] T-013: `POST /api/admin/tyfcb/[id]/reject` (BE)
- [ ] T-014: `POST /api/admin/tyfcb/[id]/reverse` — negative correction row (BE)
- [ ] T-015: Admin visitor milestone page (FE)
- [ ] T-016: `PATCH /api/admin/visitors/[id]` — milestone scoring (BE)
- [ ] T-017: Admin member management page (FE)
- [ ] T-018: `PATCH /api/admin/members/[id]` — color_status + team bonus (BE)
- [ ] T-019: Admin team management page (FE)
- [ ] T-020: Team CRUD APIs (BE)

## Acceptance Criteria

See `docs/product/ACCEPTANCE-CRITERIA.md` → TYFCB SCORING, VISITOR, TEAM BONUSES sections.

### Critical scoring invariants:
- [ ] `computed_score = round(B × P × M)` — all 7 bands correct
- [ ] `pair_ordinal` uses verification order, not input order
- [ ] Event multiplier applied only when entry date falls in event's date range AND entry qualifies
- [ ] score_ledger is append-only; corrections are negative rows
- [ ] Double-approve returns 409
- [ ] Level-up: merah→kuning = +75, kuning→hijau = +150 to team (member_id=null)

## Automation Log

| Date | Event | Result |
|------|-------|--------|

## Dependencies

- EPIC-000: schema + auth + middleware
- EPIC-001: entries exist to verify
