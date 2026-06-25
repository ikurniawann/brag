#!/usr/bin/env bash
# Test gate — build verification
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/_agentic_lib.sh"

cd "$PROJECT_ROOT"

echo "=== Test Gate ==="

echo "→ Running Next.js build..."
if npm run build; then
  log_gate "build" "PASS"
else
  log_gate "build" "FAIL"
  exit 1
fi

log_gate "Test" "PASS"
echo "=== Test Gate PASS ==="
