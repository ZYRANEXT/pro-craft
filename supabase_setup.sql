
-- Supabase setup for CraftProfitCalc one-use licenses

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

drop policy if exists "Read license by key" on public.licenses;
drop policy if exists "Activate unused license" on public.licenses;

create policy "Read license by key"
on public.licenses
for select
to anon
using (true);

create policy "Activate unused license"
on public.licenses
for update
to anon
using (status = 'active')
with check (status = 'active');

-- Example license. Replace email before use.
insert into public.licenses (license_key, email, status, used)
values ('CPRO-TEST-0001', 'buyer@example.com', 'active', false)
on conflict (license_key) do nothing;
