#!/usr/bin/env bash
# Régénère src/lib/database.types.ts SANS Docker, depuis une base PostgreSQL
# locale où les migrations ont été rejouées, via @supabase/postgres-meta.
#   PG_META_DB_URL=postgresql://postgres:postgres@127.0.0.1:5432/soma_types scripts/gen-types-local.sh
# Si le projet Supabase est lié et les migrations appliquées, préférer : npm run db:types
set -euo pipefail
cd "$(dirname "$0")/.."
: "${PG_META_DB_URL:?Définir PG_META_DB_URL}"
OUTIL="${TMPDIR:-/tmp}/pg-meta-soma"
if [ ! -f "$OUTIL/node_modules/@supabase/postgres-meta/dist/server/server.js" ]; then
  mkdir -p "$OUTIL" && (cd "$OUTIL" && npm init -y >/dev/null && npm install --silent @supabase/postgres-meta)
fi
PG_META_GENERATE_TYPES=typescript \
PG_META_GENERATE_TYPES_INCLUDED_SCHEMAS=public,core,livraisons,production,mine,finance,pilotage \
PG_META_GENERATE_TYPES_DETECT_ONE_TO_ONE_RELATIONSHIPS=true \
  node "$OUTIL/node_modules/@supabase/postgres-meta/dist/server/server.js" > src/lib/database.types.ts 2>/dev/null
echo "Types régénérés : src/lib/database.types.ts"
