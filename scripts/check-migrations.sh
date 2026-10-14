#!/usr/bin/env bash
# Replays every migration on a throw-away local PostgreSQL database.
# Usage: scripts/check-migrations.sh [psql connection args]
set -euo pipefail
DB="soma_check_$$"
cd "$(dirname "$0")/.."
createdb "$@" "$DB"
trap 'dropdb "$@" "$DB" >/dev/null 2>&1 || true' EXIT
psql "$@" -d "$DB" -v ON_ERROR_STOP=1 -q -f scripts/supabase-stub.sql
for f in supabase/migrations/*.sql; do
  echo "-> $f"
  psql "$@" -d "$DB" -v ON_ERROR_STOP=1 -q -f "$f"
done
if [ -f supabase/tests/smoke.sql ]; then
  echo "-> supabase/tests/smoke.sql"
  psql "$@" -d "$DB" -v ON_ERROR_STOP=1 -q -f supabase/tests/smoke.sql
fi
echo "OK: toutes les migrations passent."
