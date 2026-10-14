-- Elara Universe Publishers — Phase 2 schema (Step F).
-- Tables for teacher accounts, access requests, doubts, saved tests and AI usage counters, all with
-- Row Level Security. Patterns follow the official Supabase guides:
--   https://supabase.com/docs/guides/auth/managing-user-data      (profiles + handle_new_user trigger)
--   https://supabase.com/docs/guides/database/postgres/row-level-security (policies, security definer helper)
--   https://supabase.com/docs/guides/deployment/database-migrations (this folder)
-- Apply with `supabase db push`, or `psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f <this file>`
-- (see SETUP-SUPABASE.md).

-- ---------------------------------------------------------------------------------------------
-- profiles: one row per auth user, created by the trigger below. Admins create every account
-- (public sign-up is switched off in the dashboard), so a profile always exists for a user.
-- ---------------------------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text not null,
  name        text not null default '',
  school      text not null default '',
  phone       text not null default '',
  role        text not null default 'teacher' check (role in ('teacher', 'admin')),
  classes     smallint[] not null default '{}' check (classes <@ '{1,2,3,4,5,6,7,8}'::smallint[]),
  subjects    text[] not null default '{}' check (subjects <@ '{hindi,computer,drawing}'::text[]),
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table public.profiles is 'Teacher and admin profiles (role, school, assigned classes and subjects).';

-- ---------------------------------------------------------------------------------------------
-- access_requests: the public "Request access" form on /web-support. Written by the server only.
-- ---------------------------------------------------------------------------------------------
create table public.access_requests (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  school      text not null,
  role        text not null check (role in ('teacher', 'principal', 'coordinator')),
  email       text not null,
  phone       text not null,
  book        text not null,
  class       smallint not null check (class between 1 and 8),
  message     text not null default '',
  status      text not null default 'new' check (status in ('new', 'approved', 'declined')),
  user_id     uuid references auth.users on delete set null,
  handled_by  uuid references auth.users on delete set null,
  handled_at  timestamptz,
  created_at  timestamptz not null default now()
);
comment on table public.access_requests is 'Requests for a teacher account from the public Web Support page.';

-- ---------------------------------------------------------------------------------------------
-- doubts: "Ask a doubt" on /web-support/help (public). Written by the server only.
-- ---------------------------------------------------------------------------------------------
create table public.doubts (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  school      text not null default '',
  question    text not null,
  page        text not null default '',
  user_id     uuid references auth.users on delete set null,
  status      text not null default 'open' check (status in ('open', 'answered')),
  answer      text not null default '',
  answered_by uuid references auth.users on delete set null,
  answered_at timestamptz,
  created_at  timestamptz not null default now()
);
comment on table public.doubts is 'Questions sent from Help & Doubts; answered by admins.';

-- ---------------------------------------------------------------------------------------------
-- tests: Test Maker papers. A teacher sees only their own rows (RLS below).
-- ---------------------------------------------------------------------------------------------
create table public.tests (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null references auth.users on delete cascade,
  title       text not null,
  class       smallint not null check (class between 1 and 8),
  subject     text not null check (subject in ('hindi', 'computer', 'drawing')),
  book_slug   text not null,
  chapters    text[] not null default '{}',
  settings    jsonb not null default '{}'::jsonb,
  questions   jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table public.tests is 'Saved test papers from the Test Maker (settings and questions as JSON).';
create index tests_teacher_id_idx on public.tests (teacher_id, updated_at desc);

-- ---------------------------------------------------------------------------------------------
-- ai_usage: anonymous counters for rate limits (chat per hashed IP, test generation per teacher
-- per day). No prompts or answers are ever stored. Server only.
-- ---------------------------------------------------------------------------------------------
create table public.ai_usage (
  id          bigint generated always as identity primary key,
  kind        text not null check (kind in ('chat', 'test')),
  subject_key text not null,              -- sha256(ip + daily salt) for chat, the user id for tests
  user_id     uuid references auth.users on delete cascade,
  window_start timestamptz not null,       -- start of the 10-minute (chat) or day (test) window
  count       integer not null default 0,
  unique (kind, subject_key, window_start)
);
comment on table public.ai_usage is 'Anonymous request counters for AI rate limits; no content stored.';
create index ai_usage_window_idx on public.ai_usage (window_start);

-- ---------------------------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------------------------
create function public.set_updated_at()
returns trigger language plpgsql set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger tests_set_updated_at before update on public.tests
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------------------------
-- Profile row for every new auth user. Admins create users with
-- auth.admin.createUser({ email, password, email_confirm: true, user_metadata: {...} }) and the
-- metadata lands here. (Official pattern: managing-user-data guide.)
-- ---------------------------------------------------------------------------------------------
create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (id, email, name, school, phone, role, classes, subjects)
  values (
    new.id,
    new.email,
    coalesce(meta ->> 'name', ''),
    coalesce(meta ->> 'school', ''),
    coalesce(meta ->> 'phone', ''),
    case when meta ->> 'role' = 'admin' then 'admin' else 'teacher' end,
    coalesce((select array_agg(value::smallint) from jsonb_array_elements_text(coalesce(meta -> 'classes', '[]'::jsonb))), '{}'),
    coalesce((select array_agg(value) from jsonb_array_elements_text(coalesce(meta -> 'subjects', '[]'::jsonb))), '{}')
  );
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------------------------
-- Row Level Security. Policies never grant privileges by themselves, so grants are explicit.
-- The server's secret-key client (service_role) bypasses RLS and is the only writer for
-- access_requests, doubts and ai_usage; anon gets nothing.
-- ---------------------------------------------------------------------------------------------
create schema if not exists private;
grant usage on schema private to authenticated;

-- Admin check without recursive policies (security definer, private schema, empty search_path).
create function private.is_admin()
returns boolean language sql security definer set search_path = '' stable
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin' and active
  );
$$;
revoke execute on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

alter table public.profiles        enable row level security;
alter table public.access_requests enable row level security;
alter table public.doubts          enable row level security;
alter table public.tests           enable row level security;
alter table public.ai_usage        enable row level security;

revoke all on all tables in schema public from anon, authenticated;

-- profiles: everyone reads their own row; admins read all. Teachers may change only their own
-- contact details (column-level grant); role, classes, subjects and active are admin-only
-- (changed on the server with the secret key).
grant select on table public.profiles to authenticated;
grant update (name, school, phone) on table public.profiles to authenticated;
create policy "Users read own profile" on public.profiles for select
  to authenticated using ((select auth.uid()) = id);
create policy "Admins read all profiles" on public.profiles for select
  to authenticated using ((select private.is_admin()));
create policy "Users update own contact details" on public.profiles for update
  to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- access_requests and doubts: admins read and update; inserts come from the server only.
grant select, update on table public.access_requests to authenticated;
create policy "Admins read access requests" on public.access_requests for select
  to authenticated using ((select private.is_admin()));
create policy "Admins update access requests" on public.access_requests for update
  to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

grant select, update on table public.doubts to authenticated;
create policy "Admins read doubts" on public.doubts for select
  to authenticated using ((select private.is_admin()));
create policy "Admins update doubts" on public.doubts for update
  to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

-- tests: a teacher sees and edits only their own papers (the owner must be the caller).
grant select, insert, update, delete on table public.tests to authenticated;
create policy "Teachers read own tests" on public.tests for select
  to authenticated using ((select auth.uid()) = teacher_id);
create policy "Teachers insert own tests" on public.tests for insert
  to authenticated with check ((select auth.uid()) = teacher_id);
create policy "Teachers update own tests" on public.tests for update
  to authenticated using ((select auth.uid()) = teacher_id) with check ((select auth.uid()) = teacher_id);
create policy "Teachers delete own tests" on public.tests for delete
  to authenticated using ((select auth.uid()) = teacher_id);

-- ai_usage: server only (no grants to anon or authenticated).

-- ---------------------------------------------------------------------------------------------
-- Atomic counter for the AI rate limits (chat per hashed IP per 10 minutes, test generation per
-- teacher per day). Called by the server with the secret key; returns the new count.
-- ---------------------------------------------------------------------------------------------
create function public.bump_ai_usage(p_kind text, p_key text, p_window timestamptz, p_user uuid default null)
returns integer language sql set search_path = ''
as $$
  insert into public.ai_usage (kind, subject_key, user_id, window_start, count)
  values (p_kind, p_key, p_user, p_window, 1)
  on conflict (kind, subject_key, window_start) do update set count = public.ai_usage.count + 1
  returning count;
$$;
revoke execute on function public.bump_ai_usage(text, text, timestamptz, uuid) from public, anon, authenticated;
