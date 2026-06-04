
-- CraftProfitCalc license permission fix
-- Run this in Supabase SQL Editor.

create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  license_key text unique not null,
  email text not null,
  status text not null default 'active',
  used boolean not null default false,
  used_at timestamptz,
  device_id text,
  created_at timestamptz not null default now()
);

alter table public.licenses enable row level security;

-- Required when "Automatically expose new tables" is OFF
grant usage on schema public to anon;
grant select, update on public.licenses to anon;

drop policy if exists "Read license by key" on public.licenses;
drop policy if exists "Activate unused license" on public.licenses;
drop policy if exists "Update active licenses" on public.licenses;

create policy "Read license by key"
on public.licenses
for select
to anon
using (true);

create policy "Update active licenses"
on public.licenses
for update
to anon
using (status = 'active')
with check (status = 'active');

insert into public.licenses (license_key, email, status, used)
values ('CPRO-TEST-0001', 'buyer@example.com', 'active', false)
on conflict (license_key) do update
set email = excluded.email,
    status = 'active',
    used = false,
    used_at = null,
    device_id = null;
