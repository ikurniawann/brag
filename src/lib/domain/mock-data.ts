// Mock data for UI development only — will be replaced by real DB queries
import type { Member, TeamScore, TyfcbEntry, Visitor, WeeklyEvent } from "./types";

export const mockTeams: TeamScore[] = [
  {
    team_id: "team-alpha",
    nama_tim: "Tim Alpha",
    score_tyfcb: 4120,
    score_visitor: 2210,
    score_bonus: 90,
    score_overall: 6420
  },
  {
    team_id: "team-bravo",
    nama_tim: "Tim Bravo",
    score_tyfcb: 3860,
    score_visitor: 2080,
    score_bonus: 0,
    score_overall: 5940
  },
  {
    team_id: "team-charlie",
    nama_tim: "Tim Charlie",
    score_tyfcb: 3500,
    score_visitor: 1940,
    score_bonus: 75,
    score_overall: 5515
  }
];

export const mockMembers: Member[] = [
  {
    id: "member-1",
    user_id: "user-1",
    season_id: "season-1",
    team_id: "team-alpha",
    klasifikasi_id: "klas-1",
    color_status: "hijau",
    is_active: true,
    created_at: "2026-06-01T00:00:00Z",
    full_name: "Ilham Kurniawan",
    email: "ilham@wit.id",
    role: "admin",
    klasifikasi_nama: "Teknologi",
    nama_tim: "Tim Alpha"
  },
  {
    id: "member-2",
    user_id: "user-2",
    season_id: "season-1",
    team_id: "team-alpha",
    klasifikasi_id: "klas-2",
    color_status: "kuning",
    is_active: true,
    created_at: "2026-06-01T00:00:00Z",
    full_name: "Nadia Putri",
    email: "nadia@bnigrow.id",
    role: "member",
    klasifikasi_nama: "Jasa",
    nama_tim: "Tim Alpha"
  },
  {
    id: "member-3",
    user_id: "user-3",
    season_id: "season-1",
    team_id: "team-bravo",
    klasifikasi_id: "klas-3",
    color_status: "merah",
    is_active: true,
    created_at: "2026-06-01T00:00:00Z",
    full_name: "Raka Mahendra",
    email: "raka@bnigrow.id",
    role: "member",
    klasifikasi_nama: "Properti",
    nama_tim: "Tim Bravo"
  }
];

export const mockTyfcbEntries: TyfcbEntry[] = [
  {
    id: "tyfcb-1",
    season_id: "season-1",
    giver_id: "member-1",
    receiver_id: "member-2",
    nilai: 35000000,
    tanggal: "2026-06-11",
    bukti_url: null,
    status: "pending",
    computed_score: null,
    pair_ordinal: null,
    event_multiplier_applied: null,
    rejection_reason: null,
    verified_by: null,
    verified_at: null,
    created_at: "2026-06-11T09:10:00Z",
    giver_name: "Ilham Kurniawan",
    receiver_name: "Nadia Putri"
  },
  {
    id: "tyfcb-2",
    season_id: "season-1",
    giver_id: "member-2",
    receiver_id: "member-3",
    nilai: 8000000,
    tanggal: "2026-06-09",
    bukti_url: null,
    status: "verified",
    computed_score: 50,
    pair_ordinal: 1,
    event_multiplier_applied: 1.0,
    rejection_reason: null,
    verified_by: "user-1",
    verified_at: "2026-06-10T08:00:00Z",
    created_at: "2026-06-09T14:00:00Z",
    giver_name: "Nadia Putri",
    receiver_name: "Raka Mahendra"
  }
];

export const mockVisitors: Visitor[] = [
  {
    id: "visitor-1",
    season_id: "season-1",
    nama: "Rohit Menon",
    kontak: "08123456789",
    inviter_id: "member-3",
    tanggal_undang: "2026-06-10",
    status_hadir: "hadir",
    is_converted: false,
    tanggal_konversi: null,
    created_at: "2026-06-10T10:00:00Z",
    inviter_name: "Raka Mahendra"
  }
];

export const mockActiveEvent: WeeklyEvent = {
  id: "event-1",
  season_id: "season-1",
  minggu_ke: 3,
  event_code: "SPREAD_LOVE",
  target_classification_id: null,
  tanggal_mulai: "2026-06-23",
  tanggal_selesai: "2026-06-29",
  created_at: "2026-06-23T00:00:00Z",
  target_classification_nama: undefined
};
