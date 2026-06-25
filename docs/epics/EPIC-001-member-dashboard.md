---
status: backlog
environment: dev
phase: 1
priority: P0
area: member
retries: 0
prd: ../product/PRD.md
stories: ../product/USER-STORIES.md
tasks: ../product/ENGINEERING-TASKS.md
---

# EPIC-001: Member Dashboard & Input

## Goal

Give members a mobile-first dashboard showing their competition standing, and enable input of TYFCB entries (with receiver picker) and Visitor registrations.

## User Stories

- US-DASH-1 to US-DASH-3
- US-TYFCB-1 to US-TYFCB-4
- US-VISITOR-1 to US-VISITOR-3

## Tasks

- [ ] T-004: `GET /api/member/me` — scores + event + raffle count (BE)
- [ ] T-005: Member dashboard page (FE)
- [ ] T-006: TYFCB input form with member picker (FE)
- [ ] T-007: `POST /api/tyfcb` (BE)
- [ ] T-008: Visitor input form (FE)
- [ ] T-009: `POST /api/visitors` (BE)
- [ ] T-010: History pages — TYFCB list + Visitor milestone tracker (FE)

## Acceptance Criteria

- [ ] Dashboard shows: score Overall/TYFCB/Visitor, team score & rank, badges, current weekly event, leaderboard position
- [ ] TYFCB form: member picker (not self), nilai in Rupiah, date ≤ today, optional bukti
- [ ] Visitor form: nama + kontak (required) + tanggal_undang; duplicate kontak → 409
- [ ] All data from real DB (no mock-data.ts)
- [ ] Renders correctly on 375px
- [ ] QA, Test, Security gates all pass

## Automation Log

| Date | Event | Result |
|------|-------|--------|

## Dependencies

- EPIC-000 must be done (DB schema v2 + auth + middleware)
