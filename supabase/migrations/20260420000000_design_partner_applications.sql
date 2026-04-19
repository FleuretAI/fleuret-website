-- Design Partner program application capture.
-- Slot counter reads count(*) WHERE status = 'partner' via a SECURITY DEFINER
-- function exposed to anon (count-only, no row access). Inserts go through the
-- serverless function with the service-role key, so the anon role never needs
-- insert permission on this table.

create type if not exists design_partner_status as enum (
  'applied',        -- form submitted, not yet reviewed
  'qualified',      -- founder invited to calendar
  'unqualified',    -- outside ICP, manual review
  'called',         -- qualification call happened
  'contracted',     -- SOW signed
  'partner',        -- kickoff done, counts toward 5/5
  'rejected'        -- pilot did not proceed
);

create table if not exists public.design_partner_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Contact
  email text not null,
  role text not null,
  company text,
  company_size text not null check (company_size in ('<50','50-99','100-499','500-999','1000+')),
  primary_asset text not null,

  -- Consent (GDPR legal basis)
  consent_contact boolean not null default false,
  consent_version text not null,

  -- Attribution
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  locale text check (locale in ('fr','en')),

  -- Qualification outcome
  qualified boolean not null default false,
  status design_partner_status not null default 'applied',

  -- Anti-abuse (server-side only)
  client_ip_hash text,

  -- Idempotency for double-submit guard
  client_submission_id text unique
);

create index if not exists design_partner_applications_status_idx
  on public.design_partner_applications (status);
create index if not exists design_partner_applications_created_at_idx
  on public.design_partner_applications (created_at desc);

alter table public.design_partner_applications enable row level security;

-- No anon access to rows. All reads/writes go through the service-role in the
-- serverless function. Service-role bypasses RLS automatically.

create or replace function public.design_partner_slots_remaining(total int default 5)
returns int
language sql
stable
security definer
set search_path = public
as $$
  select greatest(0, total - (
    select count(*)::int from public.design_partner_applications
    where status = 'partner'
  ));
$$;

grant execute on function public.design_partner_slots_remaining(int) to anon, authenticated;
