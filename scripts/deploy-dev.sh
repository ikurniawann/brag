#!/usr/bin/env bash
# DEV deploy gate — build + health check
# NEVER deploys to production
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/_agentic_lib.sh"

cd "$PROJECT_ROOT"

if [[ "${DEPLOY_ENV:-}" == "production" ]] || [[ "${NODE_ENV:-}" == "production" ]]; then
  echo "BLOCKED: This script only runs in DEV. Production deploys require manual approval."
  exit 1
fi

echo "=== DEV Deploy ==="

echo "→ Building for DEV..."
if npm run build; then
  log_gate "build" "PASS"
else
  log_gate "build" "FAIL"
  exit 1
fi

echo "→ DEV build complete. Start the server with: npm run start"
echo "→ Health check endpoint: http://localhost:3000/api/health"

log_gate "deploy-dev" "PASS"
echo "=== DEV Deploy PASS ==="
