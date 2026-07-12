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
- Soroban smart contract for testnet campaign vaults

## Current Status

This repo is a preview UI extracted from the Salapi codebase and narrowed to
Bagibagi's donation marketplace model. The app flow still uses preview pledges,
but the repo now includes a Soroban contract that can run on Stellar testnet.

The pledge flow stores a waitlist entry when Supabase service-role credentials
are configured. Without Supabase, it logs the pledge on the server and keeps the
preview clickable.

## Smart Contract

The contract lives in:

```text
contracts/bagibagi-campaign
```

It is one multi-campaign vault with the core Bagibagi mechanics:

- admin initializes the contract with a token
- admin sets organizer verification tier
- organizer creates a campaign
- tier caps organizer allowance:
  - Tier 0: 0%
  - Tier 1: up to 5%
  - Tier 2: up to 10%
- donor donation is split immediately into beneficiary balance and organizer allowance escrow
- beneficiary can withdraw the beneficiary portion
- organizer uploads proof
- admin releases allowance after proof exists

Run contract tests:

```bash
cargo test --workspace
```

Build optimized WASM:

```bash
rustup target add wasm32v1-none
stellar contract build --package bagibagi-campaign
```

Deploy and initialize on Stellar testnet:

```bash
chmod +x scripts/deploy-testnet.sh
./scripts/deploy-testnet.sh
```

The deploy script prints:

```text
BAGIBAGI_CAMPAIGN_CONTRACT=...
BAGIBAGI_TOKEN_CONTRACT=...
BAGIBAGI_ADMIN=...
STELLAR_NETWORK=testnet
```

Current testnet deployment and smoke transactions are recorded in
[`DEPLOYMENTS.md`](DEPLOYMENTS.md).

Provision local server actions for the deployed testnet contract:

```bash
chmod +x scripts/provision-testnet-env.sh
./scripts/provision-testnet-env.sh
```

This writes `.env.local` with server-managed demo signers for admin,
organizer, donor, and beneficiary. The app can then call the testnet contract
from the create, donate, and organizer dashboard screens.

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
