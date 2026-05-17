-- Newsletter subscription capture (blog + /resources).
-- Inserts go through the serverless function (api/newsletter.ts) with the
-- service-role key. Anon role never gets insert permission on this table.
-- No anon read either: an email list is private even at row-count granularity.

create table if not exists public.newsletter_subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Contact (the only field a subscriber gives us)
  email text not null,

  -- Consent (GDPR Art. 6(1)(a) legal basis = consent)
  consent_marketing boolean not null default false,
  consent_version text not null,

  -- Attribution (lets us see which post / channel converts)
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  source_path text, -- /blog/<slug> or /resources or wherever the form rendered
  locale text check (locale in ('fr','en')),

  -- Anti-abuse (server-side only — never returned to client)
  client_ip_hash text,

  -- Idempotency for double-submit guard
  client_submission_id text unique,

  -- Soft-unsubscribe flag (no row delete, GDPR audit trail preserved)
  unsubscribed boolean not null default false,
  unsubscribed_at timestamptz
);

create index if not exists newsletter_subscriptions_email_idx
  on public.newsletter_subscriptions (email);
create index if not exists newsletter_subscriptions_created_at_idx
  on public.newsletter_subscriptions (created_at desc);

alter table public.newsletter_subscriptions enable row level security;

-- No anon policies on purpose: every operation must go through service-role.
