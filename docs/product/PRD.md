# BRAG — Product Requirements Document
> Aligned with Spesifikasi Aplikasi v1.0

## Foundation

### Problem

BNI Grow perlu mendorong dua aktivitas inti member: TYFCB (closed business dari referral) dan mengundang visitor. Saat ini tidak ada sistem yang melacak kontribusi secara transparan dan memotivasi partisipasi selama 3 bulan season.

### Program

- **Durasi:** 3 bulan (12 minggu)
- **Struktur:** 10 tim × 10 member = 100 member
- **Prinsip:** Givers Gain — score jatuh ke pemberi referral, bukan penerima
- **Pengelola:** Growth Coordinator (satu-satunya admin/approver)

### Success Metrics

- Semua 100 member submit minimal 1 aktivitas per bulan
- Rata-rata lag verifikasi admin < 24 jam
- Leaderboard diakses ≥ 3× per minggu per member
- Seluruh flow member dapat diselesaikan di mobile (375px) tanpa pinch-zoom

---

## Peran Pengguna

| Peran | Hak Akses |
|-------|-----------|
| **Member** | Input TYFCB & visitor, lihat dashboard, leaderboard, prize pool, donasi hadiah, terima badge |
| **Admin (Growth Coordinator)** | Semua hak member + verifikasi entri, update milestone visitor, konfirmasi level-up, set event mingguan, kelola prize pool, kelola member/tim, audit & override |

Hanya ada **satu** admin (Growth Coordinator) agar proses tidak macet.

---

## Mesin Scoring

### TYFCB — computed_score = round(B × P × M)

**Band (B):**

| Nilai TYFCB | B |
|-------------|---|
| < Rp 500.000 | 10 |
| Rp 500.000 – < 2.000.000 | 25 |
| Rp 2.000.000 – < 10.000.000 | 50 |
| Rp 10.000.000 – < 50.000.000 | 80 |
| Rp 50.000.000 – < 250.000.000 | 120 |
| Rp 250.000.000 – < 500.000.000 | 150 |
| ≥ Rp 500.000.000 | 200 |

**Penalti pengulangan (P)** — berdasarkan pair_ordinal (giver→receiver per season):

| pair_ordinal | P |
|-------------|---|
| 1 – 2 | 1.0 |
| 3 – 5 | 0.7 |
| 6+ | 0.5 |

**Pengali event mingguan (M):** dari Weekly_Events aktif. Default M = 1.0.

### Visitor — akumulatif per milestone

| Milestone | Tambahan | Total kumulatif |
|-----------|----------|-----------------|
| Terdaftar & hadir | 20 | 20 |
| Hadir penuh | +30 | 50 |
| Konversi jadi member | +100 | 150 |

Jika event visitor aktif: `points = round(tambahan_milestone × M)`.

### Bonus Tim

- **Full Roster** (cek tiap akhir minggu): semua member aktif punya ≥1 entri berscore minggu itu → tim +100
- **Naik Level** (manual admin): merah→kuning = tim +75 / kuning→hijau = tim +150

### Flat Bonus (tidak dikalikan M)

`HIGH_ROLLER +50`, `ONE_TO_ONE +30`, `STREAK +40`

### Score Ledger

**`score_ledger`** adalah satu-satunya sumber kebenaran untuk semua agregasi. Baris bersifat append-only. Koreksi ditulis sebagai baris negatif.

---

## Bank Event Mingguan (12 event codes)

| Code | Nama | Mekanik |
|------|------|---------|
| CAT_CAROUSEL | Category Carousel | TYFCB ke klasifikasi terpilih = 2× |
| VISITOR_BLITZ | Visitor Blitz | Score visitor = 1.5× |
| CLOSING_WEEK | Closing Week | Konversi member = 2× |
| SPREAD_LOVE | Spread the Love | TYFCB ke receiver baru (pair_ordinal=1) = 2× |
| UNDERDOG | Underdog Week | TYFCB ke member merah/kuning = 2× |
| POWER_TEAM | Power Team Week | TYFCB dalam contact sphere = 1.5× |
| HIGH_ROLLER | High Roller Day | TYFCB tunggal tertinggi hari itu = flat +50 |
| NEW_BLOOD | New Blood | Visitor milestone hadir = 2× |
| ONE_TO_ONE | 1-2-1 Payoff | 1-2-1 berujung TYFCB minggu sama = flat +30 |
| DOUBLE_UP | Double-Up Weekend | Score Sabtu-Minggu = 1.5× |
| STREAK | Streak Week | Log 3+ hari berbeda = flat +40 |
| FOUNDER | Founder's Frenzy | Semua score minggu itu = 1.5× |

---

## 6 Leaderboard

1. Team Overall
2. Individu Overall
3. Team Visitor
4. Individu Visitor
5. Team TYFCB
6. Individu TYFCB

Bonus (kategori `bonus`) hanya masuk Overall, tidak ke TYFCB/Visitor.

---

## 12 Badge

| Code | Pemicu |
|------|--------|
| FIRST_BLOOD | TYFCB verified pertama |
| HOST | Visitor pertama mencapai `hadir` |
| CLOSER | Konversi member pertama |
| CONNECTOR | TYFCB ke 5 receiver berbeda |
| SPREADER | TYFCB ke 10 receiver berbeda |
| CENTURION | Score Overall ≥ 100 |
| HAT_TRICK | 3 visitor mencapai `hadir_penuh` |
| HIGH_ROLLER | Punya satu TYFCB ≥ Rp 250 juta |
| STREAK_MASTER | Log 3+ hari berbeda dalam seminggu |
| TEAM_PLAYER | Ikut Full Roster timnya |
| LEVEL_UP | color_status naik satu tingkat |
| PATRON | Donasi ≥1 hadiah yang di-approve |

---

## Prize Pool

- **Pengisian:** Admin seed hadiah awal + member boleh donasi (produk/jasa)
- **Donasi member:** status `pending`, butuh approval admin, nama bisnis tampil
- **Pembagian dua lapis:**
  - Hadiah kategori: untuk 6 pemenang kategori leaderboard
  - Undian: semua member berpeluang
- **Tiket undian:** `floor(score_overall/100)` + 1 per visitor hadir + 1 per TYFCB baru (pair_ordinal=1)

---

## Scope MVP

**In scope:**
- Auth member + admin
- Input TYFCB (pilih receiver, nilai, tanggal, bukti opsional)
- Input Visitor (nama, kontak, tanggal_undang)
- Admin: verifikasi TYFCB, update milestone visitor, set color_status, set weekly event
- Score engine (B × P × M, visitor milestones, flat bonus, team bonus)
- 6 leaderboard dari score_ledger
- 12 badge otomatis
- Prize pool + donasi + raffle tickets
- Dashboard member: score, ranking, badges, event minggu ini

**Deferred:**
- Notifikasi real-time (WhatsApp/push)
- Integrasi BNI Grow Visitor Manager
- Export CSV
- POWER_TEAM (butuh admin tandai pasangan manually)

---

## Edge Cases & Aturan Hitung

- `round()` setelah semua pengali
- TYFCB < Rp 100.000 boleh ditolak admin; default ikut band terendah (10 pts)
- `pair_ordinal` dihitung berdasarkan urutan **verifikasi**, bukan urutan input
- Satu visitor hanya boleh dikreditkan ke satu `inviter_id`; duplikasi kontak dicegah
- Score hanya dari entri `verified`; `pending` tidak masuk leaderboard
- Reject setelah verified: baris ledger negatif sebagai pembalik, histori tetap ada
- Full Roster dicek per minggu kalender; "member aktif" = `is_active = true`
- Maksimal satu event mingguan aktif dalam satu waktu (no stacking)
- `score_ledger` bersifat append-only di application code (koreksi = baris negatif baru)
