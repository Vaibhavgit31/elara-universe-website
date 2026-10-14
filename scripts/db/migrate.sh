#!/bin/sh
# Applies every file in supabase/migrations/ to the database in SUPABASE_DB_URL with psql
# (the Session pooler string from the Supabase dashboard's Connect button; see SETUP-SUPABASE.md).
set -e
if [ -z "$SUPABASE_DB_URL" ]; then
  echo "SUPABASE_DB_URL is not set. Copy the connection string from Supabase → Connect, or paste the SQL into the dashboard's SQL Editor (SETUP-SUPABASE.md)." >&2
  exit 1
fi
for f in supabase/migrations/*.sql; do
  echo "Applying $f"
  psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -q -f "$f"
done
echo "Done."
