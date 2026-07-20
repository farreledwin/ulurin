// @vitest-environment node
import { describe, expect, it } from "vitest";
import { pickRate } from "./rate.js";

describe("pickRate (parses the Indodax ticker, fails closed)", () => {
  it("returns the last traded price as a number", () => {
    expect(pickRate({ ticker: { last: "17902", buy: "17904", sell: "17983" } })).toBe(17902);
  });
  it("returns null for a missing, zero, negative, or non-numeric price", () => {
    expect(pickRate({ ticker: {} })).toBeNull();
    expect(pickRate({ ticker: { last: "0" } })).toBeNull();
    expect(pickRate({ ticker: { last: "-5" } })).toBeNull();
    expect(pickRate({ ticker: { last: "abc" } })).toBeNull();
    expect(pickRate({})).toBeNull();
    expect(pickRate(null)).toBeNull();
  });
});
