-- MOK website content backend
-- Run this whole file in Supabase Dashboard > SQL Editor.

create table if not exists public.site_content (
  id text primary key check (id = 'primary'),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_admins (
  email text primary key check (email = lower(trim(email))),
  created_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
alter table public.site_admins enable row level security;

revoke all on public.site_content from anon, authenticated;
grant select on public.site_content to anon, authenticated;
grant update on public.site_content to authenticated;

revoke all on public.site_admins from anon, authenticated;
grant select on public.site_admins to authenticated;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content for select
  to anon, authenticated
  using (true);

drop policy if exists "Only listed admins can update site content" on public.site_content;
create policy "Only listed admins can update site content"
  on public.site_content for update
  to authenticated
  using (exists (
    select 1 from public.site_admins
    where site_admins.email = lower((select auth.jwt() ->> 'email'))
  ))
  with check (exists (
    select 1 from public.site_admins
    where site_admins.email = lower((select auth.jwt() ->> 'email'))
  ));

drop policy if exists "Admins can view their own admin record" on public.site_admins;
create policy "Admins can view their own admin record"
  on public.site_admins for select
  to authenticated
  using (email = lower((select auth.jwt() ->> 'email')));

insert into public.site_content (id, content)
values (
  'primary',
  '{
    "company": "MOK Limited",
    "tagline": "Sustainable business & investment",
    "headline": "Building businesses that move the world forward.",
    "intro": "We turn sound environmental ideas into well-run, investable businesses — creating lasting value for people, partners and the planet.",
    "about": "MOK Limited is a Lagos-based consultancy creating businesses and investment portfolios in environmental and sustainable sectors. From the first business model to the team, capital and systems needed to run it, we help good ideas become enduring ventures.",
    "email": "ceo@mokltd.com",
    "phone": "+234 701 747 3855",
    "address": "14 Reeve Road, Ikoyi, Lagos, Nigeria",
    "director": "Osamagbe Oyuki Obaseki",
    "website": "mokltd.com",
    "vision": "To be Nigeria’s leading partner for building, funding and growing environmental and sustainable businesses.",
    "mission": "To turn sound environmental ideas into investable businesses and build portfolios that deliver financial returns alongside measurable environmental impact.",
    "cta": "Let’s build what’s next"
  }'::jsonb
)
on conflict (id) do nothing;

-- Admin setup:
-- 1. Create the admin user in Authentication > Users (disable public sign-ups).
-- 2. Allowlist only the email address you will use to sign in.
-- insert into public.site_admins (email)
-- values ('YOUR-ADMIN-EMAIL@example.com')
-- on conflict do nothing;
