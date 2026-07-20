# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Ulurin design decisions

- The selected visual target is `design/reference/ulurin-selected-concept.png`.
- The product must feel like a mainstream Indonesian donation service, never like crypto trading or a blockchain dashboard.
- Preserve the editorial serif headline, documentary field photography, deep ink background, warm ivory surface, mint confirmation color, and coral donation action.
- The core mobile experience is a story-first vertical feed with a one-tap donation sheet, visible fee split, creator history, and proof trail.
- Desktop discovery must support both the story feed and a marketplace without duplicating campaign truth.
- Use Instrument Serif for display text, Manrope for product UI, and Phosphor for interface icons.
- Do not use em dash characters, fake traction, fabricated partnerships, poverty porn, hidden fees, generic glass cards, purple startup gradients, or crypto-first language.
- All Xendit, Stellar, donation, proof, rating, and live-activity behavior in this local build is explicitly labeled as simulation or test data.
- For this prototype, the amount selected by a donor is treated as the full total. The platform share is 5%, the sample verified creator share is at most 5%, and the remainder is shown for the beneficiary. This is a product-demo assumption, not a final legal or accounting policy.
- Every active campaign must connect to a creator profile with completed campaign history. Each completed entry needs its own documentary image, distribution evidence, beneficiary confirmation, and donor reviews.
- Creator ratings are campaign-specific and only become available from a completed campaign after its evidence is visible. Active campaigns and newly created donation receipts must not expose a rating control.
- On mobile, dense supporting facts should use a compact horizontal carousel with swipe and explicit controls when stacking them would push the next numbered landing section too far down. Preserve the desktop editorial grid.
- The transparency page must explain the public ledger in plain Indonesian through an accessible information control. Sample receipts must show the full donation nominal before the split, and desktop proof steps must stay compact instead of stretching to the receipt height.
