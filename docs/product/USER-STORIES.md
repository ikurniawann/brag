# BRAG — User Stories
> Aligned with Spesifikasi Aplikasi v1.0

## AUTH

**US-AUTH-1** (P0) — Member  
As a **member**, I want to log in with email and password, so that I can access my dashboard.

**US-AUTH-2** (P0) — Admin  
As an **admin**, I want to log in, so that I can manage the competition.

**US-AUTH-3** (P0)  
As an **unauthenticated user**, I am redirected to `/login` when accessing any protected page.

**US-AUTH-4** (P0)  
As a **member**, I cannot access `/admin/*` routes. As an **admin**, I can access all routes.

---

## DASHBOARD (Member)

**US-DASH-1** (P0)  
As a **member**, I want to see my score (Overall, TYFCB, Visitor), group score & ranking, my badges, the current weekly event, and my position on each leaderboard.

**US-DASH-2** (P0)  
As a **member**, I want quick action buttons for TYFCB and Visitor input directly from my dashboard.

**US-DASH-3** (P1)  
As a **member**, I want to see my recent TYFCB entries and visitor statuses so I know what's pending.

---

## TYFCB

**US-TYFCB-1** (P0)  
As a **member**, I want to submit a TYFCB entry by selecting a receiver (from member list), entering the deal value in Rupiah, the date, and optionally uploading evidence (bukti), so that it can be verified by the Growth Coordinator.

**US-TYFCB-2** (P0)  
As a **member**, I cannot select myself as the receiver (giver ≠ receiver).

**US-TYFCB-3** (P1)  
As a **member**, I want to see my TYFCB submission history with status (pending/verified/rejected) and computed_score once verified.

**US-TYFCB-4** (P1)  
As a **member**, I want to see the rejection reason if my TYFCB is rejected.

---

## VISITOR

**US-VISITOR-1** (P0)  
As a **member**, I want to register a visitor I am inviting by entering their name, contact (wajib), and invitation date.

**US-VISITOR-2** (P0)  
As a **member**, I want to see the progress of each visitor I registered (terdaftar → hadir → hadir_penuh → converted).

**US-VISITOR-3** (P0)  
As a **member**, I cannot register a visitor whose contact already exists in the season (duplicate prevention).

---

## ADMIN — Verifikasi

**US-VERIFY-1** (P0)  
As an **admin**, I want to see all pending TYFCB entries with giver name, receiver name, nilai, and tanggal.

**US-VERIFY-2** (P0)  
As an **admin**, I want to approve a TYFCB entry, which triggers score computation (B×P×M) and writes to score_ledger, then checks and awards applicable badges.

**US-VERIFY-3** (P0)  
As an **admin**, I want to reject a TYFCB entry with a mandatory reason. No ledger entry is created.

**US-VERIFY-4** (P1)  
As an **admin**, rejecting an already-verified entry writes a negative correction row to score_ledger without deleting history.

---

## ADMIN — Visitor Milestones

**US-VISITOR-ADMIN-1** (P0)  
As an **admin**, I want to update a visitor's `status_hadir` (terdaftar → hadir → hadir_penuh) and mark `is_converted`. Each update triggers the appropriate milestone score in score_ledger.

**US-VISITOR-ADMIN-2** (P0)  
As an **admin**, I want to see all registered visitors for the season with their current milestone status.

---

## ADMIN — Member & Team Management

**US-ADMIN-MEMBER-1** (P0)  
As an **admin**, I want to create member accounts (name, email, password, klasifikasi, team assignment, color_status).

**US-ADMIN-MEMBER-2** (P0)  
As an **admin**, I want to update a member's `color_status` (merah → kuning or kuning → hijau), which automatically writes the team bonus to score_ledger (+75 or +150) and awards the LEVEL_UP badge.

**US-ADMIN-MEMBER-3** (P1)  
As an **admin**, I want to assign/move a member between teams.

**US-ADMIN-TEAM-1** (P0)  
As an **admin**, I want to create and manage the 10 teams for the season.

---

## ADMIN — Weekly Events

**US-EVENT-1** (P0)  
As an **admin**, I want to set the weekly event for a given week (minggu_ke 1–12) by selecting from the 12 event codes and setting start/end dates. Only one event can be active at a time.

**US-EVENT-2** (P1)  
As an **admin**, for CAT_CAROUSEL events I want to specify the target classification for that week.

---

## LEADERBOARD

**US-LB-1** (P0)  
As a **member**, I want to see 6 leaderboards: Team Overall, Individu Overall, Team Visitor, Individu Visitor, Team TYFCB, Individu TYFCB — all aggregated from score_ledger.

**US-LB-2** (P0)  
As a **member**, my own row is highlighted in each leaderboard.

**US-LB-3** (P1)  
As a **member**, leaderboard data reflects approved entries (not pending).

---

## BADGES

**US-BADGE-1** (P0)  
As a **member**, badges are awarded automatically when conditions are met (machine-checkable), and I receive a notification.

**US-BADGE-2** (P1)  
As a **member**, I can see all my earned badges on my dashboard.

---

## PRIZE POOL

**US-PRIZE-1** (P1)  
As a **member**, I want to see the prize pool: list of prizes (kategori vs undian), my raffle ticket count, and my position in each category.

**US-PRIZE-2** (P1)  
As a **member**, I want to donate a prize (product/service/voucher from my business) via a form. It starts as `pending` and shows my business name once approved.

**US-PRIZE-3** (P1)  
As a **member**, donating an approved prize earns me the PATRON badge.

**US-PRIZE-4** (P1)  
As an **admin**, I want to approve/reject prize donations, allocate prizes to categories or undian, and run the raffle draw at season end.
