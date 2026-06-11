# BRAG Product Requirements

## MVP Objective

Create a mobile-first gamification system for the BRAG annual member program where members can login, submit contribution activities, and track group leaderboard performance.

## MVP Features

### Member Login

Members can login using an account prepared by admin.

Acceptance criteria:

- Member can login.
- Member sees own name and group.
- Member cannot access admin-only pages.

### Member Dashboard

Member sees the current event status.

Acceptance criteria:

- Shows personal points.
- Shows group rank.
- Shows active booster if any.
- Shows quick actions for TYFCB, Visitor, Referral.

### Contribution Submission

Member can submit contribution activity.

Acceptance criteria:

- Member selects type: TYFCB, Visitor, Referral.
- Member fills required details.
- Submission starts as pending verification unless admin config says auto-approved.
- Member can see submission history.

### Admin Verification

Admin verifies submitted contributions.

Acceptance criteria:

- Admin can approve.
- Admin can reject with reason.
- Approved contribution generates points.
- Rejected contribution does not generate points.

### Group Leaderboard

System calculates group standings.

Acceptance criteria:

- Shows group rank.
- Shows total points.
- Shows category breakdown.
- Updates after contribution approval.

### Member Leaderboard

System shows individual standings.

Acceptance criteria:

- Shows member rank.
- Shows member group.
- Shows total points.
- Can filter by category.

### Booster Rules

Admin can create booster rules.

Acceptance criteria:

- Admin can set booster name.
- Admin can set active date range.
- Admin can set eligible contribution type.
- Admin can set multiplier or bonus points.

## Future Enhancements

- Public award page.
- Badge unlock animation.
- Team captain dashboard.
- WhatsApp notification.
- Import members from spreadsheet.
- Integration with BNI Grow Visitor Manager.
- AI assistant for leaderboard insights.

