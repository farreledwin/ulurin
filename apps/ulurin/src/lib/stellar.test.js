import { expect, test } from "vitest";
import { PLATFORM_FEE_PCT } from "./finance.js";
import { CHAIN_CAMPAIGN_ID, formatUsdc, getCampaignState, getCeilingBps, getConfig } from "./stellar.js";

// The guard that binds the UI's fee constant to the live vault. The vault now
// returns 200 bps (set_platform_bps), so PLATFORM_FEE_PCT (2) and the chain
// agree and this passes — and from here on any drift between the two fails loud.
test("PLATFORM_FEE_PCT matches the on-chain platform fee", async () => {
  expect(PLATFORM_FEE_PCT).toBe((await getConfig()).platformBps / 100);
}, 30_000);

// These hit the live testnet vault. They are the only tests here that need a
// network, and that is the point: they fail if the deployed contract stops
// matching what the UI believes about it.

test("reads the cap and platform fee from the contract, not from a constant", async () => {
  expect(await getConfig()).toEqual({ maxTotalBps: 1000, platformBps: 200 });
}, 30_000);

test("the tier ladder on chain matches the one the seed data obeys", async () => {
  expect(await getCeilingBps(0)).toBe(0);
  expect(await getCeilingBps(1)).toBe(300);
  expect(await getCeilingBps(2)).toBe(500);
}, 30_000);

test("every rung of the ladder leaves room under the statutory cap", async () => {
  const { maxTotalBps, platformBps } = await getConfig();
  for (const tier of [0, 1, 2]) {
    expect((await getCeilingBps(tier)) + platformBps).toBeLessThanOrEqual(maxTotalBps);
  }
}, 30_000);

// Campaign 1 was opened under the old 300 bps and settled there, so it still
// reads 92/5/3 — the vault holds each campaign to the fee it was created under.
// The current fee is 200 bps; the live demo campaign is CHAIN_CAMPAIGN_ID below.
test("reads campaign 1 and sees the historical 92/5/3 split settled in USDC", async () => {
  const s = await getCampaignState(1);
  expect(s.raisedUnits).toBe("1000000000"); // 100 USDC
  expect(s.creatorBps).toBe(500);
  expect(s.platformBps).toBe(300);
  expect(s.proofUploaded).toBe(true);
}, 30_000);

// CHAIN_CAMPAIGN_ID is the live demo campaign the app reads: anyone can donate,
// upload proof, or trigger a release through /api/vault. Its balances therefore
// move in both directions, and this suite has now been broken twice by assuming
// otherwise — once by pinning exact amounts, once by asserting the shares re-sum
// to `raised`, which only holds until the first withdrawal.
//
// The rule these tests must follow: assert only what survives ANY future
// operation on the campaign. Exact-split arithmetic belongs in the contract's
// own tests, where the environment is controlled — see
// contracts/ulurin-vault/src/test.rs, which pins the split to the unit and
// proves truncation favours the beneficiary. Here we check the things a live,
// mutating campaign can still promise.

test("the live demo campaign is funded", async () => {
  const s = await getCampaignState(CHAIN_CAMPAIGN_ID);
  expect(BigInt(s.raisedUnits)).toBeGreaterThan(0n);
}, 30_000);

test("the balances still held can never exceed what was raised", async () => {
  const s = await getCampaignState(CHAIN_CAMPAIGN_ID);
  const held =
    BigInt(s.beneficiaryAvailableUnits) + BigInt(s.creatorLockedUnits) + BigInt(s.platformAccruedUnits);
  // Withdrawals only ever reduce this, so equality is the ceiling, not the rule.
  expect(held).toBeLessThanOrEqual(BigInt(s.raisedUnits));
}, 30_000);

test("the live campaign's platform fee is the one the contract now enforces", async () => {
  const [s, config] = await Promise.all([getCampaignState(CHAIN_CAMPAIGN_ID), getConfig()]);
  expect(s.creatorBps + s.platformBps).toBeLessThanOrEqual(config.maxTotalBps);
  expect(s.platformBps).toBe(config.platformBps);
  expect(s.creatorBps).toBeLessThanOrEqual(await getCeilingBps(s.tier));
}, 30_000);

test("neither fee pool can hold more than its share of what was raised", async () => {
  const s = await getCampaignState(CHAIN_CAMPAIGN_ID);
  const raised = BigInt(s.raisedUnits);
  // Truncation rounds the fee pools down, never up, so these are hard bounds
  // regardless of how many donations landed or what has been released since.
  expect(BigInt(s.creatorLockedUnits)).toBeLessThanOrEqual((raised * BigInt(s.creatorBps)) / 10_000n);
  expect(BigInt(s.platformAccruedUnits)).toBeLessThanOrEqual((raised * BigInt(s.platformBps)) / 10_000n);
}, 30_000);

test("formats settlement amounts as USDC, never as rupiah", () => {
  expect(formatUsdc("1000000000")).toBe("100 USDC");
  expect(formatUsdc("48000000")).toBe("4,8 USDC");
  expect(formatUsdc(0)).toBe("0 USDC");
});
