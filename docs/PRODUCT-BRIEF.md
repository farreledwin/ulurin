# Ulurin Product Brief

## Product thesis

Ulurin turns grassroots fundraising from an informal act of trust into a transparent profession.

The market already contains donors, urgent needs, and people willing to organize help. What is missing is a shared system that prices the organizer's work honestly, separates that compensation from beneficiary funds, and lets a donor verify what the system actually did.

Ulurin's central bet is that **fair compensation and accountability reinforce each other**. A creator does not need to hide transport, verification, documentation, or labor costs. A donor does not need to pretend that good work is free.

## Users and jobs to be done

### Kreator Kebaikan

A creator finds and verifies cases, obtains consent, tells the story, coordinates collection and distribution, publishes evidence, and answers to donors.

Their job is not merely “post a video.” Their job is to carry a case from discovery to a documented outcome.

They need to:

- earn transparent compensation without appearing to steal from a beneficiary;
- build reputation beyond follower count;
- manage active and recurring campaigns;
- show donors exactly what happened;
- receive clear guidance when evidence is incomplete or disputed.

### Beneficiary

A beneficiary may be a person, family, community, nonprofit, shelter, care provider, research body, or disaster-response group.

They need to:

- receive urgent funds without waiting for the creator to finish content and reporting;
- understand and consent to how their identity and story will be used;
- confirm receipt or flag a mismatch;
- avoid being reduced to humiliating or sensational content.

### Donor

A donor wants a fast, familiar payment experience and a credible answer to three questions:

1. Where will my money go?
2. Who is being paid to organize this, and why?
3. What evidence will I receive afterward?

Crypto knowledge is not part of this job.

### Reviewer and platform operator

The platform must review identities, campaign claims, proof, disputes, suspicious transactions, privacy risks, and regulatory obligations. A contract can enforce allocation rules; it cannot replace this operating function.

## One truth, two discovery modes

### Cerita Kebaikan feed

The feed is for emotional and immediate discovery. Each vertical story should show the minimum facts needed to act responsibly:

- beneficiary need and location at an appropriate privacy level;
- creator identity and verification tier;
- campaign progress and deadline;
- creator reward percentage;
- persistent Donate action;
- quick access to “Where your money goes.”

Ranking should reward verification quality, clear goals, outcome updates, completion history, and relevance. It should not reward suffering, shock, crying children, or donation velocity alone.

Video is optional. Photo and text campaigns must receive equal functional treatment so that fundraising skill is not confused with camera performance.

### Campaign marketplace

The marketplace is for deliberate comparison and repeat discovery. Useful filters include category, location, urgency, verification tier, funding progress, recurring need, and campaign status.

Feed and marketplace are two views of the same campaign object. Totals, fee percentages, proof status, and creator history must never diverge between them.

## End-to-end campaign flow

### 1. Creator verification

The creator submits identity and operational information. Verification sets the maximum creator reward:

- Tier 0: 0%
- Tier 1: up to 5%
- Tier 2: up to 10%

Tier 0 may demonstrate commitment but cannot take compensation because the platform does not yet have enough evidence to ask donors to finance their work.

### 2. Campaign creation and consent

The creator records:

- beneficiary and consent status;
- need, target, deadline, and distribution plan;
- requested creator reward and its plain-language purpose;
- expected evidence and milestones;
- privacy and safeguarding requirements.

### 3. Review and publication

A reviewer checks identity, consent, duplicate campaigns, prohibited content, plausibility, and risk. Approval publishes one canonical campaign to the feed and marketplace.

### 4. Donation

The donor selects an amount and sees a receipt preview before confirming:

| Line item | Meaning |
|---|---|
| Beneficiary allocation | The portion intended for the stated need. |
| Creator reward | 0–5%, within tier limit, with its stated purpose. |
| Ulurin platform fee | 3%, clearly separated from the other two. |
| Total payment | The exact amount the donor authorizes. |

The product must decide whether the platform fee is added on top or deducted from the entered amount before implementation. The interface cannot obscure that choice.

### 5. Allocation and release

The current product principle is:

- beneficiary allocation becomes available first;
- creator reward stays locked;
- creator uploads the agreed evidence;
- beneficiary acknowledgement and/or reviewer approval resolves the evidence state;
- only then may the creator reward be released.

The platform-fee release rule remains an explicit design decision, not an assumed implementation detail.

### 6. Public receipt

Every campaign should expose a human-readable transparency page with:

- collected, allocated, released, and refundable amounts;
- creator reward and explanation;
- platform fee;
- campaign, contract, network, and asset identifiers;
- links for donation, beneficiary withdrawal, proof fingerprint, creator release, cancellation, and refund events where applicable;
- plain labels such as Pending, Confirmed, Failed, Refunded, or Disputed;
- a permanent explanation of what on-chain evidence cannot prove.

### 7. Outcome and rating

Only donors with a confirmed contribution may rate a campaign. Rating should occur after an outcome or proof event, not immediately after checkout.

One donor gets one rating per campaign. The product should distinguish campaign outcome, communication quality, and proof quality instead of collapsing trust into an unexplained star average.

## Recurring campaign lifecycle

Recurring support is a sequence of accountable campaign cycles, not one campaign that remains open forever.

1. The donor authorizes an amount per month through a familiar IDR payment flow.
2. The authorization screen shows the beneficiary/project allocation, Creator Reward, platform fee, and total for every cycle.
3. An off-chain scheduler initiates each payment; Stellar does not schedule transactions by itself.
4. Each successful payment creates its own allocation and public receipt.
5. The cycle's beneficiary/project allocation follows the campaign release rule, while the Creator Reward remains locked.
6. The creator uploads that cycle's required evidence, such as monthly food invoices, meal counts, shelter veterinary bills, or project milestones.
7. After acknowledgement/review, the Creator Reward for that cycle may be released.
8. The donor receives the outcome and can continue, change, pause, or cancel future support.

The creator profile should show completed, late, disputed, and missed cycles. The team still needs a policy for payment retries, automatic pause after missing proof, unused balances, and what happens when an institution stops delivering the recurring service.

Concrete examples, including Pandawara-type movements, road-repair creators, orphanages, elderly homes, free-meal kitchens, shelters, and one-off cases, are mapped in [Concrete Use Cases](USE-CASES.en.md).

## Creator reputation

A profile should answer “What has this person actually completed?”

Recommended public fields:

- verification tier and date;
- active, completed, cancelled, and disputed campaigns;
- total collected and delivered;
- number of unique verified donors;
- proof completion rate;
- typical time from beneficiary release to proof;
- beneficiary acknowledgement rate;
- ratings and material review notes;
- transparent reward history.

Follower count may provide context but must not determine trust tier.

## Live activity

The activity strip is a confidence and discovery feature, not synthetic social proof.

It may publish only confirmed events and must respect donor choices:

- named donor, masked name, or Anonymous;
- donation amount shown or hidden;
- campaign name and confirmation status;
- distribution, proof, and completion events as well as donations.

Showing successful outcomes prevents the feed from implying that only money-in activity matters.

## Payment and ledger boundary

### Prototype

- Xendit Sandbox represents familiar IDR payment and payout interactions.
- Stellar Testnet represents contract rules and public transaction evidence.
- Test data must be labelled as sandbox/testnet and never presented as traction or real disbursement.

### Production requirements

A production design must identify:

- the licensed entity receiving rupiah;
- custody ownership and wallet recovery responsibilities;
- the VASP/anchor and conversion path if a Stellar asset is used;
- source of truth across Xendit, the application database, and Stellar;
- reconciliation and idempotency rules;
- failed payment, failed payout, refund, and chargeback handling;
- sanctions, AML, fraud, consumer-protection, and reporting obligations.

“Xendit connected to Stellar” is not a sufficient architecture description.

## Trust model

| Claim | Best evidence |
|---|---|
| A transaction happened | Stellar ledger and contract event |
| The configured split was applied | Contract state and event |
| A file existed at a recorded point | Immutable fingerprint plus timestamp |
| A person is the claimed creator | KYC provider and platform review |
| Beneficiary consented | Consent record and safeguarding review |
| Goods or funds reached the beneficiary | Beneficiary acknowledgement plus reviewed evidence |
| The campaign created impact | Outcome verification; not blockchain alone |

The product should never use “verified on-chain” as shorthand for claims the chain did not observe.

## Business model

Ulurin currently proposes two explicit revenue/compensation lines:

1. **Creator reward: 0–5%**, based on verification tier and chosen campaign rate.
2. **Platform fee: 2%**, displayed before authorization.

The creator reward pays for fieldwork and a sustainable livelihood. The platform fee must fund payment operations, verification, moderation, evidence review, disputes, security, infrastructure, and compliance.

The unit economics are not yet proven. Before launch, the team must model payment fees, KYC cost, proof-review labor, fraud loss, refunds, support, taxes, and the cost of regulated partners, especially for small donations.

## Product guardrails

- No fake donors, activity, testimonials, partners, or mainnet claims.
- No campaign can hide creator or platform compensation.
- No fee explanation may use euphemism to conceal personal compensation.
- No child or vulnerable person should be pressured into degrading content.
- No creator reward before the required evidence state is satisfied.
- No rating from an account without a confirmed donation.
- No claim that blockchain proves off-chain truth.
- No crypto vocabulary in the primary donation journey unless required for informed consent.

## What success should mean

Early validation should measure behavior, not vanity:

- donation conversion after the full split is shown;
- donor understanding of the split;
- repeat donation rate;
- creator proof-completion rate and time to proof;
- beneficiary acknowledgement rate;
- dispute and refund rates;
- percentage of creators who return for another completed campaign;
- contribution margin after payment, verification, review, and support costs.

A large total raised with weak proof completion would not validate Ulurin's thesis.
