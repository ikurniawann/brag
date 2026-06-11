# BRAG Project Brief

## Overview

BRAG is an annual BNI Grow member challenge platform. The event is planned to run for three months. Members are split into several groups by the committee or admin, and each contribution from a member adds points to their group standing.

The system should make contribution tracking simple, transparent, and motivating. Members should be able to open the app mostly from mobile phones, while admins can comfortably manage the event from desktop as well.

## Program Name

BRAG

The naming should feel energetic and competitive, suitable for a leaderboard-driven member challenge.

## Background

BNI Grow already has a visitor management system. BRAG will extend the ecosystem into member engagement and gamification. The app should use the same general logo direction, red BNI Grow visual identity, clean glassmorphism-inspired UI, and Apple-like typography feel from the current BNI Grow Visitor project.

## Event Duration

Planned duration: 3 months.

Exact start date, end date, weekly cycle, and award period will be confirmed later.

## Core Concept

Members are assigned into groups by the committee. Each member can contribute through business and referral activities. The contribution impacts both:

- Individual member achievement.
- Group leaderboard standing.

Main scoring categories:

- TYFCB: Thank You For Closed Business.
- Visitor brought.
- Referral.

Additional booster mechanics will be added, such as:

- Bonus points for doing TYFCB on selected days.
- Bonus points for bringing visitors from specific business classifications.
- Campaign-based boosts decided by the committee.

## Goals

- Increase member participation during the annual event.
- Make group performance visible and exciting.
- Encourage TYFCB, visitor invites, and referrals.
- Give admins a clear system for tracking, verifying, and awarding points.
- Create a mobile-friendly experience that members will actually use frequently.

## Non Goals For Initial Phase

- Final scoring formula is not fixed yet.
- Final group composition is not fixed yet.
- Final award names and prize rules are not fixed yet.
- Integration with existing BNI Grow Visitor system is optional for a later phase.

## Target Platforms

- Mobile web first.
- Desktop responsive.

Most members will access the app from phones, so every main member workflow must be easy with one hand and small screens.

## Initial Roles

### Member

- Login to account.
- See own profile, group, and points.
- Submit TYFCB, visitor, and referral contribution.
- Track contribution history.
- See leaderboard and awards.

### Admin / Committee

- Create and manage event season.
- Create and manage groups.
- Assign members into groups.
- Manage scoring rules.
- Manage booster rules.
- Verify or reject submitted contributions.
- View leaderboards and export reports.

### Super Admin

- Manage global configuration.
- Manage admin accounts.
- Access all event seasons and system settings.

## Main Modules

### Authentication

Members and admins have accounts and can login.

### Member Management

Admin can import or create member accounts, assign each member into a group, and update member details.

### Group Management

Admin creates groups for the BRAG season. Group names, members, captains, and colors can be configured.

### Contribution Submission

Members can submit:

- TYFCB.
- Visitor brought.
- Referral.

Each submission should include basic details, date, optional note, and supporting evidence if needed.

### Verification

Admins can approve, reject, or adjust submitted contributions before they affect leaderboard points.

### Scoring Engine

Scoring rules should be configurable because final point scheme will be explained later.

Initial placeholder:

- TYFCB: point TBD.
- Visitor brought: point TBD.
- Referral: point TBD.
- Booster: point TBD.

### Booster Rules

Admin can define temporary bonus rules, for example:

- TYFCB Day Booster.
- Business Classification Booster.
- Weekly Campaign Booster.

### Leaderboard

Leaderboards should support:

- Group ranking.
- Member ranking.
- Category ranking.
- Weekly and overall views.

### Awards

Awards should be shown as badges, weekly winners, and end-of-program recognition.

Example award ideas:

- Top TYFCB Contributor.
- Top Visitor Brought.
- Top Referral Contributor.
- Group Champion.
- Booster Champion.
- Consistency Award.

## UI Direction

Use the same design family as BNI Grow Visitor:

- Clean, modern, glassmorphism components.
- Red as the primary brand color.
- Warm red-orange accents for achievement and momentum.
- Mobile-first cards and bottom-friendly actions.
- Clear leaderboard with rank, points, movement, and group identity.
- Typography should feel close to Apple or Geist style.

The first screen after login for members should not be a marketing landing page. It should be the actual BRAG dashboard:

- My group.
- My points.
- Submit contribution.
- Group leaderboard.
- Latest awards or boosts.

## Suggested First Screens

### Member Mobile Dashboard

- Current rank.
- Group standing.
- Personal points.
- Quick submit buttons: TYFCB, Visitor, Referral.
- Active booster banner.
- Recent contribution history.

### Leaderboard

- Group leaderboard.
- Member leaderboard.
- Filter by total, TYFCB, visitor, referral, weekly.

### Submit Contribution

- Choose contribution type.
- Fill details.
- Upload evidence if required.
- Submit for verification.

### Admin Dashboard

- Pending verification.
- Top groups.
- Top members.
- Booster performance.
- Data quality alerts.

### Group Management

- Create group.
- Assign members.
- Set group captain.
- Set group color.

### Scoring Configuration

- Category points.
- Booster rules.
- Active dates.
- Caps or limits if needed.

## Data Model Draft

Initial tables to consider:

- users
- members
- groups
- group_members
- event_seasons
- contribution_types
- contributions
- scoring_rules
- booster_rules
- point_events
- awards
- award_assignments

Detailed schema will be finalized after scoring and grouping rules are confirmed.

## Open Questions

- What is the exact BRAG event start and end date?
- How many groups will be created?
- Are groups fixed for the whole season?
- Are TYFCB values based on amount, count, or both?
- Does referral need verification?
- Does visitor brought connect to the existing visitor manager?
- Are there weekly winners or only final awards?
- Should members upload evidence?
- Who can approve contributions?
- Are rejected or edited submissions visible to members?

## Implementation Notes

Build this as a separate repo named `BRAG`.

Recommended stack can follow the current BNI Grow Visitor project unless decided otherwise:

- Next.js app router.
- TypeScript.
- Supabase for auth and database.
- Vercel deployment.
- Mobile-first responsive UI.

