-- Run once in Supabase → SQL Editor → New query → Run.
-- Ulurin waitlist (public launch preview). Captures pledges from the
-- /circles/[id]/donate and /circles/create flows so we can notify supporters
-- the moment Ulurin ships at public launch. NO money is moved, NO
-- on-chain transaction is created. RLS is ON with NO policies; only the
-- server's service-role key can read/write. Email is the only PII collected.

create table if not exists public.circles_waitlist (
  id              uuid primary key default gen_random_uuid(),
  email           text not null,
  circle_id       text,            -- seed circle id, or "draft:<slug>" for creators
  rupiah_pledge     integer,         -- IDR-first app unit; informational
  anonymous       boolean not null default false,
  marketing_ok    boolean not null default true,
  locale          text,            -- id / en / vi at time of pledge
  created_at      timestamptz not null default now()
);

create index if not exists circles_waitlist_email_idx
  on public.circles_waitlist (email);

create index if not exists circles_waitlist_circle_idx
  on public.circles_waitlist (circle_id);

alter table public.circles_waitlist enable row level security;

revoke all on public.circles_waitlist from anon, authenticated;
