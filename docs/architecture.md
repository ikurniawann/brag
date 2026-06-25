# BRAG Architecture Notes

## App Boundary

BRAG should stay as a separate app for the MVP. It owns the competition season,
groups, scoring rules, booster rules, verification workflow, point ledger, and
awards.

BNI Grow Visitor Manager can be integrated later through an adapter layer instead
of direct table coupling. This keeps BRAG stable even if the Visitor app changes.

## Recommended Integration Pattern

Use BRAG-owned tables as the source of truth for the competition:

- `app_users.external_member_id` stores the linked member ID from BNI Grow.
- visitor submissions can store an external visitor reference in contribution
  metadata when an API is available.
- sync jobs can import member and visitor snapshots into BRAG-owned tables.
- point calculation should always use BRAG verification and `point_events`, not
  live values from external systems.

This gives the committee a clear audit trail and avoids leaderboard drift caused
by external app edits.

## MVP Technical Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Local PostgreSQL auth using email and password
- Local PostgreSQL database for BRAG MVP data
- Evidence file storage will be added when the contribution workflow is wired

## Core Data Flow

1. Admin prepares member accounts.
2. Admin creates a season and groups.
3. Admin assigns members into groups.
4. Member submits TYFCB, Visitor, or Referral contribution.
5. Submission starts as `pending`.
6. Admin approves or rejects.
7. Approved contribution creates immutable `point_events`.
8. Leaderboards aggregate from `point_events`.
