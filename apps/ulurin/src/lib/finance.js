// PLATFORM_FEE_PCT is the fee the UI's static surfaces advertise. It is set to
// 2 AHEAD of the deployed vault: config() still returns [1000, 300] (3%),
// pending a deferred redeploy to --platform_bps 200. So until that redeploy,
// the campaign cards / donate preview show 2% while the live vault charges 3% —
// a deliberate, temporary divergence, NOT a mirror. The one surface that reads
// the vault live (ReleaseStatus) shows the real on-chain 3%, so it stays honest.
// This divergence is not auto-guarded: stellar.test.js asserts the vault's 300
// in isolation and campaigns.test.js only checks the seed against THIS constant
// (2 === 2). The binding guard that would catch it lives skipped in
// stellar.test.js — un-skip it after the redeploy, when it turns green.
//
// PP No. 29/1980 Pasal 6(1) caps total financing of a collection at 10% of its
// proceeds. Creator + platform is what that cap counts, so every rung below
// stays under it: 2% / 5% / 7%.
export const PLATFORM_FEE_PCT = 2;
export const KYC_TIER_CEILING = [0, 3, 5];
export const MAX_TOTAL_FINANCING_PCT = 10;

/// What a creator at this tier may take, given the platform fee in force. The
/// tier is the ceiling until the platform fee eats the room the law leaves,
/// after which the law is. Mirrors the contract's ceiling_for().
export function creatorCeilingPct(tier) {
  const byLaw = MAX_TOTAL_FINANCING_PCT - PLATFORM_FEE_PCT;
  const byTier = KYC_TIER_CEILING[tier] ?? 0;
  return Math.min(byTier, byLaw);
}

/// The split a campaign gets from one number. Deriving it means the three
/// shares cannot miss 100 and cannot disagree with the fee that was chosen.
export function splitForCreatorFee(creatorPct) {
  const creator = Number(creatorPct) || 0;
  return { beneficiary: 100 - PLATFORM_FEE_PCT - creator, creator, platform: PLATFORM_FEE_PCT };
}

export function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function compactRupiah(value) {
  if (value >= 1_000_000_000) return `Rp${(value / 1_000_000_000).toFixed(1)} M`;
  if (value >= 1_000_000) return `Rp${(value / 1_000_000).toFixed(1)} jt`;
  if (value >= 1_000) return `Rp${Math.round(value / 1_000)} rb`;
  return `Rp${value}`;
}

export function calculateSplit(amount, split) {
  const beneficiary = Math.round((amount * split.beneficiary) / 100);
  const creator = Math.round((amount * split.creator) / 100);
  const platform = amount - beneficiary - creator;
  return { beneficiary, creator, platform, total: amount };
}

export function progressPercent(raised, target) {
  return Math.min(100, Math.round((raised / target) * 100));
}

export function createDemoHash() {
  const seed = `${Date.now()}-${Math.random()}`;
  let value = 0;
  for (let index = 0; index < seed.length; index += 1) {
    value = (value * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return Array.from({ length: 64 }, (_, index) => ((value + index * 13) % 16).toString(16)).join("");
}
