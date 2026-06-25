# BRAG — Engineering Tasks
> Aligned with Spesifikasi Aplikasi v1.0

## EPIC-000: Bootstrap & Infrastructure

**T-001** · Infra · M
Rewrite DB schema to spec v1.0: `app_users`, `user_sessions`, `event_seasons`, `classifications`, `teams`, `members`, `tyfcb_entries`, `visitors`, `weekly_events`, `score_ledger`, `badges`, `member_badges`, `prize_pool`, `raffle_tickets`.  
Exit: `psql -d brag_dev -f db/local/001_initial.sql` runs clean; all tables, enums, constraints, and seed data present.

**T-002** · BE · S ✅ Done
Local auth: `signIn(email, password)` + `getSession()` using bcrypt + `user_sessions` table.  
Exit: Login returns session cookie; wrong credentials → 401.

**T-003** · BE · S
Next.js `middleware.ts`: unauthenticated → redirect `/login`; member on `/admin/*` → 403.  
Exit: Middleware blocks all protected routes correctly.

---

## EPIC-001: Member Dashboard & Input

**T-004** · BE · S
API `GET /api/member/me` — returns member profile + season scores from score_ledger + active weekly event + raffle ticket count.  
Exit: Returns correct JSON for current user; no other member data leaked.

**T-005** · FE · M
Member dashboard: score saya (Overall/TYFCB/Visitor), score & ranking tim, badge saya, event minggu ini, posisi di tiap leaderboard, recent activity.  
Exit: All sections load from real DB; renders correctly on 375px.

**T-006** · FE · M
TYFCB input form: member picker (searchable member list), nilai (Rupiah), tanggal (≤ today), bukti upload optional. `POST /api/tyfcb`.  
Exit: Valid submission creates pending entry; giver=self blocked; future date blocked.

**T-007** · BE · S
`POST /api/tyfcb` — validates payload (giver≠receiver, nilai>0, tanggal≤today), inserts `tyfcb_entries` with status=pending.  
Exit: Correct DB row created; 400 on validation error.

**T-008** · FE · M
Visitor input form: nama, kontak (wajib), tanggal_undang. `POST /api/visitors`.  
Exit: Valid submission creates visitor; duplicate kontak per season → 409 with clear message.

**T-009** · BE · S
`POST /api/visitors` — validates kontak uniqueness per season, inserts `visitors`.  
Exit: Creates row; duplicate returns 409.

**T-010** · FE · S
Member history pages: TYFCB list (status, computed_score, rejection_reason) + Visitor list (status_hadir progress, is_converted).  
Exit: Status badges and milestone progress shown correctly.

---

## EPIC-002: Admin — Verifikasi & Management

**T-011** · FE · M
Admin verify TYFCB page: pending entries list with giver/receiver/nilai/tanggal. Approve and Reject (requires reason) actions.  
Exit: Approve and Reject work; rejection modal requires non-empty reason.

**T-012** · BE · M
`POST /api/admin/tyfcb/[id]/approve` — scoring engine: compute B×P×M, write computed_score to entry, write score_ledger row, check+award badges, generate raffle tickets. Returns 409 if already verified.  
Exit: All scoring steps correct for all band values, pair_ordinals, and event multipliers.

**T-013** · BE · S
`POST /api/admin/tyfcb/[id]/reject` — sets status=rejected, stores rejection_reason. No ledger entry.  
Exit: Status updated; reason stored; no score_ledger row created.

**T-014** · BE · S
`POST /api/admin/tyfcb/[id]/reverse` — for already-verified entries: write negative correction row to score_ledger (histori tetap ada).  
Exit: Ledger has negative row; original rows intact.

**T-015** · FE · M
Admin visitor management page: all visitors this season with milestone status. Update status_hadir (terdaftar→hadir→hadir_penuh), mark is_converted.  
Exit: Each update triggers milestone score in ledger.

**T-016** · BE · M
`PATCH /api/admin/visitors/[id]` — updates status_hadir or is_converted, writes score_ledger milestone row (with event multiplier if applicable), awards HOST/CLOSER badges.  
Exit: Points are incremental; each milestone transition writes the correct points.

**T-017** · FE · M
Admin member management: CRUD member (name, email, password, klasifikasi, team, color_status, is_active). Update color_status triggers level-up bonus.  
Exit: Color_status change writes team bonus to ledger; LEVEL_UP badge awarded.

**T-018** · BE · M
`PATCH /api/admin/members/[id]` — handles all member updates; color_status upgrade triggers team bonus (75 or 150) and LEVEL_UP badge.  
Exit: Bonus written to ledger with member_id=null, correct team_id.

**T-019** · FE · S
Admin team management: create/edit teams, assign members.  
Exit: Teams created; members assignable.

**T-020** · BE · S
Team CRUD APIs: `GET/POST /api/admin/teams`, `PATCH /api/admin/teams/[id]`, `PATCH /api/admin/members/[id]/team`.  
Exit: All endpoints work; member team assignment updates member.team_id.

---

## EPIC-003: Weekly Events, Leaderboard & Full Roster

**T-021** · FE · S
Admin set weekly event: select event_code from 12 options, set minggu_ke and date range. CAT_CAROUSEL shows classification picker.  
Exit: Creates weekly_events row; displayed on member dashboard.

**T-022** · BE · S
`POST /api/admin/weekly-events` — validates one event per minggu_ke per season. `GET /api/weekly-events/current` — returns active event for today.  
Exit: Current event used by scoring engine during approval.

**T-023** · BE · M
Leaderboard queries from score_ledger — 6 views:
1. Team Overall (tyfcb+visitor+bonus sum)
2. Individu Overall
3. Team Visitor
4. Individu Visitor
5. Team TYFCB
6. Individu TYFCB  
Exit: Correct aggregation; bonus only in Overall; tie-breaker logic implemented.

**T-024** · FE · M
Leaderboard page with 6 tabs. Current user row highlighted. Team score includes bonus rows.  
Exit: All 6 tabs work; data from DB; mobile-friendly.

**T-025** · BE · M
Full Roster weekly check — cron or admin-triggered: for each team, check if all `is_active` members have ≥1 score_ledger entry in the calendar week. If yes, write +100 bonus row and award TEAM_PLAYER badge to all qualifying members.  
Exit: Full Roster condition checked correctly; bonus not double-awarded for same week.

---

## EPIC-004: Badges, Prize Pool & Raffle

**T-026** · BE · M
Badge engine: after every score_ledger write, check all machine-checkable badge conditions for the member. Award any newly earned badges (idempotent). Write to `member_badges`.  
Exit: All 12 badge conditions covered; no duplicate awards.

**T-027** · FE · S
Badge display on member dashboard: earned badges with ikon and nama.  
Exit: Correct badges shown; earn date visible.

**T-028** · FE · M
Prize pool page (member): list of prizes (kategori vs undian), my raffle ticket count, my position in each category, donor business names.  
Exit: All data from DB; ticket count correct.

**T-029** · FE · S
Donate prize form (member): nama_hadiah, deskripsi, nilai_estimasi. `POST /api/prizes`.  
Exit: Creates pending prize; PATRON badge awarded on approval.

**T-030** · BE · S
`POST /api/prizes` — creates prize_pool row with status=pending, donatur_id=current member.  
`GET /api/prizes` — returns prize list for current season.  
Exit: Correct DB rows; pending not visible to non-admin until approved.

**T-031** · FE · M
Admin prize management: approve/reject donations, allocate prizes to kategori/undian, view raffle ticket counts.  
Exit: Approve triggers PATRON badge for donatur; allocation changeable.

**T-032** · BE · M
Admin raffle draw: `POST /api/admin/prizes/raffle` — randomly selects winner per undian prize from raffle_tickets, sets pemenang_id on prize_pool.  
Exit: Each undian prize gets one winner; winner correctly referenced; endpoint can only be called once per prize.
