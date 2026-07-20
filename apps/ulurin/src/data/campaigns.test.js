import { describe, expect, test } from "vitest";
import { KYC_TIER_CEILING, MAX_TOTAL_FINANCING_PCT, PLATFORM_FEE_PCT } from "../lib/finance.js";
import { campaigns, completedCampaigns } from "./campaigns.js";

// The seed data is what donors see before they give, so these tests keep it
// internally consistent: every split sums to 100, stays under the statutory
// cap, respects the organizer's tier, and uses the one PLATFORM_FEE_PCT the UI
// advertises. They do NOT check the seed against the deployed vault — that
// binding lives (skipped) in stellar.test.js while PLATFORM_FEE_PCT is held at
// 2% ahead of the vault's 3% pending a redeploy. See finance.js.

describe.each(campaigns.map((c) => [c.slug, c]))("%s", (_slug, campaign) => {
  const { split, organizer } = campaign;

  test("the three shares account for the whole donation", () => {
    expect(split.beneficiary + split.creator + split.platform).toBe(100);
  });

  test("total financing stays under PP No. 29/1980's 10% cap", () => {
    expect(split.creator + split.platform).toBeLessThanOrEqual(MAX_TOTAL_FINANCING_PCT);
  });

  test("the platform share equals the one fee constant the UI advertises", () => {
    expect(split.platform).toBe(PLATFORM_FEE_PCT);
  });

  test("the creator takes no more than their tier allows", () => {
    expect(split.creator).toBeLessThanOrEqual(KYC_TIER_CEILING[organizer.tier]);
  });
});

// The creator column now makes a claim per row — "this finished, here is the
// proof" — and every row is a door to /completed/:slug. These fail if the seed
// ever stops backing that claim: an empty trail renders an empty box, a leaked
// row credits one creator with another's work, and a missing image or slug
// ships a door that opens onto nothing.
describe.each(campaigns.map((c) => [c.organizer.slug, c]))("%s trail", (slug, campaign) => {
  const history = completedCampaigns.filter((item) => item.organizerSlug === slug);

  test("has at least one finished campaign to show", () => {
    expect(history.length).toBeGreaterThan(0);
  });

  test("shows only this creator's work", () => {
    expect(history.every((item) => item.organizerSlug === campaign.organizer.slug)).toBe(true);
  });

  test("every row has the image and slug its link needs", () => {
    for (const item of history) {
      expect(item.image).toBeTruthy();
      expect(item.slug).toBeTruthy();
      expect(item.amount).toBeGreaterThan(0);
    }
  });

  // The trail header reads "N terbaru dari M". The seed only ever carries a
  // sample of a creator's finished work, and every other surface prints M — so
  // if the sample ever caught up with the claim, this page would say "4 terbaru
  // dari 2" and the claim itself would be the thing that broke.
  test("shows fewer finished campaigns than the creator claims", () => {
    expect(history.length).toBeLessThan(campaign.organizer.completed);
  });
});

// The donor voices in the creator column read campaignComments, never
// completedCampaigns[].reviews. reviews holds two hardcoded sentences shared by
// all sixteen finished campaigns, so any surface that lists them advertises its
// own testimonials as fabricated — fatal for a product whose thesis is proof.
// This fails the day someone points that block at a source that repeats itself.
test("every donor comment on a campaign says something different", () => {
  for (const campaign of campaigns) {
    const bodies = campaign.comments.map((item) => item.body);
    expect(new Set(bodies).size).toBe(bodies.length);
  }
});
