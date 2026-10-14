\set ON_ERROR_STOP on
-- Proves the Row Level Security rules in supabase/migrations/. Every check raises an exception
-- when it fails, so the script (and `npm run db:test`) stops with an error.
create function pg_temp.expect(label text, actual bigint, expected bigint) returns void
language plpgsql as $$
begin
  if actual is distinct from expected then
    raise exception '% : expected %, got %', label, expected, actual;
  end if;
  raise notice '% = % (ok)', label, actual;
end $$;
grant execute on function pg_temp.expect(text, bigint, bigint) to authenticated;

-- Accounts arrive the way Supabase creates them; whatever the metadata claims, the trigger makes
-- an inactive teacher with no classes (a self-made admin is impossible).
insert into auth.users (id, email, raw_user_meta_data) values
  ('11111111-1111-1111-1111-111111111111', 'a@example.com', '{"name":"Asha","school":"Sunrise"}'),
  ('22222222-2222-2222-2222-222222222222', 'b@example.com', '{"name":"Bala","classes":[1,2,3,4,5,6,7,8],"subjects":["hindi"],"active":true}'),
  ('33333333-3333-3333-3333-333333333333', 'admin@example.com', '{"name":"Admin","role":"admin"}');
select pg_temp.expect('profiles created by the trigger', (select count(*) from public.profiles), 3);
select pg_temp.expect('admins from metadata', (select count(*) from public.profiles where role = 'admin'), 0);
select pg_temp.expect('active from metadata', (select count(*) from public.profiles where active), 0);
select pg_temp.expect('classes from metadata', (select count(*) from public.profiles where classes <> '{}'), 0);

-- The server (secret key) then sets what the admin chose, as lib/data/supabase-store.ts does.
set role service_role;
update public.profiles set classes = '{1,2}', subjects = '{hindi}', active = true where email = 'a@example.com';
update public.profiles set classes = '{3}', subjects = '{computer}', active = true where email = 'b@example.com';
update public.profiles set role = 'admin', active = true where email = 'admin@example.com';
reset role;

-- Teacher A saves a test and sees only it.
set role authenticated;
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
insert into public.tests (teacher_id, title, class, subject, book_slug) values (auth.uid(), 'Unit test 1', 1, 'hindi', 'hindi-1');
select pg_temp.expect('A sees own tests', (select count(*) from public.tests), 1);
select pg_temp.expect('A sees own profile only', (select count(*) from public.profiles), 1);
-- A cannot save a test under another teacher's id.
do $$ begin
  insert into public.tests (teacher_id, title, class, subject, book_slug) values ('22222222-2222-2222-2222-222222222222', 'forged', 1, 'hindi', 'hindi-1');
  raise exception 'forged insert was allowed';
exception when insufficient_privilege then raise notice 'forged insert blocked (ok)'; end $$;

-- Teacher B sees nothing of A's and cannot change or delete it.
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
select pg_temp.expect('B sees A''s tests', (select count(*) from public.tests), 0);
select pg_temp.expect('B sees profiles', (select count(*) from public.profiles), 1);
update public.tests set title = 'hacked';
delete from public.tests;
reset role;
select pg_temp.expect('A''s test untouched', (select count(*) from public.tests where title = 'Unit test 1'), 1);
set role authenticated;
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
-- B cannot read access requests or doubts (no rows visible) or the usage counters (no grant).
select pg_temp.expect('B sees requests', (select count(*) from public.access_requests), 0);
select pg_temp.expect('B sees doubts', (select count(*) from public.doubts), 0);
do $$ begin
  perform count(*) from public.ai_usage;
  raise exception 'ai_usage readable';
exception when insufficient_privilege then raise notice 'ai_usage blocked (ok)'; end $$;
do $$ begin
  perform public.bump_ai_usage('chat', 'x', now());
  raise exception 'bump_ai_usage callable by a teacher';
exception when insufficient_privilege then raise notice 'bump_ai_usage blocked (ok)'; end $$;
-- B cannot promote themselves, change classes or reactivate; contact details are theirs.
do $$ begin
  update public.profiles set role = 'admin' where id = auth.uid();
  raise exception 'role change was allowed';
exception when insufficient_privilege then raise notice 'role change blocked (ok)'; end $$;
do $$ begin
  update public.profiles set classes = '{1,2,3,4,5,6,7,8}' where id = auth.uid();
  raise exception 'classes change was allowed';
exception when insufficient_privilege then raise notice 'classes change blocked (ok)'; end $$;
update public.profiles set phone = '9999' where id = auth.uid();
select pg_temp.expect('B changed own phone', (select count(*) from public.profiles where phone = '9999'), 1);
update public.profiles set phone = '1111' where id = '11111111-1111-1111-1111-111111111111';
reset role;
select pg_temp.expect('A''s phone untouched', (select count(*) from public.profiles where phone = '1111'), 0);

-- Anonymous visitors read nothing at all.
set role anon;
do $$ begin
  perform count(*) from public.profiles;
  raise exception 'anon can read profiles';
exception when insufficient_privilege then raise notice 'anon blocked (ok)'; end $$;
reset role;

-- The server (service role) writes a request; the admin reads every profile and request, but no tests.
set role service_role;
insert into public.access_requests (name, school, role, email, phone, book, class) values ('P', 'S', 'principal', 'p@example.com', '9', 'hindi-1', 2);
select pg_temp.expect('usage counter', public.bump_ai_usage('chat', 'k', '2026-01-01'), 1);
select pg_temp.expect('usage counter again', public.bump_ai_usage('chat', 'k', '2026-01-01'), 2);
reset role;
set role authenticated;
set request.jwt.claim.sub = '33333333-3333-3333-3333-333333333333';
select pg_temp.expect('admin sees profiles', (select count(*) from public.profiles), 3);
select pg_temp.expect('admin sees requests', (select count(*) from public.access_requests), 1);
select pg_temp.expect('admin sees tests', (select count(*) from public.tests), 0);
reset role;
