# BRAG — Agent Registry

## Custom Agents (Project-Specific)

These agents are defined in `.claude/agents/` and are aware of BRAG conventions.

| Agent | Trigger | Responsibility |
|-------|---------|----------------|
| `code-agent` | `/task-work`, `/epic-loop` | Implement exactly ONE task per invocation. Follows BRAG conventions. Never invents scope. Never commits or pushes. |
| `epic-orchestrator` | `/epic-loop` | Reads EPIC-XXX.md, breaks into tasks, coordinates code → review → security → test → deploy pipeline with max 3 retries. |
| `review-qa-agent` | After code-agent | Checks diff against task acceptance criteria and BRAG conventions. Returns PASS/FAIL. |
| `security-agent` | After review-qa-agent | Runs `scripts/security-check.sh`; checks for hardcoded secrets, unguarded SQL, role bypass. Returns PASS/FAIL. |
| `test-agent` | After security-agent | Runs `scripts/qa.sh` and `scripts/test.sh`. Returns PASS/FAIL with failing output. |
| `deploy-agent` | After test-agent | Runs `scripts/deploy-dev.sh`. DEV only — refuses production. |

## Pre-Built Agents (Prefer These)

Reuse-first: always prefer ECC/Ruflo pre-built agents for generic capabilities.

| Capability | Use |
|------------|-----|
| TypeScript/React review | `ecc:typescript-reviewer`, `ecc:react-reviewer` |
| Security review | `ecc:security-reviewer` |
| Architecture decisions | `ecc:architect` |
| Build error resolution | `ecc:build-error-resolver` |
| Research | `ruflo-core:researcher` |
| Memory recall | `ruflo-rag-memory:memory-specialist` |

## Routing Rule

> Custom agents are for BRAG-specific behavior only: tenant data scoping, point_events insert-only invariant, BNI role hierarchy, and gate script execution. All other capabilities defer to pre-built agents.
