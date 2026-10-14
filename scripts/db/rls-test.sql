\set ON_ERROR_STOP on
-- Two teachers and one admin, created the way the server does it (trigger fills profiles).
insert into auth.users (id, email, raw_user_meta_data) values
  ('11111111-1111-1111-1111-111111111111', 'a@example.com', '{"name":"Asha","school":"Sunrise","classes":[1,2],"subjects":["hindi"]}'),
  ('22222222-2222-2222-2222-222222222222', 'b@example.com', '{"name":"Bala","classes":[3],"subjects":["computer"]}'),
  ('33333333-3333-3333-3333-333333333333', 'admin@example.com', '{"name":"Admin","role":"admin"}');
select id, email, name, role, classes, subjects from public.profiles order by email;

-- Teacher A saves a test.
set role authenticated;
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
insert into public.tests (teacher_id, title, class, subject, book_slug) values (auth.uid(), 'Unit test 1', 1, 'hindi', 'hindi-1');
select count(*) as a_sees_own from public.tests;
-- A cannot save a test under another teacher's id.
do $$ begin
  insert into public.tests (teacher_id, title, class, subject, book_slug) values ('22222222-2222-2222-2222-222222222222', 'forged', 1, 'hindi', 'hindi-1');
  raise exception 'forged insert was allowed';
exception when insufficient_privilege then raise notice 'forged insert blocked (ok)'; end $$;

-- Teacher B sees nothing of A's.
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
select count(*) as b_sees from public.tests;
select count(*) as b_profiles from public.profiles;
update public.tests set title = 'hacked';
select count(*) as b_updated from public.tests where title = 'hacked';
-- B cannot read access requests or ai_usage.
select count(*) as b_requests from public.access_requests;
do $$ begin
  perform count(*) from public.ai_usage;
  raise exception 'ai_usage readable';
exception when insufficient_privilege then raise notice 'ai_usage blocked (ok)'; end $$;
-- B cannot promote themselves.
do $$ begin
  update public.profiles set role = 'admin' where id = auth.uid();
  raise exception 'role change was allowed';
exception when insufficient_privilege then raise notice 'role change blocked (ok)'; end $$;
update public.profiles set phone = '9999' where id = auth.uid();
select phone as b_phone from public.profiles where id = auth.uid();

-- Admin reads every profile and request, but not tests.
set request.jwt.claim.sub = '33333333-3333-3333-3333-333333333333';
select count(*) as admin_profiles from public.profiles;
select count(*) as admin_tests from public.tests;
reset role;
-- The server (service role) writes a request; the admin then reads it.
set role service_role;
insert into public.access_requests (name, school, role, email, phone, book, class) values ('P', 'S', 'principal', 'p@example.com', '9', 'hindi-1', 2);
reset role;
set role authenticated;
set request.jwt.claim.sub = '33333333-3333-3333-3333-333333333333';
select count(*) as admin_requests from public.access_requests;
reset role;
