# BRAG — Definition of Done

A task is **done** when ALL of the following are true:

- [ ] **Merged** — code is merged to `main` via a reviewed PR.
- [ ] **Acceptance Criteria pass** — every AC in `docs/product/ACCEPTANCE-CRITERIA.md` for the task is met (automated test or manual verification documented in PR).
- [ ] **Gates green** — `scripts/qa.sh` (lint + typecheck), `scripts/test.sh` (build), and `scripts/security-check.sh` all pass with no blocking issues.
- [ ] **No regressions** — existing pages and API routes still function after the change.
- [ ] **Security reviewed** — no hardcoded secrets, all SQL queries use parameterized values, role checks are server-side.
- [ ] **Docs updated** — epic's Automation Log has a new entry; any changed API contracts or DB schema are reflected in relevant doc files.
- [ ] **DEV deployed** — `scripts/deploy-dev.sh` runs successfully; `/api/health` returns 200.
