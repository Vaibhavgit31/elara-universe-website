# Database checks (Phase 2)

`rls-test.sql` proves the Row Level Security rules in `supabase/migrations/`: a teacher sees and
edits only their own tests, cannot forge another teacher's row or promote themselves, cannot read
access requests, doubts or AI counters; an admin reads every profile and request but no tests.

It runs against any PostgreSQL 14+ with a stand-in for the Supabase `auth` schema
(`supabase-stub.sql`: the `anon`, `authenticated` and `service_role` roles, `auth.users` and
`auth.uid()`), so no Supabase project is needed:

```bash
npm run db:test            # needs a local server; PGHOST/PGPORT/PGUSER as usual for psql
```

On a real project the same policies are live once the migration is applied (see SETUP-SUPABASE.md).
