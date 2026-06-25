#!/usr/bin/env bash
# QA gate — lint + typecheck
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/_agentic_lib.sh"

cd "$PROJECT_ROOT"

echo "=== QA Gate ==="

echo "→ Running ESLint..."
if npm run lint -- --max-warnings=0; then
  log_gate "lint" "PASS"
else
  log_gate "lint" "FAIL"
  exit 1
fi

echo "→ Running TypeScript check..."
if npm run typecheck; then
  log_gate "typecheck" "PASS"
else
  log_gate "typecheck" "FAIL"
  exit 1
fi

log_gate "QA" "PASS"
echo "=== QA Gate PASS ==="
