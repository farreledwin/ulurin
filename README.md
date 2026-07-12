# Ulurin

**Helping others, made an honest profession.** A donation platform where the
organizer's cut is disclosed up front, capped at 0-10%, enforced by a smart
contract, and every rupiah is traceable on Stellar.

> Status: **testnet preview**. All demo figures are labelled testnet/sandbox,
> no mainnet money is implied. Powered by Stellar as an ecosystem, not affiliated
> with the Stellar Development Foundation or Stellar Aid Assist.

📖 **Full concept** (vision, market analysis, workflow, roadmap): [Bahasa Indonesia](docs/KONSEP.md) · [English](docs/KONSEP.en.md)

---

## The problem: the money flows, the proof disappears

Indonesia is the most generous country in the world seven years running, yet
trust in online giving keeps breaking on the same fault line: **cuts that are
hidden, uncapped, and unproven.**

- **Cak Budi (2017)**, a well-known social-media fundraiser collected **~Rp 1.2
  billion** and spent it on a Toyota Fortuner and an iPhone 7. There was never an
  honest, up-front disclosure of what share was his.
  ([Detik](https://news.detik.com/berita/d-3488851/heboh-pengakuan-cak-budi-pakai-uang-donasi-untuk-beli-fortuner))
- **ACT (2022)**, of **Rp 138.5 billion** in Boeing funds meant for the families
  of the **Lion Air JT610** crash, only **Rp 20.5 billion** reached its purpose.
  Investigators found ACT skimmed **13.7%**, above the legal 10% cap, and its
  permit was revoked.
  ([The Jakarta Post](https://www.thejakartapost.com/indonesia/2022/08/05/more-than-half-of-act-donations-went-into-execs-pockets-investigators-say.html)
  · [Kompas](https://nasional.kompas.com/read/2022/07/06/13183861/izin-act-dicabut-karena-dugaan-penyelewengan-dana-bagaimana-aturan-donasi-di))

**The problem was never being paid to do good, it was being paid in secret,
without a limit, without proof.** That is exactly what Ulurin fixes.

## The solution

- **Cut disclosed before you give.** Donors see the split (beneficiary / organizer
  allowance / platform fee) before confirming, informed consent, not a hidden fee.
- **Capped 0-10%, enforced on-chain.** The allowance is a contract parameter, not
  a promise. It cannot be changed silently. It grounds the centuries-old principle
  of the *amil* (who may take up to 12.5% under DSN-MUI) in a modern, capped,
  transparent mechanism.
- **Escrow with milestone release.** Donations sit in a Soroban escrow and the
  organizer's allowance is only released **after proof of distribution is
  uploaded**, killing the "take the money and run" pattern.
- **Two-layer transparency (honest):**
  - *On-chain* proves the **money flow**, collected, cut, disbursed.
  - *Off-chain* proves the **spending**, the organizer uploads invoices/photos and
    donors get an update. On-chain does **not** by itself prove "the money bought X."

## Vision & mission

**Vision:** a future where doing good can be a real job, where anyone can make a
living by helping others, and every good deed can be *proven*, not just trusted.

**Mission:**
1. **Make helping a profession**, a stage and transparent income for *Kreator Kebaikan* (Good-Deed Creators).
2. **Give without friction or doubt**, moved by a story, donate on the same screen, get proof instantly.
3. **Protect the beneficiary's dignity**, told as a person with a plan, not an object of pity.
4. **Prove every rupiah arrives**, escrow + public receipts, closing the trust wound left by Cak Budi and ACT.

## Who it's for

Across Indonesia there's a recurring pattern: people who *already* do the good work,
rich in followers or goodwill, but whose income comes and goes with sponsors. Ulurin
turns that trust into **steady, transparent income**, so doing good can be a livelihood
instead of a sponsor-dependent hustle.

**Creators who share kindness**
- **River-cleanup movements** at the scale of *Pandawara*, 12M+ TikTok followers, 1.3M+ kg of trash pulled from rivers, a Guinness record, yet funded event-by-event by CSR sponsors (one campaign, then it's over). Imagine that funded *monthly* by even a fraction of those followers.
- **Road-hole patchers** like *Nanda* (@relawan.jalan.rusak), who filled ~79 potholes over two years out of his own pocket plus follower donations, or *Suted*, a gig driver who patches roads on live-stream. Today they must perform on social media, because that's the only way support (and safety) arrives.
- **Free community kitchens** run with mosques: with recurring donors, the kitchen keeps cooking *every day*, not only when a big sponsor shows up.

**People in a hard moment**
A gig driver whose motorbike was stolen, or who fell ill or died from overwork, leaving a family without income. Someone wronged who can't afford a lawyer. Families of accident victims. One-off cases, verified and told with dignity.

**Organizations & foundations**
Orphanages, animal shelters, elderly homes, cancer/rehab foundations, legal-aid bodies, the ones that need *recurring* donors to keep going.

**Disaster relief**
Fast, large-scale emergency fundraising, the format closest to Stellar Aid Assist's transparent crisis-aid model.

> These movements are cited as **public examples/inspiration, not partners or users
> of Ulurin.**

## Why it's different from Kitabisa / GoFundMe

- The disclosed 0-10% cut is the **organizer's income**, doing good as a job. On
  Kitabisa/GoFundMe the fundraiser usually works unpaid and only the platform earns;
  here the person doing the work gets paid, in the open. Ulurin also takes a **small,
  transparent platform fee**, shown in every donation split, never hidden.
- Trust is **on-chain proof**, not "trust the report."
- Stories are **native** (short video and/or photo: the *Cerita Kebaikan* feed), not
  an ad that bounces you to a web form.

## Why it's big

- Zakat potential in Indonesia is **~Rp 327.6 trillion/year**, with only **~10%**
  formally collected, a market ~90% untapped and barely digitized
  ([Kompas](https://www.kompas.id/artikel/en-potensi-zakat-rp-327-triliun-yang-terkumpul-baru-rp-41-triliun)).
- Total philanthropy potential is estimated at **Rp 650-665 trillion/year** (Bappenas).
- Kitabisa alone has moved **Rp 830 billion across 8 million donors**: proof the
  demand is real; the trust layer is what's missing.

*Full market breakdown, sources, and the zakat + CSR expansion are in [`docs/KONSEP.md`](docs/KONSEP.md).*

## Built on Stellar

- **Soroban smart contract** holds the escrow, enforces the 0-10% cap, and splits
  every donation automatically, logic runs on Stellar, not on our server.
- **Public ledger** = auditable receipts anyone can check without logging in.
- **USDC** settles underneath; the UI stays in rupiah, crypto-invisible.
- Aligns with Stellar's mission of *equitable access to the global financial system*
  and mirrors **Stellar Aid Assist** (instant, transparent, low-cost aid), bringing
  that institutional model down to the grassroots. *Inspired by, not affiliated with.*

## Features

- Discover / marketplace of donation campaigns
- Create a campaign, set the organizer allowance (0-10%, tier-capped)
- Transparent donation split + donor-facing breakdown **before** pledging
- Organizer dashboard
- Public transparency / receipt page (no login)
- Creator KYC tier page
- Optional Supabase-backed pledge storage for the preview
- Soroban smart contract for testnet campaign vaults

## Smart contract

One multi-campaign vault (`contracts/bagibagi-campaign`) with the core mechanics:

- `initialize(admin, token)`, set up the contract with a settlement token
- `set_tier(organizer, tier)`, verification tier caps the allowance:
  - Tier 0 → 0% · Tier 1 → up to 5% · Tier 2 → up to 10%
- `create_campaign(organizer, beneficiary, allowance_bps)`, `allowance_bps` ≤ 1000
  (10%) **and** ≤ the tier ceiling
- `donate(donor, campaign_id, amount)`, split immediately into beneficiary balance
  and organizer-allowance escrow
- beneficiary withdraws their portion
- organizer uploads proof → admin releases the allowance **only after proof exists**

All state transitions emit events for on-chain traceability.

## Build & run

```bash
# Contract tests
cargo test --workspace

# Build optimized WASM
rustup target add wasm32v1-none
stellar contract build --package bagibagi-campaign

# Deploy + initialize on Stellar testnet
chmod +x scripts/deploy-testnet.sh
./scripts/deploy-testnet.sh

# Web app
npm install
npm run dev
```

## Roadmap

- **Now (testnet):** creator-cut donations, escrow + proof-gated split, transparent
  donor breakdown, public receipt page.
- **Next:** native *Cerita Kebaikan* video/photo feed, in-feed one-tap donate with an
  on-chain "verified donor" badge, full Sumsub KYC, creator rating + track record,
  recurring (subscription) donations.
- **Later:** a transparent zakat rail (with registered amil/LAZ), curated CSR/TJSL
  funds, and licensed fiat on/off-ramp via a Stellar anchor (VASP) for real money.

## Honesty notes

- Everything here runs on **testnet**; demo numbers are labelled, never presented as
  traction.
- The organizer cut is **always disclosed and capped at 0-10%**, donors can zero it
  where enabled.
- Sourced figures link to their primary reporting. "Potential" figures are official
  estimates (BAZNAS/Bappenas), not amounts actually collected.
- Ulurin is inspired by Stellar Aid Assist's transparency; it does **not** claim
  affiliation with the SDF, Aid Assist, SDP, UNHCR, or IRC.
