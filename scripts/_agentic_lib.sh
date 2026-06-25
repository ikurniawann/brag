#!/usr/bin/env bash
# Shared helpers for gate scripts

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

_agentic_find_manifest() {
  local dir="$1"
  while [[ "$dir" != "/" ]]; do
    if [[ -f "$dir/.agentic/config.yml" ]]; then
      echo "$dir/.agentic/config.yml"
      return 0
    fi
    dir="$(dirname "$dir")"
  done
  return 1
}

manifest_get() {
  local key="$1"
  local manifest
  manifest="$(_agentic_find_manifest "$PROJECT_ROOT" 2>/dev/null || true)"
  if [[ -z "$manifest" ]]; then return 1; fi
  python3 -c "
import sys
try:
    import yaml
    with open('$manifest') as f:
        d = yaml.safe_load(f)
    keys = '$key'.split('.')
    v = d
    for k in keys:
        v = v[k]
    print(v)
except Exception:
    sys.exit(1)
" 2>/dev/null || true
}

detect_pm() {
  if [[ -f "$PROJECT_ROOT/pnpm-lock.yaml" ]]; then echo "pnpm"
  elif [[ -f "$PROJECT_ROOT/yarn.lock" ]]; then echo "yarn"
  elif [[ -f "$PROJECT_ROOT/bun.lockb" ]]; then echo "bun"
  else echo "npm"
  fi
}

pm_run() {
  local pm
  pm="$(detect_pm)"
  case "$pm" in
    pnpm) pnpm run "$@" ;;
    yarn) yarn run "$@" ;;
    bun)  bun run "$@" ;;
    *)    npm run "$@" ;;
  esac
}

log_gate() {
  local gate="$1" status="$2"
  echo "[$(date '+%H:%M:%S')] GATE:$gate → $status"
}
