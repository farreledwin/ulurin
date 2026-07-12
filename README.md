# Bagibagi

Bagibagi is a focused donation marketplace preview for a simple idea:
helping others can become a real, transparent profession.

Organizers can start a campaign and set an optional **0%-10% operational
allowance**. Donors see the split before pledging, so the beneficiary amount
and organizer income are explicit from the start.

## Included Features

- Marketplace / discover donation campaigns
- Create campaign / start a circle
- Organizer allowance setting from 0%-10%
- Transparent donation split calculation
- Donor-facing breakdown before pledge
- Organizer dashboard preview
- Optional Supabase waitlist storage for preview pledges

## Current Status

This repo is a preview UI extracted from the Salapi codebase and narrowed to
Bagibagi's donation marketplace model. It does **not** move real money yet and
does **not** deploy a donation smart contract in this repo.

The pledge flow stores a waitlist entry when Supabase service-role credentials
are configured. Without Supabase, it logs the pledge on the server and keeps the
preview clickable.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Supabase optional server-side storage

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Optional Supabase Setup

Create the table from:

```text
supabase/circles_waitlist.sql
```

Then set:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Useful Routes

- `/` and `/circles` - discover donation campaigns
- `/circles/create` - create a campaign
- `/circles/[id]` - campaign detail with donor breakdown
- `/circles/[id]/donate` - pledge / waitlist flow
- `/circles/[id]/manage` - organizer dashboard preview
- `/you/kyc-tier` - allowance tier preview
- `/transparency` - transparency model notes
