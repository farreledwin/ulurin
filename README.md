# Ulurin

🌐 **Language:** English (this page) · [Bahasa Indonesia](README.id.md)

**Helping others, made an honest profession.**

Indonesia does not have a generosity problem. It has a trust problem, along with an unpaid-work problem hiding inside the way donations are collected.

Ulurin is a donation platform where the person doing the fieldwork can be paid openly, the donor sees every fee before paying, and the rules are enforced by the money rail rather than promised in a report.

> **Current status (2026-07-16):** the fee rule this document argues for is no
> longer a proposal — it is enforced by a deployed Soroban contract.
>
> **Real today, publicly checkable:**
> - **The vault:** [`CBDQHOGSOMQ6KGROJ47ZBZOEYQP72QL4TVOEHFOZDIP3DIU3IUSAZ2E3`](https://stellar.expert/explorer/testnet/contract/CBDQHOGSOMQ6KGROJ47ZBZOEYQP72QL4TVOEHFOZDIP3DIU3IUSAZ2E3)
>   on Stellar Testnet, settling in Circle's testnet **USDC**. It splits every
>   donation on arrival (beneficiary / creator / platform), refuses to open any
>   campaign whose total financing exceeds **10%** — PP No. 29/1980 Pasal 6(1)
>   — and keeps the creator's reward locked until a proof hash is committed.
>   The full transaction trail is in [DEPLOYMENTS.md](DEPLOYMENTS.md).
> - **The app:** [ulurin.vercel.app](https://ulurin.vercel.app) — the
>   donate flow can settle a real testnet donation through the vault and hand
>   back a receipt whose hash anyone can open on the explorer.
> - **The fee schedule the contract enforces:** 2% platform + creator reward
>   capped by verification tier at 0% / 3% / 5%, so the most expensive possible
>   campaign is 7% — three points under the statutory cap on purpose. See
>   [`/tier`](https://ulurin.vercel.app/tier) for why each rung stops
>   where it does.
> - **The Android build:** the same app, verified reading live vault state from
>   inside the WebView ([apps/ulurin/android-qa.md](apps/ulurin/android-qa.md)).
>
> **Still simulated:** rupiah payments (Xendit is a sandbox simulator, not an
> anchor), ratings, proof review, and the activity feed. Testnet USDC is not
> real money. This is not a production app, a partnership, or a licensed fiat
> service — the boundary between the two lists above is stated in the app
> itself, on every screen it applies to.

## The wound is structural

Two Indonesian scandals show why “just ask charities to be more transparent” is not enough.

### ACT: the money barely left the institution

Boeing entrusted **Rp138,546,388,500** to ACT for social and educational facilities serving communities affected by the deaths of 189 people on Lion Air flight JT610. Only **Rp20,563,857,503** was spent on the agreed programs, and only 6 of 70 planned facilities were built. **Rp117,982,530,997** was diverted, including money routed into internal salaries and bonuses, affiliated entities, a cooperative, and a direct payment to the founder. ([Kompas](https://nasional.kompas.com/read/2022/11/15/14161711/dakwaan-bos-act-pencairan-dana-sosial-boeing-hanya-lewat-whatsapp) · [Vice](https://www.vice.com/en/article/boeing-embezzlement-lion-air-indonesia/))

This was more than an executive stealing from a cashbox. The organization controlled custody, allocation, reporting, and the evidence shown to families. Money could move between entities while appearing to remain inside a legitimate aid operation. The victims' families learned the truth years later because there was no public rail that separated the beneficiary's money from the institution's own interests.

### Cak Budi: a useful car does not solve an undisclosed cut

Cak Budi was a popular grassroots fundraiser before he became a scandal. His Toyota Fortuner and iPhone may genuinely have helped him travel, document cases, and coordinate aid. That is no longer the decisive question. ([Detik](https://news.detik.com/berita/d-3488851/heboh-pengakuan-cak-budi-pakai-uang-donasi-untuk-beli-fortuner))

The structural failure was that donors were never asked to approve a defined share for his work. He could not point to an immutable rule saying: *this percentage is for the beneficiary, this percentage pays for my transport and labor, and I cannot take more*. A possibly legitimate expense became indistinguishable from misuse because the system provided no honest way to price the organizer's work.

## The law is not missing. The enforcement is.

Indonesia has regulated public fundraising for decades:

- [**Law No. 9 of 1961**](https://peraturan.bpk.go.id/Details/51166/uu-no-9-tahun-1961) establishes the permission and oversight framework for collecting money or goods from the public.
- [**Government Regulation No. 29 of 1980, Article 6(1)**](https://peraturan.bpk.go.id/Download/56955/PP%20NO%2029%20TH%201980.pdf) limits fundraising costs to at most 10% of donations collected.

Ulurin is not proposing another rulebook. It is proposing a rail where an organizer reward above the permitted and verification-based ceiling is rejected before money moves.

That distinction matters: an audit can discover a broken rule years later; an enforceable transaction rule can prevent it now.

## This is a business problem, not only a moral one

The current market leaves four participants worse off:

| Participant | What is broken today |
|---|---|
| Donor | Sees an emotional story and a total raised, but rarely an enforceable split or public receipt. |
| Beneficiary | Depends on an intermediary whose operating money may be mixed with aid funds. |
| Organizer | Finds cases, verifies them, travels, coordinates distribution, creates updates, and handles reporting, often for no disclosed pay. |
| Giving platform | Earns a fee while trust damage pushes donors away from formal institutions and toward fragmented personal channels. |

After the ACT scandal, a Median poll of 1,500 Indonesians found that **44.7% no longer trusted institutions like ACT**, while only **30.1% still did**. ([Detik](https://news.detik.com/berita/d-6210306/survei-median-pakai-gform-44-7-responden-tak-percaya-lembaga-serupa-act)) BAZNAS also saw qurban collection sit around **47% of target** at a point when roughly 80% was normal. Its deputy said the willingness to give would survive while donors moved toward personal channels. ([JPNN](https://www.jpnn.com/news/buntut-kasus-act-baznas-prediksi-jumlah-donasi-masyarakat-berkurang))

The economic opening is therefore not “convince Indonesians to become generous.” They already are. It is to make individual-led giving accountable and sustainable enough to deserve that trust.

## The future Ulurin is building

**Doing good as a primary job.**

Today, helping people is usually squeezed in after work, funded from personal savings, or kept alive by the next sponsor. The people best at it burn out. Movements with millions of followers can still stop when one sponsor walks away.

Ulurin is not trying to create more campaign pages. It is building a **labor market for public good**, where a person can earn a living by repeatedly completing help that donors can inspect.

> Not one Pandawara, but thousands of trusted local movements.
>
> Not one road repaired when a video goes viral, but repairs that can continue every month.
>
> Not a free kitchen waiting for one large donor, but one that can plan tomorrow's meals today.
>
> Not a volunteer who burns out after doing everything right, but a professional whose income grows with a proven record of helping.

**The flywheel:** honest pay keeps good helpers in the work. Helpers who can stay complete more outcomes. Completed outcomes create evidence. Evidence builds trust. Trust drives repeat giving. Repeat giving gives more people the chance to make helping their life's work.

`Honest pay -> sustained helpers -> completed outcomes -> visible proof -> stronger trust -> repeat giving -> more people paid to help`

This is the domino effect Ulurin exists to create. A Creator earns more because their record of completed help becomes stronger, not because the suffering in their content becomes more dramatic.

## What Ulurin changes

Ulurin combines two familiar ways to discover a campaign, both backed by the same campaign record:

1. **Cerita Kebaikan feed:** a vertical video/photo experience for discovering a real story and donating from the same screen.
2. **Campaign marketplace:** searchable and filterable pages for donors who prefer to compare causes, goals, locations, creators, and progress.

Before a donor confirms, Ulurin shows:

- the amount intended for the beneficiary;
- the creator's disclosed reward, capped from **0% to 5%** by verification tier;
- a plain-language explanation of what that reward covers, such as verification, transport, coordination, documentation, and fair compensation for the work;
- the **2% Ulurin platform fee**, shown as its own line rather than buried in the campaign amount;
- when each portion can be released.

The donor does not need to understand wallets, tokens, or smart contracts. They need to understand rupiah, who receives it, and why.

## One campaign, from story to proof

1. A **Kreator Kebaikan** verifies their identity and builds a campaign around a specific beneficiary and need.
2. The creator chooses a reward within their verification-tier ceiling and explains it in ordinary language.
3. After campaign review, the story appears in both the feed and marketplace.
4. A donor chooses an amount, sees the complete split, and pays through a familiar rupiah flow.
5. The beneficiary's allocation is not held hostage by the creator's paperwork. The intended product principle is **beneficiary first**.
6. The creator's reward remains locked until distribution evidence is uploaded and reviewed.
7. The campaign publishes a receipt containing the split, relevant Stellar transaction links, proof fingerprint, and current release status.
8. A donor who actually contributed can rate the campaign outcome and, when necessary, raise a dispute.

This ordering protects both sides: urgent aid can arrive without waiting for content production, while the creator cannot collect their reward and disappear before documenting the result.

## Trust should accumulate

Every creator profile is designed to show a track record, not just follower count:

- identity-verification tier and reward ceiling;
- active, completed, and cancelled campaigns;
- total raised and total delivered;
- proof and beneficiary-confirmation history;
- completion rate and typical time to publish proof;
- ratings from verified donors;
- unresolved disputes or material corrections.

A live activity strip can show confirmed events such as a donation or completed distribution. Donors may remain anonymous, and the production product must never invent activity to make the platform look busy.

## Concrete use cases: who would use Ulurin?

### Pandawara Group: turn a following into recurring fieldwork

[Pandawara Group](https://www.tiktok.com/@pandawaragroup) is a five-person environmental movement from Bandung that became known by publishing river and beach clean-ups. Guinness recorded **12,137,832 TikTok followers** on 29 March 2026, the largest following for an environmental clean-up group. ([Guinness World Records](https://www.guinnessworldrecords.com/world-records/782570-most-followers-on-tiktok-for-an-environmental-clean-up-group)) Forbes lists the group in **30 Under 30 Asia 2025** and reports more than **1.3 million kilograms of waste removed**, based on the group's own figures. ([Forbes](https://www.forbes.com/profile/pandawara-group/))

Their work needs trucks, fuel, protective equipment, tools, waste bags, transport, and people on the ground. Public profiles describe a journey from personal funding to donations and event-by-event CSR sponsorship. ([Waste4Change](https://waste4change.com/blog/pandawara-group-pemuda-inspiratif-penggiat-bebersih-sungai/)) That can fund an event; it does not automatically create predictable monthly operations.

**How Ulurin fits:** followers can support a recurring “four clean-ups this month” campaign. The movement's project wallet receives the operating allocation; the disclosed Creator Reward remains separate; donors receive monthly invoices, location updates, waste-result documentation, and public transaction receipts. The movement converts trust already earned through work into recurring income without hiding who gets paid.

### Road-repair creators: replace livestream gifts with accountable campaigns

- [Nanda / @relawan.jalan.rusak](https://www.tiktok.com/@relawan.jalan.rusak) documented patching roughly **79 potholes over two years** in Riau. One video passed 800,000 views; reporting says the work used his own money and follower support. ([Catatan Riau](https://catatanriau.com/news/detail/28114/viral-relawan-jalan-rusak-di-pekanbaru-ditegur-rw-saat-tambal-jalan))
- [Suted / @suted.sukarno](https://www.tiktok.com/@suted.sukarno), an online motorcycle-taxi driver in Demak, repairs dangerous roads with his Maleng Gank community. Viewers who encountered the livestream began contributing to the work. ([Jateng News](https://www.jatengnews.id/2026/02/25/ojol-demak-tambal-jalan-berlubang-dini-hari-tuai-simpati-warganet/))

**How Ulurin fits:** one campaign defines the road segment, material budget, safety equipment, target completion, and Creator Reward before anyone donates. After the work, donors see material receipts, before/after evidence, location, and the creator's completion history. Support no longer depends on whether a livestream happens to go viral that night.

### Recurring care: needs that return every month

| Recurring beneficiary | What donations keep running | What donors should receive each cycle |
|---|---|---|
| Orphanage / children's home | Meals, school fees and supplies, health, hygiene, utilities, and caregivers | Monthly expense summary, redacted invoices, activity update, and acknowledgement from the institution |
| Elderly home | Food, medicine, adult-care supplies, check-ups, transport, utilities, and carers | Purchase evidence, service log, institution confirmation, and issues requiring follow-up |
| Free-lunch kitchen | Ingredients, cooking gas, packaging, kitchen transport, equipment, and daily operations | Meals produced, distribution dates, ingredient invoices, safe documentation, and unused balance |
| Animal shelter | Feed, veterinary treatment, sterilization, medicine, rent, and rescue transport | Vet invoices, animal-level outcome updates, shelter confirmation, and current occupancy |
| Patient house / rehabilitation centre | Temporary housing, meals, transport to treatment, therapy, medicine, and staff | Monthly occupancy, service evidence, redacted medical documentation, and expense report |
| Legal aid / independent research | Case intake, filing, transport, professional hours, data collection, and publication | Milestone report, redacted case or research evidence, spending proof, and deliverables |

Public programs already show that these are repeating needs: [Panti Asuhan Indonesia](https://pantiasuhan.or.id/) groups food and education campaigns; a [Dompet Dhuafa campaign](https://digital.dompetdhuafa.org/donasi/lansiapantijompo) documents food support for 30 elderly residents; and [Rumah Cinta Qur'an's free-meal program](https://rumahcintaquran.or.id/rumah-makan-gratis/) serves people who need a meal. Ulurin's role is to make each month a transparent funding-and-proof cycle instead of forcing the institution to start from zero every time.

### One-off and emergency cases

Ulurin also supports finite campaigns: surgery or medicine, a gig driver's stolen motorbike, income support for a bereaved family, legal costs for someone wronged, disaster response, or urgent rescue and veterinary care. A finite campaign has a defined target, deadline, recipient, completion condition, and close-out report.

These people and movements are public examples used to ground the product category. They are **not claimed Ulurin partners or users**. See the [complete use-case map](docs/USE-CASES.en.md).

## Why Stellar is underneath

Stellar is the accountability layer, not the product's personality.

- A **Soroban contract** can hold campaign funds, enforce creator-reward ceilings, separate allocations, and gate release conditions.
- The **public ledger** can make in-contract donations and disbursements independently verifiable.
- Fast, low-cost settlement makes small donations economically plausible.
- A public receipt can link a human-readable campaign to transaction evidence without requiring the donor to create a self-custody wallet.

The normal interface stays in rupiah and familiar language. Transaction hashes belong in an expandable transparency section, not in the emotional center of the experience.

## Honest boundary: Xendit is not a Stellar anchor

The planned prototype uses **Xendit Sandbox** to exercise familiar payment and payout flows. That does not turn Xendit into a licensed Stellar anchor, does not automatically convert IDR to USDC, and does not make a testnet demo a real-money system.

A production launch still requires a compliant custody model, licensed fiat/crypto partners where applicable, asset conversion and reconciliation, consumer protection, and clear responsibility for failed or disputed transfers.

## What the ledger can and cannot prove

On-chain evidence can prove that a particular account sent a particular asset, that a contract applied a split, and that a release happened at a recorded time.

It cannot by itself prove that a beneficiary is who the campaign says they are, that an uploaded invoice is genuine, that medicine was delivered, or that a program created the promised impact. Those claims still require identity checks, evidence review, beneficiary acknowledgement, moderation, and dispute handling.

Ulurin should state this boundary beside every public receipt. Trust grows when the product is precise about what its evidence means.

## Mission: how Ulurin gets there

1. Give grassroots organizers an honest path to earn from verified work.
2. Give donors informed consent before payment and durable evidence afterward.
3. Protect beneficiary dignity, urgency, and control over how their story is told.
4. Turn Indonesia's existing fundraising limits into transaction constraints that are difficult to bypass.
5. Build a portable reputation for people who repeatedly deliver public good.

## Product documents

- **Live app:** [ulurin.vercel.app](https://ulurin.vercel.app)
- **Contract source and tests:** [`contracts/ulurin-vault`](contracts/ulurin-vault) — 18 Rust tests over the money path, the cap, and the tier ladder
- **Deployment trail:** [DEPLOYMENTS.md](DEPLOYMENTS.md) — every claim above as a checkable transaction hash
- **Runnable local prototype:** [`apps/ulurin`](apps/ulurin)
- **Business concept:** [Bahasa Indonesia](docs/KONSEP.md) · [English](docs/KONSEP.en.md)
- **Concrete use cases:** [Bahasa Indonesia](docs/USE-CASES.md) · [English](docs/USE-CASES.en.md)
- [Submitted APAC Stellar Hackathon deck](docs/pitch/Ulurin-APAC-Stellar-Hackathon.pdf): the frozen eight-slide PDF submitted to the hackathon.
- [Product brief](docs/PRODUCT-BRIEF.md): users, surfaces, end-to-end flow, trust model, and success criteria.
- [Decisions and open questions](docs/DECISIONS.md): what this version has decided and what must be resolved before implementation.

## Sources and context

- [Public Ulurin hackathon repository](https://github.com/farreledwin/ulurin): previous testnet implementation and narrative.
- [BPK legal database: Law No. 9 of 1961](https://peraturan.bpk.go.id/Details/51166/uu-no-9-tahun-1961)
- [BPK legal database: Government Regulation No. 29 of 1980](https://peraturan.bpk.go.id/Download/56955/PP%20NO%2029%20TH%201980.pdf)
- [Kompas: ACT Boeing-fund indictment](https://nasional.kompas.com/read/2022/11/15/14161711/dakwaan-bos-act-pencairan-dana-sosial-boeing-hanya-lewat-whatsapp)
- [Vice: ACT conviction and 6 of 70 projects](https://www.vice.com/en/article/boeing-embezzlement-lion-air-indonesia/)
- [Detik: Cak Budi donation controversy](https://news.detik.com/berita/d-3488851/heboh-pengakuan-cak-budi-pakai-uang-donasi-untuk-beli-fortuner)
- [Detik: Median post-ACT trust poll](https://news.detik.com/berita/d-6210306/survei-median-pakai-gform-44-7-responden-tak-percaya-lembaga-serupa-act)
- [JPNN: BAZNAS on trust shifting from institutions to individuals](https://www.jpnn.com/news/buntut-kasus-act-baznas-prediksi-jumlah-donasi-masyarakat-berkurang)
- [Kompas: ACT permit revocation and donation rules](https://nasional.kompas.com/read/2022/07/06/13183861/izin-act-dicabut-karena-dugaan-penyelewengan-dana-bagaimana-aturan-donasi-di)
- [The Jakarta Post: ACT investigation](https://www.thejakartapost.com/indonesia/2022/08/05/more-than-half-of-act-donations-went-into-execs-pockets-investigators-say.html)
- [Kompas: Indonesia's zakat potential and formal collection gap](https://www.kompas.id/artikel/en-potensi-zakat-rp-327-triliun-yang-terkumpul-baru-rp-41-triliun)

---

Ulurin means *ulurkan tangan*, or to reach out a hand. The product promise is simple: the help should arrive, the work behind it can be paid fairly, and nobody should have to guess where the money went.
