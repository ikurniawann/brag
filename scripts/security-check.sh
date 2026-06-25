#!/usr/bin/env bash
# Security gate — secrets scan + dependency audit
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/_agentic_lib.sh"

cd "$PROJECT_ROOT"

echo "=== Security Gate ==="
FAIL=0

echo "→ Scanning for committed secrets..."
SECRET_PATTERNS=(
  'password\s*=\s*["\x27][^"\x27]{6,}'
  'secret\s*=\s*["\x27][^"\x27]{8,}'
  'api_key\s*=\s*["\x27][^"\x27]{8,}'
  'DATABASE_URL\s*=\s*postgresql://[^@]+:[^@]+@'
  'SUPABASE_SERVICE_ROLE_KEY\s*='
  'NEXTAUTH_SECRET\s*=\s*["\x27][^"\x27]{8,}'
)
for pat in "${SECRET_PATTERNS[@]}"; do
  if grep -rEi "$pat" src/ --include="*.ts" --include="*.tsx" --include="*.js" 2>/dev/null | grep -v "\.env" | grep -qv "process\.env"; then
    echo "FAIL: Possible hardcoded secret matching: $pat"
    FAIL=1
  fi
done

echo "→ Checking .env files are not committed..."
if git ls-files --error-unmatch .env.local 2>/dev/null; then
  echo "FAIL: .env.local is tracked by git"
  FAIL=1
fi
if git ls-files --error-unmatch .env 2>/dev/null; then
  echo "FAIL: .env is tracked by git"
  FAIL=1
fi

echo "→ Checking for unguarded SQL DELETE..."
if grep -rn "DELETE FROM" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "WHERE"; then
  echo "WARN: Possible unguarded DELETE FROM (no WHERE clause)"
fi

echo "→ Running npm audit (moderate+)..."
if npm audit --audit-level=moderate 2>/dev/null; then
  log_gate "npm-audit" "PASS"
else
  echo "WARN: npm audit found issues — review before merging to main"
fi

if [[ "$FAIL" -ne 0 ]]; then
  log_gate "Security" "FAIL"
  exit 1
fi

log_gate "Security" "PASS"
echo "=== Security Gate PASS ==="
