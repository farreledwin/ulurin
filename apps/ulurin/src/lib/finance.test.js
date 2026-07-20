import { describe, expect, it } from "vitest";
import { calculateSplit, createDemoHash, progressPercent } from "./finance.js";

describe("calculateSplit", () => {
  it("keeps every rupiah accounted for", () => {
    const result = calculateSplit(50_000, {
      beneficiary: 90,
      creator: 5,
      platform: 5,
    });

    expect(result).toEqual({
      beneficiary: 45_000,
      creator: 2_500,
      platform: 2_500,
      total: 50_000,
    });
    expect(result.beneficiary + result.creator + result.platform).toBe(result.total);
  });

  it("gives no creator fee to a tier zero organizer", () => {
    const result = calculateSplit(100_000, {
      beneficiary: 95,
      creator: 0,
      platform: 5,
    });

    expect(result.creator).toBe(0);
    expect(result.beneficiary).toBe(95_000);
  });
});

describe("finance helpers", () => {
  it("never reports progress above one hundred percent", () => {
    expect(progressPercent(120, 100)).toBe(100);
  });

  it("creates a receipt-shaped demo hash", () => {
    expect(createDemoHash()).toMatch(/^[0-9a-f]{64}$/);
  });
});
