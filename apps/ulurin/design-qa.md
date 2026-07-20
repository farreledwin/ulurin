# Ulurin Design QA

## Comparison setup

- Source of truth: `design/reference/ulurin-selected-concept.png`
- Implementation: `http://localhost:4317/`
- Tested state: landing page, Bahasa Indonesia, signed out, simulation mode
- Browser viewport request: 1536 x 1024
- Captured browser content: 1521 x 1014
- Source dimensions: 1487 x 1058
- Normalization: the source image was center-cropped and resized to the captured browser dimensions before comparison
- Full comparison: `C:/Users/Lenovo/.codex/visualizations/2026/07/14/019f620f-548d-7040-922e-9496ba2bd8a4/ulurin-matched-comparison-final.png`
- Focused donation comparison: `C:/Users/Lenovo/.codex/visualizations/2026/07/14/019f620f-548d-7040-922e-9496ba2bd8a4/ulurin-focused-donation-comparison.png`

## Required fidelity surfaces

1. Deep ink hero with documentary river-cleanup photography
2. Instrument Serif headline with the intended three-line rhythm
3. Mint brand accents and coral primary donation action
4. Story card paired with a clear donation and fee breakdown surface
5. Cream proof band visible immediately after the hero
6. Restrained borders, compact controls, and editorial spacing

## Iteration record

### Iteration 1

- P2: hero was too tall, pushing proof below the first fold.
- P2: the donation card was taller than the reference and weakened the editorial balance.
- P2: the headline wrapped differently from the approved concept.

Fixes:

- Reduced the desktop hero from roughly 838 px to roughly 651 px.
- Reduced the story and donation surface from roughly 650 px to roughly 555 px.
- Moved the proof band from roughly y 830 to roughly y 651.
- Added explicit desktop line grouping for `Berbuat baik`, `sebagai pekerjaan`, and `utama.` while retaining natural wrapping on narrower screens.
- Matched the approved mint header details and retained the warm cream proof band.

### Final comparison

- No remaining P0 finding.
- No remaining P1 finding.
- No remaining P2 finding.
- P3 differences are intentional product adaptations: language control, richer campaign metadata, and a responsive image crop that protects text and donation legibility.

### Iteration 2: compact mobile conversion path

- Viewports: iPhone compact at 375 x 667 and iPhone standard at 390 x 844.
- Baseline evidence: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-responsive-audit-20260715/`
- Implementation evidence: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-responsive-fix-20260715/`
- Combined before and after comparison: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-responsive-fix-20260715/combined-mobile-before-after.png`

Findings:

- P1: the compact landing hero placed the primary call to action below the first viewport.
- P1: the donation form showed a large campaign summary before the amount controls, forcing a full scroll before the donor could act.
- P1: the fixed simulation notice covered conversion controls in the story feed and marketplace.
- P2: the marketplace used too much vertical space before the first campaign card.
- P2: several mobile controls were below the 44 px touch target used for this pass.

Fixes:

- Tightened the mobile hero type scale, copy spacing, and vertical padding so the primary and secondary calls to action are visible at 375 x 667.
- Kept the full campaign summary on larger screens and replaced it on phones with a compact, live donation split directly after the amount controls.
- Moved the closed simulation notice into the header as a 42 px information control and placed the open disclosure below the header without covering primary actions.
- Reduced pre-card marketplace spacing and limited the landing page preview to two campaign cards on compact screens.
- Increased story navigation, category tabs, header controls, and social actions to practical touch targets.

Post-fix verification:

- Landing: the primary call to action is visible without scrolling at 375 x 667.
- Story feed: campaign context, 90/5/5 split, and donation action fit in one 375 x 667 viewport.
- Donation: preset amounts and the live fee split are visible immediately at 390 x 844, and selecting Rp 100.000 updates the split to Rp 90.000, Rp 5.000, and Rp 5.000.
- Marketplace: search, activity, categories, campaign count, and the first campaign image are visible at 390 x 844.
- Simulation disclosure: the expanded notice renders cleanly below the header with no page masking or control overlap.
- No remaining P0, P1, or P2 issue in the audited mobile conversion path.

### Iteration 3: campaign amounts, proof-gated creator rating, and header disclosure

- User feedback sources:
  - `C:/Users/Lenovo/AppData/Local/Temp/codex-clipboard-ea8faa9e-c80e-4486-b476-1ca7137c06ed.png`
  - `C:/Users/Lenovo/AppData/Local/Temp/codex-clipboard-d4296863-82ed-45f5-a99d-9edb5e7ee798.png`
  - `C:/Users/Lenovo/AppData/Local/Temp/codex-clipboard-ccf02b3c-b533-49f7-ac6d-9219ad2fc16c.png`
- Combined before and after comparison: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-feedback-20260715/combined-user-feedback-before-after.png`
- Android implementation evidence:
  - `C:/Users/Lenovo/AppData/Local/Temp/ulurin-feedback-20260715/android-feedback-home-final.png`
  - `C:/Users/Lenovo/AppData/Local/Temp/ulurin-feedback-20260715/android-feedback-story1-final.png`
  - `C:/Users/Lenovo/AppData/Local/Temp/ulurin-feedback-20260715/android-feedback-story2-final.png`
- Browser implementation evidence:
  - `C:/Users/Lenovo/AppData/Local/Temp/ulurin-feedback-20260715/receipt-rating-locked.png`
  - `C:/Users/Lenovo/AppData/Local/Temp/ulurin-feedback-20260715/creator-review-rating.png`
  - `C:/Users/Lenovo/AppData/Local/Temp/ulurin-feedback-20260715/creator-review-rating-submitted.png`

Findings:

- P1: every story proposed Rp 50.000, so campaign context did not affect the donation decision.
- P1: the receipt presented a campaign rating too close to payment confirmation, before proof of distribution had been reviewed.
- P1: the rating target was described as the campaign instead of the Kreator Kebaikan responsible for execution and reporting.
- P2: the simulation disclosure appeared as a dark floating circle attached to the wordmark on mobile.

Fixes:

- Added a distinct suggested donation for every campaign and carried that amount into the donation form through the story call to action.
- Replaced the immediate receipt rating form with a clear three-step gate: donation confirmed, proof reviewed, then creator rating unlocked.
- Added a separate completed-campaign example that presents photo evidence, video evidence, beneficiary confirmation, and a rating form addressed to the named Kreator Kebaikan.
- Stored ratings against the creator profile while retaining the originating campaign and proof review reference.
- Moved the simulation disclosure into the header action group and removed the floating treatment that overlapped the wordmark.

Post-fix verification:

- Story 1 proposes Rp 50.000 and story 2 proposes Rp 25.000 with a matching 90/5/5 split.
- Rp 25.000 carries into the Dapur Berbagi donation form and simulated receipt.
- A newly created receipt contains no star controls and explains why creator rating is still locked.
- The separate completed-campaign example shows both photo and video proof before presenting the creator rating form.
- A five-star example rating is saved against Siti Rahma as the Kreator Kebaikan.
- The information control renders as a compact header icon with no dark circle or wordmark collision on Android.
- No remaining P0, P1, or P2 issue in this feedback pass.

### Iteration 4: desktop hero card metadata overlap

- Source visual truth: `C:/Users/Lenovo/AppData/Local/Temp/codex-clipboard-2f0cc8c9-a7cf-4bb5-8d92-53da08a1a1ad.png`
- Implementation screenshots:
  - `C:/Users/Lenovo/AppData/Local/Temp/ulurin-desktop-card-fix-20260715/landing-1536-after.png`
  - `C:/Users/Lenovo/AppData/Local/Temp/ulurin-desktop-card-fix-20260715/landing-1024-after.png`
- Mobile regression screenshot: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-desktop-card-fix-20260715/landing-390-regression.png`
- Focused full-component comparison: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-desktop-card-fix-20260715/focused-before-after.png`
- Desktop viewport: 1024 x 768, Bahasa Indonesia, signed out, simulation mode.
- Mobile regression viewport: 390 x 844.
- The source is a focused component crop rather than a full-page viewport. The comparison therefore normalizes the complete hero card, while the implementation screenshot verifies the surrounding first fold.

Finding:

- P1: the donation sheet covered the creator rating and completed-campaign count, while the like and detail actions were almost entirely hidden.

Fixes:

- Reduced only the desktop hero donation sheet's vertical padding and compact split-row height.
- Tightened the story card's internal vertical rhythm so metadata and actions remain in the dark story area above the sheet.
- Added a narrower desktop adjustment below 1120 px while retaining the existing mobile breakpoint where the preview card is intentionally hidden.

Required fidelity surfaces:

- Typography: display headline and card typography remain unchanged; compact sheet text remains readable at the tested desktop widths.
- Spacing and layout rhythm: rating, campaign history, like, and detail now have clear separation from the donation sheet.
- Colors and visual tokens: forest, mint, coral, paper, borders, and translucency are unchanged.
- Image quality: the existing documentary river-cleanup image, crop, and avatar treatment are unchanged.
- Copy and content: all campaign metadata and donation split labels remain intact.

Post-fix verification:

- At 1536 x 1024, rating, 17 completed campaigns, like count, and Detail are visibly separated from the donation sheet.
- At 1024 x 768, the same four elements remain visible and the Detail link opens the campaign page.
- At 390 x 844, the mobile landing hero remains unchanged and its primary action stays visible.
- Browser console errors: 0.
- No remaining P0, P1, or P2 issue in this feedback pass.

### Iteration 5: creator identity, evidence history, and donor discussion

- User feedback sources:
  - `C:/Users/Lenovo/AppData/Local/Temp/codex-clipboard-0d7f51bc-b6e9-4824-9de2-d6625a068bf9.png`
  - `C:/Users/Lenovo/AppData/Local/Temp/codex-clipboard-ac288139-7158-4ce7-bafb-68fcdd3626fa.png`
  - `C:/Users/Lenovo/AppData/Local/Temp/codex-clipboard-a1cb0d9a-2abd-46b4-95f8-92cd0a175c49.png`
  - `C:/Users/Lenovo/AppData/Local/Temp/codex-clipboard-c04b2b16-4642-4348-b56d-498c486bf63e.png`
- Desktop profile implementation: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-creator-trust-20260715/profile-desktop-after.png`
- Profile comparison board: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-creator-trust-20260715/profile-comparison.png`
- History implementation: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-creator-trust-20260715/history-desktop-after.png`
- History comparison board: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-creator-trust-20260715/history-comparison.png`
- Android landing evidence: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-android-home.png`

Findings:

- P1: every creator avatar reused the campaign photograph, so identity and field documentation were visually indistinguishable.
- P1: completed campaigns were static rows with no path to distribution evidence or donor reviews.
- P1: active campaigns had no donor discussion surface.
- P2: the active campaign and trust panel occupied distant columns with an unbalanced empty middle area on wide screens.
- P2: the feature set did not generalize across all seven active campaigns and creator profiles.

Fixes:

- Added seven distinct casual creator portraits and reused them consistently across campaign cards, story feed, campaign detail, profile, dashboard, and creator rating.
- Rebuilt the active profile section as one balanced grid so the campaign and trust panel share a clear visual relationship.
- Replaced static history rows with image-led evidence cards. Every card links to a completed-campaign page containing documentation, beneficiary confirmation, prototype hash, and verified donor reviews.
- Added donor comments to every active campaign with realistic seeded content and a working session-only comment form.
- Kept honesty copy explicit: completed evidence is prototype data, the sample hash is not a Stellar transaction, and real donor verification would gate comments in production.

Post-fix verification:

- Desktop profile at 2560 x 1417 retains the source layout language while separating identity photography from campaign documentation.
- History at 1867 x 712 presents all four Hendra examples as inspectable cards with images, proof counts, review counts, funding, and rating.
- The completed-campaign route opens from history and exposes proof, beneficiary confirmation, reviews, and a route back to the active campaign.
- Campaign comments accept a new message, update the verified comment count, and retain realistic seeded comments for every campaign.
- Mobile checks at 390 x 844 show a compact creator identity, one-column active campaign, readable trust panel, and tappable history cards without horizontal overflow.
- No remaining P0, P1, or P2 issue in the audited creator trust flow.

### Iteration 6: avatar integrity and unique completed-campaign evidence

- User feedback sources:
  - `C:/Users/Lenovo/AppData/Local/Temp/codex-clipboard-58489140-4294-4732-a07f-eed7f832c7b8.png`
  - `C:/Users/Lenovo/AppData/Local/Temp/codex-clipboard-0ec47aee-7625-48db-a892-4c431b931cb8.png`
- Landing comparison: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-image-audit-20260715/compare-avatar.jpg`
- History implementation: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-image-audit-20260715/after-history.png`
- Completed asset review: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-image-audit-20260715/completed-contact-sheet.jpg`

Findings:

- P1: the landing preview still used a crop of the active campaign image as Hendra's profile avatar.
- P1: all completed campaigns inherited the active campaign image, so separate results looked like duplicated records.
- P2: a completed-campaign detail repeated the same photograph for both documentation and invoice evidence.

Fixes:

- Connected the landing avatar to the same dedicated creator portrait used throughout the rest of the product.
- Added sixteen campaign-specific documentary images, one for every completed campaign across all seven creators.
- Replaced the repeated second photograph in completed-campaign details with a structured invoice and beneficiary-confirmation record.
- Added automated guards that require every completed image path to be unique, distinct from active campaign photography, and backed by one photographic proof item.

Post-fix verification:

- Hendra's landing avatar resolves to `/assets/creators/hendra-kurniawan.webp` at 42 x 42 px.
- All sixteen completed campaign files have distinct SHA-256 hashes and 1200 x 900 source dimensions.
- Siti's two history cards load different 1200 px images that match meal distribution and kitchen-equipment handover respectively.
- The Android APK contains all sixteen completed-campaign assets.
- No remaining P0, P1, or P2 issue in the audited image-integrity surfaces.

### Iteration 7: compact mobile problem carousel

- Source visual truth:
  - `C:/Users/Lenovo/AppData/Local/Temp/codex-clipboard-04345e10-203d-49d2-9aaa-566dec363ab1.png`
  - `C:/Users/Lenovo/AppData/Local/Temp/codex-clipboard-813b3141-737d-435b-8bb9-9c06ff8a231d.png`
- Baseline implementation: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-mobile-problem-carousel-20260715/landing-problem-before.png`
- Revised implementation:
  - `C:/Users/Lenovo/AppData/Local/Temp/ulurin-mobile-problem-carousel-20260715/landing-problem-after-slide-1.png`
  - `C:/Users/Lenovo/AppData/Local/Temp/ulurin-mobile-problem-carousel-20260715/landing-problem-after-slide-2-final.png`
- Combined source and revised comparison: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-mobile-problem-carousel-20260715/problem-carousel-reference-vs-after.png`
- Viewport: 390 x 844 requested, 375 px browser content width captured, Bahasa Indonesia, signed out, simulation mode.
- State: landing problem section, first and second carousel slides, followed by section 02.

Finding:

- P1: the ACT case and 1980 regulation stacked vertically on mobile, making section 01 substantially longer and delaying section 02.

Fixes:

- Converted only the mobile problem ledger into a two-slide horizontal carousel with touch swipe, scroll snap, a visible next-slide preview, and 44 px previous and next controls.
- Kept both source texts intact and stored one active index for the swipe and button states.
- Reduced the problem section's lower spacing so section 02 begins directly after the compact carousel.
- Preserved the two-column editorial ledger and hidden carousel controls on desktop.

Required fidelity surfaces:

- Typography: Instrument Serif headings and Manrope supporting copy retain their hierarchy and wrapping.
- Spacing and layout rhythm: one 286 px fact slide is visible at a time, with section 02 immediately following the carousel controls.
- Colors and visual tokens: paper, forest, ink, and line tokens are unchanged.
- Image quality: no image assets were changed; the Dapur Berbagi documentary card remains the first visual in section 02.
- Copy and content: both facts and the section 02 explanation are unchanged.

Post-fix verification:

- Dragging horizontally changes the indicator from `1 dari 2` to `2 dari 2` and moves the track from 0 px to roughly 287 px.
- Previous and next controls update the active slide and disable correctly at each end.
- Mobile document width equals viewport width, with no page-level horizontal overflow.
- At 1265 px desktop width, the ledger remains a two-column grid and mobile controls remain hidden.
- Browser console errors and warnings: 0.
- No remaining P0, P1, or P2 issue in this feedback pass.

### Iteration 8: ledger explainer and compact public receipt

- User feedback sources:
  - `C:/Users/Lenovo/AppData/Local/Temp/codex-clipboard-e3269bed-94f6-46b9-b68f-226f59587e01.png`
  - `C:/Users/Lenovo/AppData/Local/Temp/codex-clipboard-da36c06c-8529-4e3b-a39c-e7d50208c714.png`
- Combined reference and implementation comparison: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-transparency-qa-20260716/transparency-reference-vs-after.png`
- Desktop receipt evidence: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-transparency-qa-20260716/receipt-desktop-after.png`
- Mobile ledger evidence: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-transparency-qa-20260716/ledger-mobile-after.png`
- Mobile receipt evidence: `C:/Users/Lenovo/AppData/Local/Temp/ulurin-transparency-qa-20260716/receipt-mobile-after.png`

Findings:

- P1: the word ledger appeared without a plain-language explanation, leaving non-crypto donors to infer what the technology records and what it cannot prove.
- P1: the sample public receipt showed a fee split without stating the full donation nominal.
- P2: desktop steps 01, 02, and 03 stretched to the full receipt height, creating oversized empty cards and weakening the hierarchy.

Fixes:

- Added a keyboard-reachable information control beside the ledger heading with an expanded region that explains the public cashbook, recorded transaction facts, and the limits of on-chain evidence.
- Added a visible `Rp 100.000` full sample total before the 90%, 5%, and 5% split.
- Stopped the desktop proof timeline from inheriting the 595 px receipt height and capped each step at a compact 150 px presentation.
- Preserved a one-column mobile layout with 42 px information control height and proof steps between 105 px and 121 px.

Post-fix verification:

- At the 1440 px desktop audit width, the receipt mock is 380 px wide, the proof timeline is 869 px wide, and all three steps are 150 px high.
- At the 390 px mobile audit width, document width equals content width with no horizontal overflow. Each proof step is 339 px wide and no taller than 121 px.
- The information control exposes `aria-expanded`, opens a labelled explanatory region, and clearly states that the ledger does not prove identity or real-world delivery by itself.
- Automated tests: 17 passed. Production build completed successfully. Browser console errors and warnings: 0.
- No remaining P0, P1, or P2 issue in this feedback pass.

## Functional checks completed

- Landing navigation and primary calls to action
- Story feed progression and story-to-donation path
- Donation amount selection, disclosed fee split, simulated Xendit payment, and receipt generation
- Receipt transaction hash display, proof-gated creator rating, and completed-campaign review submission
- Marketplace search and campaign discovery
- Campaign detail, creator profile, campaign history, active campaigns, and proof timeline
- Creator dashboard, campaign creation form, and proof upload flow
- Mobile responsive layout with no horizontal overflow
- Browser console checked with no application errors or warnings during tested journeys

## Final result

passed
