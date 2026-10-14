#!/bin/sh
# Proves the Row Level Security rules on any local PostgreSQL (no Supabase needed):
# creates a scratch database, loads the Supabase stand-in and the migrations, runs rls-test.sql.
# Connection comes from the usual PGHOST / PGPORT / PGUSER variables.
set -e
DB="${RLS_TEST_DB:-elara_rls_test}"
psql -v ON_ERROR_STOP=1 -q -d postgres -c "drop database if exists $DB" -c "create database $DB"
psql -v ON_ERROR_STOP=1 -q -d "$DB" -f scripts/db/supabase-stub.sql
for f in supabase/migrations/*.sql; do psql -v ON_ERROR_STOP=1 -q -d "$DB" -f "$f"; done
psql -v ON_ERROR_STOP=1 -q -o /dev/null -d "$DB" -f scripts/db/rls-test.sql
echo "RLS checks passed."
