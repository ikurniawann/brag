create extension if not exists pgcrypto;
create schema if not exists app_private;

grant usage on schema public to anon, authenticated;

create type public.app_role as enum ('member', 'admin', 'super_admin');
create type public.contribution_category as enum ('tyfcb', 'visitor', 'referral');
create type public.contribution_status as enum ('pending', 'approved', 'rejected');
create type public.booster_mode as enum ('bonus_points', 'multiplier');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  company text,
  classification text,
  role public.app_role not null default 'member',
  external_member_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  starts_on date,
  ends_on date,
  status text not null default 'draft' check (status in ('draft', 'active', 'completed')),
  created_at timestamptz not null default now()
);

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.event_seasons(id) on delete cascade,
  name text not null,
  color text not null default '#c8102e',
  captain_profile_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (season_id, name)
);

create table public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (group_id, profile_id)
);

create table public.contribution_types (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.event_seasons(id) on delete cascade,
  category public.contribution_category not null,
  name text not null,
  base_points integer not null default 0 check (base_points >= 0),
  auto_approve boolean not null default false,
  requires_evidence boolean not null default true,
  unique (season_id, category)
);

create table public.contributions (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.event_seasons(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  contribution_type_id uuid not null references public.contribution_types(id),
  category public.contribution_category not null,
  title text not null,
  details text not null,
  occurred_on date not null,
  amount numeric(14, 2),
  evidence_url text,
  status public.contribution_status not null default 'pending',
  rejection_reason text,
  verified_by uuid references public.profiles(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.booster_rules (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.event_seasons(id) on delete cascade,
  name text not null,
  category public.contribution_category not null,
  mode public.booster_mode not null,
  bonus_points integer check (bonus_points is null or bonus_points >= 0),
  multiplier numeric(6, 2) check (multiplier is null or multiplier >= 1),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at),
  check (
    (mode = 'bonus_points' and bonus_points is not null and multiplier is null)
    or (mode = 'multiplier' and multiplier is not null and bonus_points is null)
  )
);

create table public.point_events (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.event_seasons(id) on delete cascade,
  contribution_id uuid references public.contributions(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  group_id uuid references public.groups(id) on delete set null,
  category public.contribution_category not null,
  points integer not null,
  source text not null default 'contribution',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.awards (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.event_seasons(id) on delete cascade,
  name text not null,
  description text,
  awarded_to_profile_id uuid references public.profiles(id) on delete set null,
  awarded_to_group_id uuid references public.groups(id) on delete set null,
  period_start date,
  period_end date,
  created_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public)
values ('contribution-evidence', 'contribution-evidence', false)
on conflict (id) do nothing;

create index contributions_season_status_idx on public.contributions (season_id, status);
create index contributions_profile_idx on public.contributions (profile_id, created_at desc);
create index point_events_season_group_idx on public.point_events (season_id, group_id);
create index point_events_season_profile_idx on public.point_events (season_id, profile_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger contributions_set_updated_at
before update on public.contributions
for each row execute function public.set_updated_at();

create or replace function app_private.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'super_admin')
  );
$$;

revoke all on schema app_private from public;
grant usage on schema app_private to authenticated;
grant execute on function app_private.is_admin() to authenticated;

create or replace function app_private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_app_meta_data ->> 'role')::public.app_role, 'member')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function app_private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.event_seasons enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.contribution_types enable row level security;
alter table public.contributions enable row level security;
alter table public.booster_rules enable row level security;
alter table public.point_events enable row level security;
alter table public.awards enable row level security;

grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage on all sequences in schema public to authenticated;

create policy "profiles can read own profile and admins read all"
on public.profiles for select
to authenticated
using (id = auth.uid() or app_private.is_admin());

create policy "admins manage profiles"
on public.profiles for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "authenticated users read active season config"
on public.event_seasons for select
to authenticated
using (true);

create policy "admins manage seasons"
on public.event_seasons for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "authenticated users read groups"
on public.groups for select
to authenticated
using (true);

create policy "admins manage groups"
on public.groups for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "authenticated users read group memberships"
on public.group_members for select
to authenticated
using (true);

create policy "admins manage group memberships"
on public.group_members for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "authenticated users read scoring rules"
on public.contribution_types for select
to authenticated
using (true);

create policy "admins manage scoring rules"
on public.contribution_types for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "members read own contributions and admins read all"
on public.contributions for select
to authenticated
using (profile_id = auth.uid() or app_private.is_admin());

create policy "members create own pending contributions"
on public.contributions for insert
to authenticated
with check (profile_id = auth.uid() and status = 'pending');

create policy "admins verify contributions"
on public.contributions for update
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "authenticated users read booster rules"
on public.booster_rules for select
to authenticated
using (true);

create policy "admins manage booster rules"
on public.booster_rules for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "authenticated users read point events"
on public.point_events for select
to authenticated
using (true);

create policy "admins manage point events"
on public.point_events for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "authenticated users read awards"
on public.awards for select
to authenticated
using (true);

create policy "admins manage awards"
on public.awards for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

create policy "members upload own contribution evidence"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'contribution-evidence'
  and owner = auth.uid()
);

create policy "members read own contribution evidence and admins read all"
on storage.objects for select
to authenticated
using (
  bucket_id = 'contribution-evidence'
  and (owner = auth.uid() or app_private.is_admin())
);

create policy "members update own contribution evidence"
on storage.objects for update
to authenticated
using (
  bucket_id = 'contribution-evidence'
  and owner = auth.uid()
)
with check (
  bucket_id = 'contribution-evidence'
  and owner = auth.uid()
);
