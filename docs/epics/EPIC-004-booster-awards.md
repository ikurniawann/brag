---
status: backlog
environment: dev
phase: 4
priority: P1
area: gamification
retries: 0
prd: ../product/PRD.md
stories: ../product/USER-STORIES.md
tasks: ../product/ENGINEERING-TASKS.md
---

# EPIC-004: Badges, Prize Pool & Raffle

## Goal

Complete the gamification layer: automatic badge award engine (12 conditions), prize pool with member donation + admin management, raffle ticket generation, and end-of-season raffle draw.

## User Stories

- US-BADGE-1 to US-BADGE-2
- US-PRIZE-1 to US-PRIZE-4

## Tasks

- [ ] T-026: Badge engine — 12 conditions, idempotent (BE)
- [ ] T-027: Badge display on dashboard (FE)
- [ ] T-028: Prize pool page for member (FE)
- [ ] T-029: Donate prize form (FE)
- [ ] T-030: Prize pool APIs (BE)
- [ ] T-031: Admin prize management (FE/BE)
- [ ] T-032: Admin raffle draw endpoint (BE)

## Acceptance Criteria

- [ ] All 12 badge conditions implemented and tested
- [ ] Badge award is idempotent (unique constraint)
- [ ] Raffle ticket formula: floor(score_overall/100) + 1 per visitor hadir + 1 per new pair
- [ ] Prize donation: pending → admin approve → PATRON badge awarded
- [ ] Raffle draw: one winner per undian prize, randomized from raffle_tickets

## Automation Log

| Date | Event | Result |
|------|-------|--------|

## Dependencies

- EPIC-002: score_ledger writes; badge triggers after each write
- EPIC-003: score_overall needed for raffle ticket computation
