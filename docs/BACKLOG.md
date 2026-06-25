# BRAG — Prioritized Backlog
> Epics di `docs/epics/` adalah sumber kanonik. File ini adalah seed prioritisasi.

---

## Phase 0 · Bootstrap & Infrastructure (EPIC-000)

- [ ] **P0** (Infra) Rewrite DB schema v2 — semua tabel sesuai spec v1.0
- [ ] **P0** (BE) Local auth bcrypt + session ✅ Done
- [ ] **P0** (BE) Next.js middleware — route protection + role guard

---

## Phase 1 · Member Dashboard & Input (EPIC-001)

- [ ] **P0** (BE) `GET /api/member/me` — scores, event aktif, raffle count
- [ ] **P0** (FE) Member dashboard — score, ranking, badge, event minggu ini
- [ ] **P0** (FE) TYFCB input form — receiver picker, nilai Rp, tanggal, bukti
- [ ] **P0** (BE) `POST /api/tyfcb` — validation, insert pending entry
- [ ] **P0** (FE) Visitor input form — nama, kontak, tanggal_undang
- [ ] **P0** (BE) `POST /api/visitors` — validation, kontak unique per season
- [ ] **P1** (FE) History: TYFCB list + Visitor milestone tracker

---

## Phase 2 · Admin — Verifikasi & Management (EPIC-002)

- [ ] **P0** (FE) Admin verify TYFCB — pending queue, approve, reject (requires reason)
- [ ] **P0** (BE) `POST /api/admin/tyfcb/[id]/approve` — B×P×M engine + ledger + badges
- [ ] **P0** (BE) `POST /api/admin/tyfcb/[id]/reject` — reason required, no ledger entry
- [ ] **P0** (FE) Admin visitor milestone update — hadir → hadir_penuh → converted
- [ ] **P0** (BE) `PATCH /api/admin/visitors/[id]` — milestone scoring + HOST/CLOSER badge
- [ ] **P0** (FE) Admin member management — CRUD, color_status, team assignment
- [ ] **P0** (BE) `PATCH /api/admin/members/[id]` — color_status upgrade → team bonus + LEVEL_UP badge
- [ ] **P1** (BE) `POST /api/admin/tyfcb/[id]/reverse` — correction row (negative) after verified
- [ ] **P1** (FE/BE) Team CRUD — create 10 teams, assign members

---

## Phase 3 · Weekly Events, Leaderboard & Full Roster (EPIC-003)

- [ ] **P0** (FE/BE) Admin weekly event setter — 12 event codes, CAT_CAROUSEL with classification picker
- [ ] **P0** (BE) `GET /api/weekly-events/current` — used by scoring engine
- [ ] **P0** (BE) 6 leaderboard queries from score_ledger — correct aggregation + tie-breaker
- [ ] **P0** (FE) Leaderboard page — 6 tabs, current user highlighted, mobile-friendly
- [ ] **P1** (BE) Full Roster weekly check — +100 team bonus + TEAM_PLAYER badge

---

## Phase 4 · Badges, Prize Pool & Raffle (EPIC-004)

- [ ] **P0** (BE) Badge engine — 12 conditions, idempotent, triggered after each ledger write
- [ ] **P1** (FE) Badge display on dashboard
- [ ] **P1** (FE/BE) Prize pool member view — prizes, tiket undian saya, posisi kategori
- [ ] **P1** (FE/BE) Donasi hadiah form + admin approve/reject + PATRON badge
- [ ] **P2** (BE) Admin raffle draw — random winner per undian prize

---

## Future (Unscheduled)

- [ ] **P2** Real-time notifikasi (score verified, badge, event baru)
- [ ] **P2** WhatsApp notification via API
- [ ] **P2** Export leaderboard CSV
- [ ] **P2** Import 100 member dari spreadsheet
- [ ] **P2** Integrasi BNI Grow Visitor Manager
- [ ] **P2** POWER_TEAM event (butuh admin tandai pasangan secara manual)
