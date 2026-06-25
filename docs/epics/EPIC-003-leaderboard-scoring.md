---
status: backlog
environment: dev
phase: 3
priority: P0
area: leaderboard
retries: 0
prd: ../product/PRD.md
stories: ../product/USER-STORIES.md
tasks: ../product/ENGINEERING-TASKS.md
---

# EPIC-003: Weekly Events, Leaderboard & Full Roster

## Goal

Implement admin weekly event management (12 event codes), the 6 leaderboard views from score_ledger, and the Full Roster weekly bonus check.

## User Stories

- US-EVENT-1 to US-EVENT-2
- US-LB-1 to US-LB-3

## Tasks

- [ ] T-021: Admin weekly event UI + `POST /api/admin/weekly-events` (FE/BE)
- [ ] T-022: `GET /api/weekly-events/current` — used by scoring engine (BE)
- [ ] T-023: 6 leaderboard queries with tie-breaker (BE)
- [ ] T-024: Leaderboard page — 6 tabs, current user highlighted (FE)
- [ ] T-025: Full Roster weekly check — +100 team bonus + TEAM_PLAYER badge (BE)

## Acceptance Criteria

- [ ] Only one weekly_events row active per season at a time
- [ ] CAT_CAROUSEL requires target_classification_id
- [ ] All 6 leaderboards read exclusively from score_ledger
- [ ] Bonus (kategori=bonus) only appears in Overall leaderboards
- [ ] Full Roster: all `is_active` members of team have ≥1 ledger entry in that calendar week
- [ ] Full Roster bonus not double-awarded for same week

## Automation Log

| Date | Event | Result |
|------|-------|--------|

## Dependencies

- EPIC-002: score_ledger must have data to aggregate
