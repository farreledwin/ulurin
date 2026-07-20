# Product Decisions and Open Questions

This document prevents the next build from silently inheriting contradictions from earlier decks, forms, prototypes, or repositories.

## Confirmed direction for UlurinTest

### Product and audience

- Ulurin is a mainstream rupiah donation product; blockchain remains infrastructure.
- The product serves organizers, beneficiaries, and donors, with reviewers as an explicit operational role.
- Discovery has two equal surfaces: a TikTok-like Cerita Kebaikan feed and a Kitabisa/GoFundMe-like marketplace.
- Video is optional. Photo and text campaigns are first-class.

### Compensation

- Creator compensation is legitimate work income, not a hidden deduction.
- The creator reward is selected per campaign, disclosed before donation, and
  capped by tier at **0%, 3%, or 5%** *(decided 2026-07-16 — supersedes the
  earlier 0/5/10 ladder; enforced on chain by `ceiling_for(tier)` in the
  deployed vault, not only in the UI)*.
- Tier 0 cannot receive a creator reward.
- The creator must explain transport, verification, coordination, documentation, operations, and personal compensation in plain language.
- The platform fee is **3%** *(decided 2026-07-16 — supersedes the 5%
  direction, which itself replaced the 2% in the earlier public prototype)*.
  The reasoning: at 5%, the top of the tier ladder lands exactly on PP No.
  29/1980's 10% cap with zero headroom, so any cost a regulator counts that we
  did not — a payment-gateway charge, say — puts a tier-2 campaign over. At 3%
  the most expensive possible campaign is 8%, the binding limit is the tier
  rather than the law, and rejection errors tell creators something actionable
  (`TierTooLow`) instead of something terminal (`TotalFinancingExceeded`). It
  is one constructor argument on the vault; revisit it as a treasury decision,
  not a code change.

### Release order

- The beneficiary's allocation should not wait for the creator to finish proof.
- The creator reward stays locked until the required evidence is uploaded and reviewed.
- Public receipts expose the configured split and every relevant confirmed release event.

### Reputation and evidence

- Creator profiles show campaign history, proof performance, ratings, and disputes.
- Only confirmed donors may rate, once per campaign, after an outcome/proof event.
- Live activity uses confirmed events only and supports donor anonymity.
- The product always distinguishes on-chain transaction evidence from off-chain identity, invoice, delivery, and impact evidence.

### Prototype honesty

- Xendit Sandbox is a payment/payout simulator, not a Stellar anchor.
- Stellar Testnet events are not real-money traction.
- Public examples such as Pandawara are inspirations unless a real partnership is documented.

## Must be decided before implementation

### 1. What does the platform fee apply to? — **decided 2026-07-16**

**Deducted from the donor-entered total, never added on top.** The deployed
vault settles it this way: a donation splits on arrival into beneficiary /
creator / platform, the three shares re-sum to the donation exactly, and the
beneficiary takes the rounding residual so truncation never favours the
platform. The on-top structure was rejected on the legality research: it bets
the product on an undefined word ("hasil") that no Indonesian authority has
ever construed, and its fallback arithmetic still breaches the cap. The only
on-top charge ever permitted is a genuine payment-gateway pass-through at
cost, with zero margin, never entering the fee percentages.

Still open within this decision: whether payment-provider charges count toward
the statutory 10% alongside our fees. No public authority addresses it. The 2
points of headroom in the schedule (3% platform + 5% top-tier creator = 8%)
exist precisely because this is
unresolved — ask counsel this question specifically.

### 2. How does the statutory 10% ceiling interact with both fees? — **adopted the conservative reading 2026-07-16**

The vault enforces `creator_bps + platform_bps <= 1000` as a single total —
the aggregate interpretation of PP No. 29/1980 Pasal 6(1) — so an over-cap
campaign cannot be created regardless of how the question is ultimately
settled. Textually strong, formally untested; no Kemensos statement, court
decision, or scholarship addresses aggregation across parties. Enforcing the
strict reading costs nothing while the question is open and is the safer
posture in every scenario. The original legal question below remains worth
putting to counsel:

The team needs Indonesian legal advice on whether the organizer reward, Ulurin fee, payment costs, and other collection expenses are counted together for PP No. 29/1980 Article 6(1). A contract that caps only the organizer at 10% may still permit an overall structure that exceeds the legal limit.

### 3. When may the platform fee be released?

Possible timings include payment confirmation, beneficiary withdrawal, proof approval, or proportional milestone release. Each creates different incentives and refund exposure.

### 4. What exactly unlocks creator compensation?

Define:

- required evidence by campaign category;
- whether beneficiary acknowledgement is mandatory;
- who reviews the evidence;
- review service levels;
- rejection and resubmission;
- dispute, appeal, timeout, and emergency paths;
- protection against forged invoices and recycled media.

A proof hash only proves file integrity, not truth.

### 5. How can refunds coexist with beneficiary-first release?

Once a beneficiary has withdrawn funds, those funds cannot be guaranteed refundable. Cancellation, partial funding, unmet goals, fraud discovery, chargebacks, and unused balances require a precise state machine and donor-facing promise.

### 6. Is fundraising all-or-nothing, keep-what-you-raise, or milestone based?

The choice affects urgency, refunds, evidence, status transitions, and contract custody. Different campaign categories may need different policies, but that complexity should be deliberate.

### 7. What is the real verification model?

Resolve whether Tier 0 can publish publicly, whether all creators need KYC before campaign creation, what additional evidence distinguishes Tier 1 from Tier 2, and whether verification expires.

### 8. Who is legally permitted to fundraise and hold the money?

The product needs a position on UU No. 9/1961 permissions, social-ministry rules, personal versus institutional campaigns, zakat/amil licensing, tax, AML, privacy, and consumer protection. A smart contract does not grant a fundraising license.

### 9. Who controls wallets and recovery?

“Google login with a server-provisioned wallet” is custodial or semi-custodial unless the design proves otherwise. Document key ownership, authorization, recovery, transaction signing, admin powers, compromise response, and what happens if Ulurin disappears.

### 10. What is the production settlement path?

Identify the licensed IDR collection/payout providers, asset conversion, VASP/anchor, source of truth, prefunding, settlement delay, reconciliation, and responsibility for failed transfers. Sandbox APIs cannot answer this.

### 11. What privacy and dignity rules are enforceable?

Define consent withdrawal, minors, medical information, exact location, document redaction, face blurring, media retention, donor privacy, and what remains public or immutable after a campaign ends.

### 12. How will ratings resist manipulation?

Decide weighting, minimum sample display, sybil resistance, edited reviews, campaign-versus-creator scoring, dispute effects, and the right of reply. A star average alone can create false certainty.

### 13. Can the 3% platform fee sustain the operation?

*(Restated 2026-07-16 when the fee moved from 5% to 3% — the question gets harder, not easier, and stays open.)*

Model real costs for payment processing, payout, KYC, moderation, manual proof review, fraud, refunds, customer support, blockchain operations, compliance, and tax at Rp10,000, Rp50,000, and larger donation sizes.

### 14. What is the state machine for recurring campaigns?

Define donor authorization, scheduler ownership, payment retry, grace periods, cycle-specific proof, Creator Reward release per cycle, automatic pause, cancellation, price/fee changes, unused balance, and what happens when the institution fails to deliver the next month's service.

A recurring campaign cannot be implemented as an ordinary campaign with no end date. Every billing cycle creates a new financial and evidence obligation.

## Historical claims that must not be copied blindly

### Atomic 93% / 5% / 2% release

The APAC submission described a single proof-gated transaction paying beneficiary, organizer, and platform at once. The later product reasoning instead prioritizes beneficiary access before creator proof; the fee direction moved to 5% and then, with the deployed vault, to the decided 3%.

These are materially different systems. UlurinTest currently treats **beneficiary first, creator last** as the product principle, but the exact state machine still needs approval.

### “Every rupiah is traceable”

This is only defensible for value movements that actually occur on the observable ledger and remain correctly linked to fiat events. Cash purchases, off-chain payouts, false identities, and forged evidence are not made true by a transaction hash.

### “No human custodian”

This conflicts with server-provisioned wallets, admin review, fiat collection, and payout operations unless authority and custody are explicitly designed. The final system should state who can move which funds under which conditions.

### Donor-selected zero creator reward

Earlier narrative suggested donors could zero the creator reward, while the contract treated it as a campaign-level setting. Changing the reward per donor complicates accounting, creator expectations, receipts, and contract logic. The next version should choose one model; the current direction is campaign-level disclosure.

## Definition of ready to build

Implementation should begin only after the team has approved:

1. one authoritative fee formula with worked rupiah examples;
2. campaign and payment state machines, including failure and refund paths;
3. proof, review, dispute, and rating policies;
4. KYC tiers and fundraising eligibility;
5. custody, signing, settlement, and reconciliation architecture;
6. privacy and beneficiary-consent requirements;
7. legal review of fundraising and fee treatment;
8. measurable MVP hypotheses and success thresholds.

Without these decisions, code would make product policy accidentally, and the most important contradictions would become expensive to reverse.
