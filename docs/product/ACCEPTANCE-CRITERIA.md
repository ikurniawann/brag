# BRAG — Acceptance Criteria
> Aligned with Spesifikasi Aplikasi v1.0

## AUTH

### AC-AUTH-1
Given valid email + password  
When member submits login form  
Then session cookie is set and redirect to `/`

Given invalid credentials  
When member submits login form  
Then 401 response, no cookie set

### AC-AUTH-2: Route Protection
- [ ] `/` without session → redirect to `/login`
- [ ] `/admin/*` as member → 403 / redirect
- [ ] Session cookie is `httpOnly`, `sameSite: lax`
- [ ] Role check is server-side in Route Handler or middleware

---

## TYFCB INPUT

### AC-TYFCB-1: Submission
Given a logged-in member  
When they submit TYFCB with receiver_id, nilai, tanggal  
Then a `tyfcb_entries` row is created with `status = pending`  
And it appears in their history

- [ ] `giver_id ≠ receiver_id` enforced (cannot select self)
- [ ] `nilai > 0` required
- [ ] `tanggal` required, cannot be in the future
- [ ] `bukti_url` optional
- [ ] Status starts as `pending`; no `computed_score` yet

---

## TYFCB SCORING (Admin Approve)

### AC-TYFCB-2: Score Computation
Given admin approves a TYFCB entry  
Then `computed_score = round(B × P × M)` is stored on the entry  
And a row is written to `score_ledger` (kategori=tyfcb, points=computed_score)

- [ ] Band B computed correctly for all 7 tiers
- [ ] `pair_ordinal` = count of previously verified entries for same giver→receiver pair in season + 1
- [ ] P = 1.0 for ordinal 1–2, 0.7 for 3–5, 0.5 for 6+
- [ ] M from active weekly_event if entry qualifies; else M=1.0
- [ ] `round()` applied after all multiplications
- [ ] `event_multiplier_applied` stored on entry

### AC-TYFCB-3: Double-Approve Prevention
- [ ] Approving an already-verified entry returns 409

### AC-TYFCB-4: Reject After Verify (Correction)
Given admin rejects an already-verified entry  
Then a negative score_ledger row is written  
And original rows are NOT deleted

---

## VISITOR

### AC-VISITOR-1: Registration
- [ ] `kontak` is required and unique per season (duplicate → error with warning)
- [ ] Starts as `status_hadir = terdaftar`

### AC-VISITOR-2: Milestone Scoring (Admin)
Given admin updates visitor to `hadir`  
Then score_ledger row: points=20, kategori=visitor (or round(20 × M) if event active)

Given admin updates visitor to `hadir_penuh`  
Then score_ledger row: points=30 (incremental)

Given admin marks `is_converted = true`  
Then score_ledger row: points=100 (incremental)

- [ ] Points are incremental (not cumulative — each milestone writes its own row)
- [ ] CLOSING_WEEK event: M=2× applied to conversion milestone only

---

## TEAM BONUSES

### AC-BONUS-1: Full Roster
- [ ] Checked at end of each calendar week
- [ ] Condition: ALL `is_active=true` members of the team have ≥1 score entry in that week
- [ ] If met: score_ledger row with `member_id=null`, `team_id=<id>`, `kategori=bonus`, `points=100`
- [ ] TEAM_PLAYER badge awarded to all qualifying members

### AC-BONUS-2: Level Up
Given admin changes a member's `color_status` from merah→kuning  
Then score_ledger row: team gets +75 (member_id=null, team_id=<id>, bonus)  
And LEVEL_UP badge awarded to member

Given admin changes kuning→hijau  
Then team gets +150

- [ ] Downgrade does NOT trigger reverse score
- [ ] Only upward transitions trigger bonus

---

## LEADERBOARD

### AC-LB-1: 6 Leaderboards
- [ ] All 6 leaderboards read exclusively from `score_ledger`
- [ ] Team Overall = sum all points (tyfcb + visitor + bonus) per team
- [ ] Individu Overall = sum all points per member (excludes team-only bonus rows)
- [ ] Team TYFCB = sum kategori=tyfcb per team; Team Visitor = sum kategori=visitor per team
- [ ] Bonus rows (kategori=bonus) appear in Overall only, not in TYFCB or Visitor leaderboards
- [ ] Pending entries do NOT appear in leaderboard
- [ ] Currently logged-in user's row highlighted

### AC-LB-2: Tie-breaker
- [ ] Individu: more distinct receivers/visitors wins → then earlier timestamp
- [ ] Tim: more members who leveled up wins → then total conversions

---

## WEEKLY EVENTS

### AC-EVENT-1
- [ ] Only one weekly event can be active at a time
- [ ] Event code must be one of the 12 valid codes
- [ ] CAT_CAROUSEL requires `target_classification_id`
- [ ] Event is displayed on member dashboard ("event minggu ini")

---

## BADGES

### AC-BADGE-1: Auto-Award
| Badge | Trigger |
|-------|---------|
| FIRST_BLOOD | First verified TYFCB for member |
| HOST | First visitor reaches `hadir` |
| CLOSER | First visitor `is_converted = true` |
| CONNECTOR | 5 distinct receiver_ids with verified TYFCB |
| SPREADER | 10 distinct receiver_ids with verified TYFCB |
| CENTURION | score_overall (from ledger) ≥ 100 |
| HAT_TRICK | 3 visitors reach `hadir_penuh` |
| HIGH_ROLLER | Any single TYFCB with nilai ≥ 250.000.000 |
| STREAK_MASTER | Score entries on ≥3 distinct days in one calendar week |
| TEAM_PLAYER | Member's team achieves Full Roster bonus |
| LEVEL_UP | Member's color_status upgraded by admin |
| PATRON | Member's donated prize is approved |

- [ ] Badges are idempotent: awarding same badge twice is a no-op (unique constraint)
- [ ] Badge award writes to `member_badges` table

---

## PRIZE POOL

### AC-PRIZE-1
- [ ] Member donation starts as `pending`
- [ ] Admin can approve → status `approved`, donor name visible
- [ ] Admin can reject → status `rejected`
- [ ] Approved donation earns PATRON badge to donatur_id

### AC-PRIZE-2: Raffle Tickets
- [ ] `floor(score_overall / 100)` tickets from score
- [ ] +1 ticket per visitor reaching `hadir`
- [ ] +1 ticket per new TYFCB pair (pair_ordinal=1)
- [ ] Ticket count shown on member's prize pool view

---

## SECURITY INVARIANTS

- [ ] All SQL queries use parameterized values — no string concatenation with user input
- [ ] `score_ledger` is insert-only in application code; no UPDATE or DELETE
- [ ] `tyfcb_entries.giver_id ≠ tyfcb_entries.receiver_id` enforced at DB constraint and API level
- [ ] Visitor `kontak` unique per season enforced at DB level
- [ ] Session cookies are `httpOnly` and `sameSite: lax`
- [ ] Role check is server-side before any admin mutation
