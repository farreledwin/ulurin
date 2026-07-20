// @vitest-environment node
// Server-side handler tests: run in Node, not the app's default jsdom env.
// (jsdom swaps in its own Uint8Array realm, which the ed25519 lib rejects.)
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import handler, { deriveKeypair, funderKeypair, isOwner, mintToken, nativeBalanceOf, shouldSeed, usdcBalanceOf, verifyGoogleToken, verifyToken } from "./wallet.js";

const now = () => Math.floor(Date.now() / 1000);
const ISS = "accounts.google.com";

describe("deriveKeypair", () => {
  it("is deterministic for the same master + sub", () => {
    expect(deriveKeypair("master", "sub-123").publicKey()).toBe(deriveKeypair("master", "sub-123").publicKey());
  });

  it("differs by sub and by master secret", () => {
    const base = deriveKeypair("m1", "sub-1").publicKey();
    expect(deriveKeypair("m1", "sub-2").publicKey()).not.toBe(base);
    expect(deriveKeypair("m2", "sub-1").publicKey()).not.toBe(base);
  });

  it("produces a valid Stellar public key", () => {
    expect(deriveKeypair("m", "s").publicKey()).toMatch(/^G[A-Z2-7]{55}$/);
  });

  it("throws without a master secret or sub", () => {
    expect(() => deriveKeypair("", "s")).toThrow();
    expect(() => deriveKeypair("m", "")).toThrow();
  });
});

describe("isOwner (allowlist fails closed)", () => {
  it("matches case- and whitespace-insensitively", () => {
    expect(isOwner("Demo@Ulurin.com", "demo@ulurin.com")).toBe(true);
    expect(isOwner("  demo@ulurin.com ", "demo@ulurin.com")).toBe(true);
  });
  it("rejects a different email", () => {
    expect(isOwner("someone@else.com", "demo@ulurin.com")).toBe(false);
  });
  it("nobody is owner when the allowlist is unset/empty", () => {
    expect(isOwner("demo@ulurin.com", "")).toBe(false);
    expect(isOwner("demo@ulurin.com", undefined)).toBe(false);
  });
  it("a missing email is never owner", () => {
    expect(isOwner(null, "demo@ulurin.com")).toBe(false);
    expect(isOwner("", "demo@ulurin.com")).toBe(false);
  });
});

describe("nativeBalanceOf", () => {
  it("returns the native balance string", () => {
    expect(nativeBalanceOf({ balances: [{ asset_type: "credit_alphanum4" }, { asset_type: "native", balance: "9999.50" }] })).toBe("9999.50");
  });
  it("returns '0' when there is no native entry or no account", () => {
    expect(nativeBalanceOf({ balances: [] })).toBe("0");
    expect(nativeBalanceOf(null)).toBe("0");
    expect(nativeBalanceOf(undefined)).toBe("0");
  });
});

describe("usdcBalanceOf", () => {
  const ISSUER = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";
  it("returns the USDC balance string when the trustline exists", () => {
    expect(usdcBalanceOf({ balances: [{ asset_type: "native", balance: "9999" }, { asset_code: "USDC", asset_issuer: ISSUER, balance: "30.0000000" }] })).toBe("30.0000000");
  });
  it("returns '0' balance (not null) when the trustline exists but is empty", () => {
    expect(usdcBalanceOf({ balances: [{ asset_code: "USDC", asset_issuer: ISSUER, balance: "0.0000000" }] })).toBe("0.0000000");
  });
  it("returns null when there is no USDC trustline (distinct from empty)", () => {
    expect(usdcBalanceOf({ balances: [{ asset_type: "native", balance: "100" }] })).toBeNull();
    expect(usdcBalanceOf({ balances: [{ asset_code: "USDC", asset_issuer: "GWRONGISSUER", balance: "5" }] })).toBeNull();
    expect(usdcBalanceOf(null)).toBeNull();
  });
});

describe("shouldSeed (idempotent + pool-guarded)", () => {
  it("seeds a fresh account (no trustline or empty) when the funder has enough", () => {
    expect(shouldSeed(null, "100", "30")).toBe(true);
    expect(shouldSeed("0.0000000", "100", "30")).toBe(true);
  });
  it("never re-seeds an account that already holds USDC (no drain on re-login)", () => {
    expect(shouldSeed("5.0000000", "100", "30")).toBe(false);
  });
  it("does not seed when the funder pool is too low or unset", () => {
    expect(shouldSeed("0", "10", "30")).toBe(false);
    expect(shouldSeed("0", null, "30")).toBe(false);
  });
});

describe("verifyGoogleToken (fails closed on every check)", () => {
  const realFetch = globalThis.fetch;
  afterEach(() => { globalThis.fetch = realFetch; });
  const respond = (payload) => { globalThis.fetch = vi.fn(async () => ({ ok: true, json: async () => payload })); };

  it("rejects a wrong issuer", async () => {
    respond({ iss: "evil.example", aud: "c", sub: "1", exp: now() + 3600 });
    await expect(verifyGoogleToken("tok", "c")).rejects.toThrow(/issuer/);
  });

  it("rejects an audience mismatch", async () => {
    respond({ iss: ISS, aud: "other", sub: "1", exp: now() + 3600 });
    await expect(verifyGoogleToken("tok", "expected-client")).rejects.toThrow(/audience/);
  });

  it("rejects a missing subject", async () => {
    respond({ iss: ISS, aud: "c", exp: now() + 3600 });
    await expect(verifyGoogleToken("tok", "c")).rejects.toThrow(/subject/);
  });

  it("rejects an expired token", async () => {
    respond({ iss: ISS, aud: "c", sub: "1", exp: now() - 10 });
    await expect(verifyGoogleToken("tok", "c")).rejects.toThrow(/expired/);
  });

  it("rejects a MISSING exp (fail closed, not open)", async () => {
    respond({ iss: ISS, aud: "c", sub: "1" });
    await expect(verifyGoogleToken("tok", "c")).rejects.toThrow(/expired/);
  });

  it("rejects a token Google refuses", async () => {
    globalThis.fetch = vi.fn(async () => ({ ok: false, json: async () => ({}) }));
    await expect(verifyGoogleToken("tok", "c")).rejects.toThrow(/invalid/);
  });

  it("returns sub + email for a valid token", async () => {
    respond({ iss: ISS, aud: "c", sub: "42", email: "a@b.c", exp: now() + 3600 });
    await expect(verifyGoogleToken("tok", "c")).resolves.toEqual({ sub: "42", email: "a@b.c" });
  });
});

describe("session token (mint/verify, fails closed)", () => {
  const good = "x".repeat(32);
  afterEach(() => { delete process.env.WALLET_MASTER_SECRET; });

  it("round-trips the sub for a valid token", () => {
    process.env.WALLET_MASTER_SECRET = good;
    expect(verifyToken(mintToken("google-sub-42"))).toBe("google-sub-42");
  });
  it("rejects a tampered payload or signature", () => {
    process.env.WALLET_MASTER_SECRET = good;
    const t = mintToken("sub-1");
    const [p, s] = t.split(".");
    expect(verifyToken(`${p}x.${s}`)).toBeNull(); // payload changed
    expect(verifyToken(`${p}.${s}x`)).toBeNull(); // sig changed
    expect(verifyToken("not-a-token")).toBeNull();
    expect(verifyToken(null)).toBeNull();
  });
  it("rejects an expired token", () => {
    process.env.WALLET_MASTER_SECRET = good;
    const past = mintToken("sub-1", Date.now() - 48 * 60 * 60 * 1000); // minted 48h ago (24h TTL)
    expect(verifyToken(past)).toBeNull();
  });
  it("cannot be forged under a different master secret", () => {
    process.env.WALLET_MASTER_SECRET = good;
    const t = mintToken("sub-1");
    process.env.WALLET_MASTER_SECRET = "y".repeat(32);
    expect(verifyToken(t)).toBeNull();
  });
  it("mints null without a master secret", () => {
    expect(mintToken("sub-1")).toBeNull();
  });
});

describe("funderKeypair (derived, deterministic, distinct)", () => {
  const good = "x".repeat(32);
  afterEach(() => { delete process.env.WALLET_MASTER_SECRET; delete process.env.ULURIN_WALLET_FUNDER_SECRET; });

  it("derives deterministically from the master secret and differs from a user wallet", () => {
    process.env.WALLET_MASTER_SECRET = good;
    const f1 = funderKeypair().publicKey();
    const f2 = funderKeypair().publicKey();
    expect(f1).toBe(f2); // deterministic
    expect(f1).not.toBe(deriveKeypair(good, "123456789").publicKey()); // not a Google-sub wallet
  });
  it("prefers an explicit ULURIN_WALLET_FUNDER_SECRET", () => {
    process.env.WALLET_MASTER_SECRET = good;
    const explicit = deriveKeypair("other-master", "funder");
    process.env.ULURIN_WALLET_FUNDER_SECRET = explicit.secret();
    expect(funderKeypair().publicKey()).toBe(explicit.publicKey());
  });
  it("returns null without a master secret", () => {
    expect(funderKeypair()).toBeNull();
  });
});

describe("wallet handler", () => {
  const realFetch = globalThis.fetch;
  const good = "x".repeat(32);
  beforeEach(() => {
    delete process.env.WALLET_MASTER_SECRET;
    delete process.env.GOOGLE_CLIENT_ID;
  });
  afterEach(() => {
    globalThis.fetch = realFetch;
    delete process.env.WALLET_MASTER_SECRET;
    delete process.env.GOOGLE_CLIENT_ID;
  });

  const mockRes = () => ({
    statusCode: 200, body: null, headers: {},
    status(c) { this.statusCode = c; return this; },
    json(b) { this.body = b; return this; },
    setHeader(k, v) { this.headers[k] = v; },
  });
  const call = async (body) => {
    const res = mockRes();
    await handler({ method: "POST", body }, res);
    return res;
  };

  it("503 when unconfigured", async () => {
    expect((await call({ credential: "t" })).statusCode).toBe(503);
  });

  it("503 when the master secret is too short", async () => {
    process.env.WALLET_MASTER_SECRET = "short";
    process.env.GOOGLE_CLIENT_ID = "c";
    expect((await call({ credential: "t" })).statusCode).toBe(503);
  });

  it("400 when no credential is sent", async () => {
    process.env.WALLET_MASTER_SECRET = good;
    process.env.GOOGLE_CLIENT_ID = "c";
    expect((await call({})).statusCode).toBe(400);
  });

  it("401 for an unverifiable token (generic message, no leak)", async () => {
    process.env.WALLET_MASTER_SECRET = good;
    process.env.GOOGLE_CLIENT_ID = "c";
    globalThis.fetch = vi.fn(async () => ({ ok: false, json: async () => ({}) }));
    const res = await call({ credential: "bad" });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).not.toMatch(/invalid Google credential/); // internal detail not echoed
  });
});
