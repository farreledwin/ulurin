# Ulurin: Concept & Stellar Alignment

🌐 **Language:** English (this document) · [Bahasa Indonesia](KONSEP.md)

> Product concept document. Status: concept + testnet MVP.
> Honesty rules held throughout: demo/testnet figures are labelled, no fictional
> metrics, no "first in the world" claim, and no claim of affiliation with
> Stellar/SDF/Stellar Aid Assist.

> This is a full English translation of the Indonesian concept doc. Market figures,
> cases, and cultural context (zakat, the Cak Budi and ACT scandals, grassroots
> movements) are Indonesia-specific; the Indonesian original is the source of truth.

---

## 1. Summary

**One sentence:** a platform where helping others becomes an honest profession.
A *Kreator Kebaikan* (Good-Deed Creator) surfaces a real case through a story (video
and/or photo), channels the aid, and earns a transparent, capped reward (0-10%),
while every rupiah is provable on-chain.

**Tagline:** *"Doing good, made a job."*

**Elevator (for investors/judges):** Kitabisa and its peers have already proven that
people will donate online, but the fundraiser works for free / goes unrecognized and
trust is off-chain (you trust the report). Ulurin professionalizes the fundraiser
role with a transparent, capped reward, makes it native storytelling (video/photo),
and proves every rupiah through Stellar. We take the transparent-aid model that
Stellar Aid Assist proved at the institutional level and bring it down to the
grassroots: an everyday donor to a real beneficiary.

## 2. Vision & Mission

**Vision:** a future where doing good can be a primary job. Anyone can make a living
by helping others, and every good deed can be proven, not merely trusted.

**Mission:**
1. Professionalize helping: a stage + transparent income for the Kreator Kebaikan.
2. Donate without friction or doubt: moved by a story, help on the same screen, get proof instantly.
3. Protect the beneficiary's dignity: told as a person with a plan, not an object of pity.
4. Prove every rupiah arrives: escrow + public receipts, closing the trust wound of Cak Budi and ACT.

**Terminology (important, three layers, not interchangeable):**
- **Philanthropreneur** = the movement/vision + the category Ulurin is building: a world where doing good is a sustainable profession. This is the company + ecosystem positioning (Ulurin = a philanthropreneur company).
- **Kreator Kebaikan** = the person's role inside the app (who surfaces, verifies, tells the story, distributes). A Kreator Kebaikan is a philanthropreneur in practice.
- So: our vision drives a **philanthropreneur movement**; what a person "becomes" in the app is a **Kreator Kebaikan**; Ulurin is a **philanthropreneur platform**.

### The root problem Ulurin solves (real, sourced cases)

Mission #4 ("closing the wound of Cak Budi and ACT") is rooted in two real cases that
prove: **the problem was never "being paid to do good", it was "hidden and
uncapped".** That is what Ulurin solves.

**Cak Budi (2017), individual scale.** A well-known social-media fundraiser collected
**~Rp 1.2 billion**, then spent it on a **Toyota Fortuner + an iPhone 7**. He admitted
it, sold the car, and transferred the proceeds to ACT. Not a criminal, but **there
was no honest path**: no up-front disclosure of what share was his.
([Detik, 2017](https://news.detik.com/berita/d-3488851/heboh-pengakuan-cak-budi-pakai-uang-donasi-untuk-beli-fortuner))

**ACT (2022), institutional scale.**
- Of **Rp 138.5 billion** in Boeing (Community Investment Fund) money for the families of the **Lion Air JT610** crash victims (Boeing 737 MAX, crashed 2018, 189 dead), only **Rp 20.5 billion** was actually used as intended (6 of 70 programs). ACT executives were sentenced to 3-3.5 years (2023). ([VOI](https://voi.id/en/news/247120) · [BenarNews](https://www.benarnews.org/english/news/indonesian/indonesia-embezzlement-01242023130425.html))
- More broadly, the financial-intelligence agency (PPATK) found **more than 50% of Rp 1.7 trillion (US$113.9 million)** in donations flowed to entities affiliated with executives; ACT skimmed **13.7%** (above the legal **10%** foundation cap); its public-fundraising permit was revoked by the Social Affairs Ministry (Jul 2022). ([The Jakarta Post](https://www.thejakartapost.com/indonesia/2022/08/05/more-than-half-of-act-donations-went-into-execs-pockets-investigators-say.html) · [Kompas](https://nasional.kompas.com/read/2022/07/06/13183861/izin-act-dicabut-karena-dugaan-penyelewengan-dana-bagaimana-aturan-donasi-di))

**The common thread (what Ulurin answers):** both are about a **cut that was hidden,
uncapped, unproven.** Ulurin answers exactly that: the cut is **disclosed up front +
capped 0-10% + contract-enforced**, funds are held in **escrow**, and the **money
flow is recorded on-chain**. This is what "closing the wound of Cak Budi and ACT" means.

## 3. Core concept (and how it differs from Kitabisa)

Kitabisa and its peers: ads on IG/TikTok Reels, then a CTA to a website; fundraisers
are often unpaid volunteers; trust is off-chain. **Ulurin adds three things:**

- **A native-story segment** (the **Cerita Kebaikan feed = video and/or photo**, not just an ad thrown to a web form). Both video and photo are allowed; the creator picks the format that fits the case.
- **The Kreator Kebaikan is paid transparently** (0-10%, contract-enforced): helping becomes a profession.
- **On-chain proof** (donations + distributions recorded, checkable by anyone without logging in).

MVP focus = this ONE function (creator-cut donations + video/photo story + proof).
Later features (recurring donations, zakat, CSR curation) are held back so the focus
and the MVP scope stay realistic.

**Who can be helped (two beneficiary types):**
- **Individuals / cases** (one-off): free surgery, accidents, medicine, abandoned elderly, sick/abandoned animals (not only pets), **legal-aid costs for the poor / the wronged** (e.g. a victim who cannot afford a lawyer), **informal workers who lost their livelihood** (e.g. a gig driver whose motorbike was stolen, who died from overwork, or who fell ill and can no longer work, leaving the family without income), etc.
- **Organizations / foundations** (needing recurring donors): orphanages, animal shelters, elderly homes, cancer foundations, rehab foundations, anti-sexual-violence movements (e.g. funding professional psychologists/psychiatrists), legal-aid bodies (LBH), and other social institutions.
- **Natural disasters** (emergency campaigns): floods, earthquakes, eruptions, etc., fast large-scale fundraising. This is the format that **fits Stellar Aid Assist best** (fast + transparent crisis aid).

The point: a beneficiary can be an individual OR an organization, and the aid model
can be **one-off** or **recurring**. Technical note: recurring donations need an
off-chain scheduler (Stellar has no native scheduler) that submits scheduled on-chain
payments, so this is a fast-follow feature, not a day-1 MVP requirement. The
verification + escrow + on-chain-proof principle stays the same for both.

## 3.1 Market size (evidence: why this is a big business)

Sourced research, accessed 2026-07-11. "Potential" figures are labelled as official estimates.

| Figure | Amount | Year | Source |
|---|---|---|---|
| National ZIS collected (formal, BAZNAS + LAZ) | **Rp 40.5 trillion** (+25% YoY) | 2024 | [BAZNAS LPZ 2024](https://baznas.go.id/assets/images/szn/LPZ%20Nasional%20Akhir%20Tahun%202024.pdf) |
| **National zakat potential** (estimate) | **Rp 327.6 trillion/yr**, only ~10% tapped | 2023-24 | [Kemenag](https://kemenag.go.id/nasional/potensi-mencapai-327-t-ini-tiga-fokus-kemenag-dalam-pengembangan-zakat-LobJF) · [Kompas](https://www.kompas.id/artikel/en-potensi-zakat-rp-327-triliun-yang-terkumpul-baru-rp-41-triliun) |
| **Total ID philanthropy potential** (Bappenas estimate) | **Rp 650-665 trillion/yr** | 2025 | [CNBC Indonesia](https://www.cnbcindonesia.com/news/20250804121649-4-654804/bappenas-potensi-filantropi-ri-capai-rp-6655-triliun-per-tahun) |
| Actual ZISWAF giving (survey, incl. informal) | **~Rp 343 trillion/yr** | 2026 | [PUSKAS/STF UIN Jakarta](https://www.stfuinjakarta.org/2026/06/07/press-release-survei-nasional-ziswaf-2026-angka-ziswaf-nasional-mencapai-rp343-triliun/) |
| Kitabisa.com (disbursed) | **Rp 830 billion · 8 million donors** | 2024 | [Kitabisa](https://kitabisa.com/about-us) |
| ACT before the scandal | **Rp 519 billion** (2020); **~Rp 2 trillion** cumulative; **Rp 450 billion skimmed** (police finding) | 2020/2022 | [Tempo](https://www.tempo.co/politik/aksi-cepat-tanggap-himpun-dana-ratusan-miliar-ini-detailnya-328957) · [Antara/Polri](https://www.antaranews.com/berita/3027249/polri-temukan-fakta-act-potong-donasi-masyarakat-rp450-miliar) |
| Indonesia = **most generous country in the world, 7 years running** (90% donate) | context | 2024 (CAF) | [CAF World Giving Index](https://www.cafonline.org/home/about-us/press-office/indonesia-retains-top-place-in-world-giving-index-with-ukraine-climbing-to-second-most-generous-country) |

**Wow-pairing for the pitch:** zakat potential **Rp 327T** vs only **~Rp 40T** tapped
= **~90% of the market untouched**, and the formal channel is growing 25-44%/year. Of
the ~Rp 343T actually given, **~88% is still outside the formal rails** and barely digital.

**Why "philanthropreneur" is real (not a fantasy), the convergence of 2 facts:**
- Fundraisers **work for free today** (volunteers, 0% cut; e.g. berbuatbaik.id "100% of funds disbursed"). The people doing the collecting get nothing.
- But people **have already proven they will pay creators directly**: Trakteer has **500k+ creators, 4 million supporters**; Saweria is estimated at **Rp 700 million-1 billion/month** ([teknologi.id](https://teknologi.id/business/trakteer-dan-saweria-platform-crowdfunding-terlaris-untuk-support-content-creator)).
- Ulurin = the meeting of the two: **proven donor demand + proven willingness to pay creators + unpaid fundraiser labor.** That gap is what the philanthropreneur model professionalizes.

**The "why blockchain" hook:** ACT, a **Rp 2 trillion** platform that **skimmed Rp 450
billion of the public's money** (police finding). A concrete trust wound answered
directly by transparent on-chain custody.

**Honest note:** "potential" = official estimate (BAZNAS/Bappenas), not what was
actually collected. Rumah Zakat is not cited with a figure (the data sits behind a
PDF, unverified). Trakteer/Saweria are platform/secondary figures.

## 3.2 Next phase: zakat (target market + why it needs to exist)

General donations (video/photo story + creator cut) are the MVP. **Zakat is the
natural expansion** once the rails and the trust are proven.

**Why zakat fits the Ulurin model perfectly:**
- Zakat is an **obligation** (a pillar of Islam), so it is a **recurring + cultural** flow that is massive and repeats every year, with a big spike during Ramadan. Not an occasional voluntary donation.
- **Potential Rp 327.6 trillion/year, only ~10% (~Rp 40T) formally tapped** ([Kompas](https://www.kompas.id/artikel/en-potensi-zakat-rp-327-triliun-yang-terkumpul-baru-rp-41-triliun)), so ~90% is still given directly/informally with no trace. A giant market unserved by transparent technology.
- The **amil** (zakat collector + distributor) is entitled to a share of up to **12.5%** (DSN-MUI). That is **exactly** the "transparently paid + capped Kreator Kebaikan" model. Zakat actually demands the contract-enforced cap + transparency.
- **Digital zakat is growing:** BAZNAS targets **30% of zakat via digital**; digitalization can raise collection efficiency by up to **45%** (academic study).

**Zakat target market:**
- 200 million+ Indonesian Muslims. Scope: zakat maal, zakat fitrah, infak, sedekah, waqf.
- High frequency + recurring (annual + Ramadan spike), across classes, already a habit.
- **Amil/institutions** (LAZ, mosques, communities) as verified Creators who distribute transparently.

**Why it needs to exist going forward:** trust in formal zakat institutions is eroding
(the ACT case skimmed Rp 450 billion), while most people give zakat directly/informally
with no proof. Ulurin can be the **zakat rail that proves every rupiah arrives + gives
the amil a lawful, transparent, capped reward.** Closing the trust gap and the
digitalization gap at once.

**Honest note (important):** zakat = a sharia + regulatory domain. It needs **sharia
compliance** (DSN-MUI fatwas, amil rules) and possibly **partnership/registration with
a licensed LAZ**. Ulurin must not claim to be a zakat authority; position it as a
**transparent zakat-distribution tool** (for/with registered amil and LAZ). This is a
NEXT PHASE, not the 30-day MVP.

## 3.3 Movement collaboration (Pandawara etc.): from occasional sponsors to recurring income

There is a recurring pattern in Indonesia: **good-deed movements rich in followers but
with unstable income**, because they depend on sponsors/CSR that come and go. Ulurin
can turn their trust (followers) into **recurring, transparent income.**

**Flagship example: Pandawara Group** (Bandung, founded 2022):
- **12 million+ TikTok followers** (a Guinness record), **1.3 million+ kg of trash** removed, 221+ locations, **Forbes 30 Under 30 Asia 2025**, invited by President Prabowo (Mar 2025). ([Forbes](https://www.forbes.com/profile/pandawara-group/))
- **But their funding is occasional, not recurring:** first their own money, then donations for operating costs (truck rental, trash bags, tools), then **per-event CSR sponsors** (BRI, Citilink, Pertamina, etc.: one event, then it's over). ([Waste4Change](https://waste4change.com/blog/pandawara-group-pemuda-inspiratif-penggiat-bebersih-sungai/))
- Their crowdfunding is also **occasional spikes**: Dec 2025 a viral "chip in to buy a forest", with celebrity pledges of ~Rp 1.5 billion (Denny Sumargo, Denny Caknan, King Abdi), to be realized in 2026. ([Tribun Jakarta](https://jakarta.tribunnews.com/news/427199/ajakan-pandawara-patungan-beli-hutan-bersambut-2-influencer-siap-beri-rp-15-miliar-netizen-ikutan))
- **The point (proven):** they can only buy tools/trucks/bags for clean-ups **when a sponsor shows up**. The money arrives irregularly. **Imagine it recurring** via transparent donations from their 12 million followers.

**Not just Pandawara, the pattern repeats:**
- **Sungai Watch** (Bali/East Java, ~3.7 million kg of trash): a "$1 = 1 kg" donation model, still lobbying the Vice President for funding support. ([Suara Surabaya](https://www.suarasurabaya.net/kelanakota/2025/37-juta-kilogram-sampah-diangkut-dari-sungai-sungai-watch-soroti-rendahnya-kesadaran-warga/))
- **Sedekah Rombongan** (15 years accompanying poor patients, 11 shelters): 100% donation per campaign, a new fundraise for every program. ([sedekahrombongan.com](https://sedekahrombongan.com/))
- **Animal Defenders Indonesia** (animal rescue): even **covers vet bills out of their own pocket** because income is irregular. ([Komunita.id](https://komunita.id/2016/02/01/animal-defenders-indonesia-berjuang-demi-hewan-hewan-telantar/))
- **Mosques + free community kitchens:** partnering with mosques to run free kitchens or free eateries for those in need. With **recurring donors**, "**the kitchen keeps cooking**" (every day), not only when a big one-off donor appears. A daily need = a recurring-donation model = a perfect fit.
- **Road-hole volunteers (patching roads):** e.g. **Nanda (@relawan.jalan.rusak, Pekanbaru)** who over ~2 years patched ~**79 potholes** with **his own money + follower donations** (his viral clip 800k+ views, Dec 2025). He openly says he must appear on social media because **that is the only way to get support + protection** ("there have been threats"). There is also **Suted (@suted.sukarno)**, a **gig driver** in Demak who patches roads while **live-streaming + receiving donations** from viewers. Contrast: **Surya Insomnia** (a comedian) patches roads **on his own dime, one-off, with no donation model**, exactly the gap Ulurin fills. ([CatatanRiau](https://catatanriau.com/news/detail/28114/viral-relawan-jalan-rusak-di-pekanbaru-ditegur-rw-saat-tambal-jalan) · [Detik](https://www.detik.com/sumut/berita/d-8229844/cerita-surya-insomnia-ngaspal-jalan-berlubang-gue-iseng-sebenarnya)) *(note: follower counts are not published; we use the verified 800k+ views / 79 potholes figures.)*

**How Ulurin helps:**
- The movement becomes a **verified Kreator Kebaikan**; its followers can **donate recurrently (subscribe)** to fund its work continuously.
- **Two-layer proof (honest):** on-chain proves the *money flow* (collected, cut, Creator's share, disbursed); for *what was bought* (tools, trucks, trees, medicine, feed, cooking ingredients), the Creator uploads **invoices/proof** to the platform + donors get an **update notification** in the app. (See "Two-layer transparency" in section 6.)
- The movement may take a **transparent, capped reward** as income, so "doing good becomes a primary job" (exactly the vision), no longer a cost center waiting for sponsors.
- **Result:** trust (followers) turns into **stable monthly income.** From an occasional hustle into a sustainable livelihood.

**Honest note:** the movements above are cited as **public examples/inspiration, NOT
partners or users of Ulurin.** Reach figures (followers, kg of trash) are **each
movement's own claim** (from their news sources/official pages), not independently
audited numbers. Any collaboration requires the **movement's consent** + the same
transparency & consent principles. Recurring donations need an off-chain scheduler
(fast-follow, see section 7).

## 3.4 Next phase: CSR fund curation (curated good-deed funds)

Companies routinely spend **CSR / TJSL** funds (Corporate Social & Environmental
Responsibility, partly mandated by the Limited Liability Company Law), but distribution
is often **ad-hoc, hard to measure for impact, and heavy on reporting.** Ulurin can be
a **CSR curation platform:** a company parks CSR funds, Ulurin curates them into a
portfolio of verified cases/movements, leaning toward the **recurring** ones (sustained
impact), and every rupiah is proven on-chain.

The analogy is like a **mutual fund / investment manager** (funds are pooled then
allocated to a chosen portfolio), **but the "return" is auditable social impact**, not
a financial yield.

- **For the company:** CSR becomes easy, curated, and proven, with on-chain reporting for audit + ESG/branding credibility.
- **For the movement/beneficiary:** **recurring** funding from CSR, not one-off sponsors.
- **For Ulurin:** B2B revenue (curation/program-management fee), at large scale.
- **Market context (sourced):** Indonesia's CSR potential is estimated at **~Rp 80-96 trillion/year** (Bappenas, 2025, [CNBC Indonesia](https://www.cnbcindonesia.com/news/20250804121649-4-654804/bappenas-potensi-filantropi-ri-capai-rp-6655-triliun-per-tahun)). But what is actually well-managed is far smaller: **state-owned-enterprise TJSL realized ~Rp 11.2 trillion** (2023). The gap between potential and managed + the long-standing complaint that CSR funds are "not managed optimally" = **exactly the gap** this curation platform fills.

**Honest note:** this needs legal structure + compliance (CSR-fund usage rules, TJSL
reporting), possibly a permit/registration as a distributing institution, and **do not
use the term "mutual fund / investment manager" literally** (that is the financial
regulator's domain, licensed securities products). The analogy is only to explain the
curation model. This is a FAR next phase, not the MVP.

## 4. Terminology (gentle, accepted across audiences)

| Avoid | Use |
|---|---|
| fundraiser / advocate | **Kreator Kebaikan** (Good-Deed Creator) |
| poor person / beggar | **Penerima Manfaat** (Beneficiary) |
| begging video / selling sadness | **Cerita Kebaikan** (Good-Deed Story) |
| taking a cut / skim | **Imbalan Kreator** (Creator Reward, transparent, capped 0-10%) |
| money giver | **Donatur** (Donor, earns a *Donatur Terverifikasi* / Verified Donor badge) |
| fundraise | **surface and channel good** |

**How to explain it to people (gentle language):**
- Analogy: "Like a journalist or a social documentary-maker who is paid to surface real stories and make sure the aid arrives. The difference: the reward is transparent, capped at 10%, and every rupiah is recorded on-chain."
- Positive phrasing: "giving a voice to the unheard", "kindness storytelling", "proving a real need so it gets funded".

## 5. The role: Kreator Kebaikan

The person who finds a case, verifies it, makes the Cerita Kebaikan, channels the aid,
and reports the outcome. For that work they are entitled to a transparent, capped
Imbalan Kreator.

**Roots of legitimacy (honest framing):** in zakat, the amil (collector and
distributor) is entitled to a share of up to 12.5% (DSN-MUI). Being paid to do good
has been legitimate for centuries. What Ulurin adds: transparency, a cap, and on-chain
proof. Not a claim to have invented the concept.

### Creator credibility: KYC (Sumsub) + track-record profile + rating

Trust is not claimed, it is built and made visible.

- **Mandatory KYC via Sumsub.** Anyone who wants to become a Kreator Kebaikan **must pass identity verification via Sumsub** before they can open a campaign or withdraw funds. Sumsub was chosen because it is a KYC/AML provider that is **proven and common in crypto/fintech** (document verification + liveness + AML screening), so it is credible to Stellar/anchor partners, and it locks in "one verified human per account" (anti fake-account + puppeteering).
- **The Creator profile = an open track record.** Each Creator's profile shows their **fundraising history** (which campaigns they have opened) with the **total amount raised**, plus a **history of distribution proof + invoices/receipts** they have uploaded. Prospective donors can trace the track record themselves.
- **Donor rating + comments (like a marketplace seller).** Donors can leave a **rating and comment** after donating / seeing the outcome. A score + badges (e.g. "Verified", "X cases completed", "on-time distribution") show on the profile and each campaign. New Creators start at a low tier (limited reach/amount) and rise with their track record.
- **The effect:** before donating, a person can immediately judge "is this Creator credible?", exactly like checking a seller's rating + history before buying. Reputation becomes an asset that is built, not claimed. It reinforces the anti-fraud guardrail.

Note: Sumsub = a paid third-party service. For the MVP/testnet, Sumsub sandbox mode can
be used; full KYC turns on as real money approaches (mainnet).

## 6. Upstream-to-downstream workflow

**UPSTREAM, find and verify**
1. The Kreator Kebaikan finds a real beneficiary: an individual (surgery, accident, medicine, abandoned elderly, sick/abandoned animals) or an organization/foundation (see section 3, e.g. orphanage, animal shelter, elderly home, cancer/rehab foundation, anti-sexual-violence movement).
2. Verification: Beneficiary identity + proof of need (receipt/letter) + beneficiary consent.
3. Set the funding target + Imbalan Kreator (slider 0-10%, default 0%, shown clearly to donors).

**MIDDLE, tell the story and raise**
4. The Creator makes a Cerita Kebaikan (a dignified video and/or photo: who, the need, the plan), then it enters the feed.
5. The feed is ranked by verification + goal clarity + outcome updates. NOT by tears or donation speed.
6. A donor watches, is moved, then one-tap donates on the same screen (amount, name/@username/Anonymous, comment). Funds enter the smart-contract escrow.

**DOWNSTREAM, distribute and prove**
7. Funds are held in a Soroban escrow, released per milestone/proof (not instant cash-out; this kills the "skim again" pattern).
8. The Creator distributes the aid, then uploads proof (photo/receipt/outcome video).
9. Automatic on-chain split: the majority to the Beneficiary, the Imbalan Kreator (capped), a small platform fee. Every number is shown.
10. Public receipt: every donation and distribution is recorded, checkable by anyone without logging in.
11. The donor gets an outcome notification, and their comment carries a Verified Donor badge (tap to open the on-chain receipt).

### Two-layer transparency (honest, DO NOT overclaim)

Important so we do not promise what cannot be proven on-chain:

- **Layer 1, on-chain (money flow):** total donations collected, platform fee, the Creator's/foundation's share, and the amount disbursed/distributed. This is what is truly recorded on the Stellar ledger and checkable by anyone without logging in.
- **Layer 2, off-chain (fund usage):** for **what was bought** (tools, trucks, trees, medicine, feed, etc.), the Creator **uploads invoices/receipts/photos/videos** to the platform, and the donor gets an **update notification** in the app.

On-chain does **NOT** automatically prove "the money bought the trees/tools"; that
needs manually uploaded invoices/proof. The honest claim: **on-chain = money flow;
invoice + update = proof of usage.** Do not merge the two as if on-chain did both.

## 7. Key feature: one-tap donate inside the content (video/photo) + verified badge

Frictionless conversion: moved, you can help right on the same screen (no jump to a
website like Kitabisa). This is where Stellar shines: settling in about 9.5 seconds, a
fee of about $0.0007, so micro-donations make sense.

**Flow:**
1. See the story (video/photo), tap the screen, the donation sheet appears over it (if it is a video, it keeps playing).
2. Amount: presets (Rp 10k / 25k / 50k / custom), one tap to confirm (the wallet already exists from Google login, crypto-invisible).
3. Choose identity: name / @username / Anonymous.
4. Write a comment (optional).

### Imbalan Kreator transparency (the donor MUST be aware BEFORE giving)

Every donor MUST see, before confirming, in plain language: what the Imbalan Kreator
is, what percentage, and what for. This is informed consent (opt-in before giving),
not a hidden cut.

- **On the campaign card:** "Creator [name] set **X%** for work costs: transport to the location, verification, video production, operations, and a reward for their effort in channeling the aid. **The rest (100-X%) goes to [beneficiary].**"
- **In the one-tap sheet, before confirming:** "You give Rp 50,000: Rp [rest] to [beneficiary], Rp [reward] (X%) Imbalan Kreator, Rp [fee] platform fee." Each component is tappable for an explanation.
- **The Creator must write their reason** (e.g. "5% for a 3-hour transport to the location + verification + making the video"). Transparency of PURPOSE, not just the number.
- **The donor is aware and agrees:** there is a visible acknowledgment; if enabled, the donor can **zero out** the Imbalan Kreator.
- **Language:** say "the Creator's work reward / operating cost", NOT "a cut". Always disclosed and capped 0-10%.

Why it matters: the donor gives with eyes open. That is what separates Ulurin from
"quietly taking a cut" (the Cak Budi/ACT cases). It reinforces guardrail #3.

**Donation badge in comments (an honesty twist):** proven on-chain, not decoration.
- Safe default: `Verified Donor` (no amount).
- Optional (donor's choice): `Donated Rp 50,000`.
- Anonymous: `Anonymous, Donor`.
- Each badge is tappable to open its on-chain receipt ("check it yourself").
- Control over showing the amount is in the donor's hands (default badge shows no number) to protect dignity, not to show off.

**Social proof:** a live counter "128 people have helped, +Rp 2.4M today" + a feed of recent donors.

### On/off-ramp technology: seamless for the user, genuinely Stellar underneath

The user does NOT feel any crypto: they pay/receive via familiar rails (QRIS,
e-wallet, bank, through an aggregator like Xendit/Midtrans), UI in rupiah. But behind
the scenes, the technology really is Stellar (not just "holding coins"):

1. Fiat comes in, is converted to **USDC on Stellar** (the settlement asset) via an **anchor** (the Stellar **SEP-24/SEP-6** standards for deposit/withdraw).
2. The USDC enters a **Soroban smart-contract escrow** that holds funds, enforces the 0-10% cut, and does the automatic split.
3. Every action = **an entry on the public Stellar ledger**, that is the receipt/proof anyone can audit.
4. Distribution, the beneficiary cashes out to rupiah via an anchor/off-ramp (e.g. a network like the one Aid Assist uses).

**Why Stellar "feels used" (not just a USDC wallet):**
- **Soroban smart contract** (escrow + cap + split) = the logic runs ON Stellar, not on our server.
- **Public ledger** = transparency (Stellar's core selling point).
- **Anchor standards (SEP-24/SEP-31/SEP-38)** = using Stellar's official standards for the fiat bridge.
- **Path payment** for cross-asset (e.g. rupiah to rupiah), and the **Stellar Disbursement Platform** pattern fits recurring/bulk distribution to foundations.

**Honest note:** REAL fiat cash-in/out needs a **licensed anchor (VASP)**. Indonesia
has no live Stellar anchor yet, so this is the hardest part. MVP/testnet: use a
**sandbox anchor (SEP-24 demo) + Xendit test mode, USDC testnet, Soroban escrow**. Real
fiat = needs a licensed anchor partner (roadmap, not the MVP).

## 8. Honesty foundations (mandatory guardrails from day 1)

This donation-video format carries high reputational risk (precedents: the 2023
Indonesian "online begging" mud-bath trend taken down by the ministry; TikTok Syrian
refugee begging whose middleman took ~70%; Kuaishou fake charity). The "gentle
language" above is honest ONLY if these five things are real:

1. **Ranking = ethics.** Rank by verification + goal clarity + outcome updates. NOT by tears / donation speed / views. Reward completed stories (an incentive to "finish then leave", not to keep performing suffering). No "most suffering" leaderboard.
2. **Milestone escrow + on-chain transparency** (anti "skim again"; show where every rupiah goes, something Kitabisa/ACT cannot).
3. **Transparent and capped fee 0-10%**, the donor can zero it. This is the whole difference from the hidden-70% TikTok case.
4. **Children are protected.** No minor as an on-camera subject or beneficiary in the feed. A hard line, a launch-blocker.
5. **An equal non-video path.** "You can raise without putting your suffering on display." Video is opt-in, not the only way to the top of the feed.

Additional: identity + fund-usage verification; anti-middleman (payout only to the
beneficiary's KYC wallet, not the operator); launch recorded (not live) so every clip
can be reviewed before it is boosted.

## 9. Alignment with Stellar's vision-mission (from stellar.org research, 2026-07-11)

Researched directly: home, /foundation, /use-cases, /use-cases/stellar-for-aid,
/case-studies, /ecosystem.

**SDF mission (their words):** "creating equitable access to the global financial
system through blockchain technology." North Star: everyday financial services +
transparency. They support "builders solving the financial access problem for their
communities."

**Stellar Aid Assist = Ulurin's twin downstream.** Stellar's flagship aid program.
The six values they market match Ulurin's value prop almost exactly:

| Aid Assist value | Ulurin |
|---|---|
| Instant | one-tap donation, settles ~9.5s |
| Transparent ("traceability of funds to ensure aid goes to those who need it") | public on-chain receipt |
| Accessible (Aid Assist: "just need a mobile phone, no bank account") | crypto-invisible + Google login to **use the app & donate in-app** (without understanding crypto). Honest note: **top up / withdraw still needs a fiat rail** (bank/e-wallet/QRIS) |
| Stable (stablecoin) | USDC underneath, rupiah in the UI |
| Low cost (~1 cent / 10,000 tx) | micro-donations make sense |
| Global cash-out (185 countries) | cash-out path (roadmap) |

The difference: **Aid Assist is institutional** (an org uploads a list of recipients,
disburses in bulk, top-down, via the Stellar Disbursement Platform). **Ulurin is
grassroots** (individual donor to an individual case, bottom-up).

**White space (a key finding):**
- Stellar case studies (19): all institutions/regulated finance (Franklin Templeton, DTC, WisdomTree, UNHCR, IRC, MoneyGram, payroll). Zero consumer donation apps.
- Ecosystem (521 projects): dominated by tokenized assets, payments, DeFi, wallets. "Donation/charity" is not even a submit-project category.
- Meaning: Stellar has INSTITUTIONAL aid (Aid Assist) but no peer-to-peer "Aid Assist for the people". Ulurin fills that gap.

**Strongest positioning:** "Stellar Aid Assist proves transparent on-chain aid at the
institutional level. Ulurin brings the same model to the grassroots."

**Pitch hook (verbatim Stellar phrases we can echo):**
"get money into the hands of those who need it, quickly and at low cost" ·
"traceability of funds to ensure aid goes to those who need it" ·
"instant and transparent digital aid at scale" ·
"equitable access to the global financial system".

**Honest note (same rules as our other Stellar projects):**
- Position Ulurin as a financial-inclusion + transparent-aid app ON TOP of the Stellar rails, not a claim to build infrastructure.
- Frame it via financial inclusion + Aid Assist, not "creator monetization" alone.
- DO NOT claim affiliation with / use of Aid Assist/SDP/UNHCR-IRC. Just "inspired by the transparency principles Stellar Aid Assist proved" (aligned model, not affiliation).
- **DO NOT echo "no bank account" as an Ulurin claim.** Aid Assist can, because recipients cash out in physical cash via MoneyGram, but **our on/off-ramp (top up / withdraw) still needs a fiat rail** (bank/e-wallet/QRIS). The honest version: "use the app + donate in-app without understanding crypto; cash in/out via ordinary fiat rails".

## 10. Product roadmap (high level)

1. **MVP (testnet):** creator-cut donations + Cerita Kebaikan feed (video/photo) + one-tap donate + public on-chain receipt + Soroban escrow/split.
2. **Fast-follow:** full KYC (Sumsub), Creator rating + track record, recurring donations (off-chain scheduler).
3. **Next phase:** a zakat rail (with registered amil/LAZ), CSR/TJSL fund curation.
4. **Needs a license:** fiat on/off-ramp via a licensed Stellar anchor (VASP) for real money.

**Stellar research sources:** stellar.org/foundation, stellar.org/use-cases/stellar-for-aid, stellar.org/case-studies, stellar.org/ecosystem (accessed 2026-07-11).
