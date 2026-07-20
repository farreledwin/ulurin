// @vitest-environment node
// Server-side handler tests: run in Node, not the app's default jsdom env.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import handler, { authHeader } from "./xendit.js";
import { tokenMatches } from "./xendit-webhook.js";

function mockRes() {
  return {
    statusCode: 200,
    body: null,
    headers: {},
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
    setHeader(key, value) { this.headers[key] = value; },
  };
}

const call = async (body) => {
  const res = mockRes();
  await handler({ method: "POST", body }, res);
  return res;
};

describe("authHeader", () => {
  it("uses Basic auth with a trailing colon (empty password)", () => {
    const decoded = Buffer.from(authHeader("xnd_development_abc").slice(6), "base64").toString();
    expect(decoded).toBe("xnd_development_abc:");
  });
});

describe("xendit handler", () => {
  const realFetch = globalThis.fetch;
  beforeEach(() => { delete process.env.XENDIT_SECRET_KEY; });
  afterEach(() => {
    globalThis.fetch = realFetch;
    delete process.env.XENDIT_SECRET_KEY;
    delete process.env.XENDIT_PUBLIC_KEY;
  });

  it("answers 503 when the key is not configured", async () => {
    expect((await call({ action: "create_va" })).statusCode).toBe(503);
  });

  it("refuses ANY action for a production key (test-mode only)", async () => {
    process.env.XENDIT_SECRET_KEY = "xnd_production_key";
    expect((await call({ action: "create_va", externalId: "d1", amount: 100000 })).statusCode).toBe(403);
    expect((await call({ action: "payout", referenceId: "p1", amount: 93000, accountNumber: "1", accountHolderName: "Y" })).statusCode).toBe(403);
    expect((await call({ action: "simulate", externalId: "d1", amount: 100000 })).statusCode).toBe(403);
  });

  it("create_va posts a closed VA carrying the Basic auth header", async () => {
    process.env.XENDIT_SECRET_KEY = "xnd_development_key";
    let seen;
    globalThis.fetch = vi.fn(async (url, opts) => {
      seen = { url, opts };
      return { ok: true, json: async () => ({ id: "va_1", external_id: "d1", bank_code: "BRI", account_number: "8808", expected_amount: 100000, status: "PENDING" }) };
    });
    const res = await call({ action: "create_va", externalId: "d1", amount: 100000 });
    expect(res.statusCode).toBe(200);
    expect(seen.url).toBe("https://api.xendit.co/callback_virtual_accounts");
    expect(seen.opts.headers.Authorization).toBe(authHeader("xnd_development_key"));
    expect(JSON.parse(seen.opts.body)).toMatchObject({ external_id: "d1", is_closed: true, expected_amount: 100000 });
  });

  it("payout posts to /v2/payouts with an Idempotency-key", async () => {
    process.env.XENDIT_SECRET_KEY = "xnd_development_key";
    let seen;
    globalThis.fetch = vi.fn(async (url, opts) => {
      seen = { url, opts };
      return { ok: true, json: async () => ({ id: "po_1", reference_id: "p1", status: "ACCEPTED", amount: 93000 }) };
    });
    const res = await call({ action: "payout", referenceId: "p1", amount: 93000, accountNumber: "123", accountHolderName: "Yayasan" });
    expect(res.statusCode).toBe(200);
    expect(seen.url).toBe("https://api.xendit.co/v2/payouts");
    expect(seen.opts.headers["Idempotency-key"]).toBe("p1");
  });

  it("create_invoice posts to /v2/invoices and maps invoice_url", async () => {
    process.env.XENDIT_SECRET_KEY = "xnd_development_key";
    let seen;
    globalThis.fetch = vi.fn(async (url, opts) => {
      seen = { url, opts };
      return { ok: true, json: async () => ({ id: "inv-1", external_id: "i1", status: "PENDING", amount: 100000, invoice_url: "https://checkout-staging.xendit.co/web/inv-1" }) };
    });
    const res = await call({ action: "create_invoice", externalId: "i1", amount: 100000 });
    expect(res.statusCode).toBe(200);
    expect(seen.url).toBe("https://api.xendit.co/v2/invoices");
    expect(res.body.invoiceUrl).toContain("checkout");
  });

  it("create_invoice forwards a payment_methods allow-list (card-only page)", async () => {
    process.env.XENDIT_SECRET_KEY = "xnd_development_key";
    let seen;
    globalThis.fetch = vi.fn(async (url, opts) => {
      seen = { url, opts };
      return { ok: true, json: async () => ({ id: "inv-2", external_id: "i2", status: "PENDING", amount: 250000, invoice_url: "https://checkout-staging.xendit.co/web/inv-2" }) };
    });
    const res = await call({ action: "create_invoice", externalId: "i2", amount: 250000, paymentMethods: ["CREDIT_CARD"] });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(seen.opts.body).payment_methods).toEqual(["CREDIT_CARD"]);
  });

  it("create_invoice rejects a malformed payment_methods list", async () => {
    process.env.XENDIT_SECRET_KEY = "xnd_development_key";
    expect((await call({ action: "create_invoice", externalId: "i3", amount: 250000, paymentMethods: [] })).statusCode).toBe(400);
    expect((await call({ action: "create_invoice", externalId: "i3", amount: 250000, paymentMethods: "CREDIT_CARD" })).statusCode).toBe(400);
    expect((await call({ action: "create_invoice", externalId: "i3", amount: 250000, paymentMethods: ["<script>"] })).statusCode).toBe(400);
  });

  it("invoice_status GETs the invoice by id", async () => {
    process.env.XENDIT_SECRET_KEY = "xnd_development_key";
    let seen;
    globalThis.fetch = vi.fn(async (url, opts) => {
      seen = { url, opts };
      return { ok: true, json: async () => ({ id: "inv-1", status: "PAID", paid_amount: 100000 }) };
    });
    const res = await call({ action: "invoice_status", invoiceId: "inv-1" });
    expect(res.statusCode).toBe(200);
    expect(seen.url).toBe("https://api.xendit.co/v2/invoices/inv-1");
    expect(seen.opts.method).toBe("GET");
    expect(res.body.status).toBe("PAID");
  });

  it("create_qr posts to /qr_codes with the api-version header", async () => {
    process.env.XENDIT_SECRET_KEY = "xnd_development_key";
    let seen;
    globalThis.fetch = vi.fn(async (url, opts) => {
      seen = { url, opts };
      return { ok: true, json: async () => ({ id: "qr_1", qr_string: "00020101…", status: "ACTIVE", amount: 50000, expires_at: "2026-07-20T00:00:00Z" }) };
    });
    const res = await call({ action: "create_qr", referenceId: "q1", amount: 50000 });
    expect(res.statusCode).toBe(200);
    expect(seen.url).toBe("https://api.xendit.co/qr_codes");
    expect(seen.opts.headers["api-version"]).toBe("2022-07-31");
    expect(res.body.qrString).toBe("00020101…");
  });

  it("create_ewallet posts an OVO charge with mobile_number and maps actions", async () => {
    process.env.XENDIT_SECRET_KEY = "xnd_development_key";
    let seen;
    globalThis.fetch = vi.fn(async (url, opts) => {
      seen = { url, opts };
      return { ok: true, json: async () => ({ id: "ewc_1", status: "PENDING", charge_amount: 100000, actions: {} }) };
    });
    const res = await call({ action: "create_ewallet", referenceId: "e1", amount: 100000, channel: "OVO", mobileNumber: "0812345678" });
    expect(res.statusCode).toBe(200);
    expect(seen.url).toBe("https://api.xendit.co/ewallets/charges");
    const body = JSON.parse(seen.opts.body);
    expect(body.channel_code).toBe("ID_OVO");
    expect(body.channel_properties.mobile_number).toBe("+62812345678"); // 0-prefixed -> E.164
    expect(res.body.id).toBe("ewc_1");
  });

  it("create_ewallet maps GoPay to the bare GOPAY code and forwards the checkout URL", async () => {
    process.env.XENDIT_SECRET_KEY = "xnd_development_key";
    let seen;
    globalThis.fetch = vi.fn(async (url, opts) => {
      seen = { url, opts };
      return { ok: true, json: async () => ({ id: "ewc_2", status: "PENDING", actions: { mobile_web_checkout_url: "https://ewallet-mock-connector.xendit.co/gopay/ewc_2" } }) };
    });
    const res = await call({ action: "create_ewallet", referenceId: "e2", amount: 50000, channel: "GOPAY", returnUrl: "https://ulurin-test.vercel.app/dashboard" });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(seen.opts.body).channel_code).toBe("GOPAY"); // NOT ID_GOPAY
    expect(seen.opts.headers["x-callback-url"]).toBeTruthy(); // e-wallet API requires a callback URL
    expect(res.body.actions.checkoutUrl).toContain("gopay");
  });

  it("create_ewallet requires mobileNumber for OVO and returnUrl for redirect channels", async () => {
    process.env.XENDIT_SECRET_KEY = "xnd_development_key";
    expect((await call({ action: "create_ewallet", referenceId: "e3", amount: 50000, channel: "OVO" })).statusCode).toBe(400);
    expect((await call({ action: "create_ewallet", referenceId: "e4", amount: 50000, channel: "DANA" })).statusCode).toBe(400);
    expect((await call({ action: "create_ewallet", referenceId: "e5", amount: 50000, channel: "NOPE", returnUrl: "https://x.co" })).statusCode).toBe(400);
  });

  it("public_config returns the publishable key only when it's a dev public key", async () => {
    process.env.XENDIT_SECRET_KEY = "xnd_development_key";
    process.env.XENDIT_PUBLIC_KEY = "xnd_public_development_abc";
    expect((await call({ action: "public_config" })).body.publicKey).toBe("xnd_public_development_abc");
    process.env.XENDIT_PUBLIC_KEY = "xnd_public_production_abc"; // wrong mode -> withheld
    expect((await call({ action: "public_config" })).body.publicKey).toBe(null);
    delete process.env.XENDIT_PUBLIC_KEY;
    expect((await call({ action: "public_config" })).body.publicKey).toBe(null);
  });

  it("card_charge posts a tokenized charge to /credit_card_charges with capture", async () => {
    process.env.XENDIT_SECRET_KEY = "xnd_development_key";
    let seen;
    globalThis.fetch = vi.fn(async (url, opts) => {
      seen = { url, opts };
      return { ok: true, json: async () => ({ id: "chg_1", status: "CAPTURED", capture_amount: 250000, masked_card_number: "400000XXXXXX1000" }) };
    });
    const res = await call({ action: "card_charge", tokenId: "tok_1", externalId: "c1", amount: 250000 });
    expect(res.statusCode).toBe(200);
    expect(seen.url).toBe("https://api.xendit.co/credit_card_charges");
    const body = JSON.parse(seen.opts.body);
    expect(body).toMatchObject({ token_id: "tok_1", external_id: "c1", amount: 250000, capture: true });
    expect(body.authentication_id).toBeUndefined(); // omitted for single-use tokens
    expect(res.body).toMatchObject({ status: "CAPTURED", maskedCard: "400000XXXXXX1000" });
  });

  it("card_charge rejects a missing token", async () => {
    process.env.XENDIT_SECRET_KEY = "xnd_development_key";
    expect((await call({ action: "card_charge", externalId: "c1", amount: 250000 })).statusCode).toBe(400);
  });

  it("ewallet_status GETs the charge by id", async () => {
    process.env.XENDIT_SECRET_KEY = "xnd_development_key";
    let seen;
    globalThis.fetch = vi.fn(async (url, opts) => {
      seen = { url, opts };
      return { ok: true, json: async () => ({ id: "ewc_1", status: "SUCCEEDED" }) };
    });
    const res = await call({ action: "ewallet_status", chargeId: "ewc_1" });
    expect(res.statusCode).toBe(200);
    expect(seen.url).toBe("https://api.xendit.co/ewallets/charges/ewc_1");
    expect(seen.opts.method).toBe("GET");
    expect(res.body.status).toBe("SUCCEEDED");
  });

  it("validate_account returns a deterministic demo name without an Iluma key", async () => {
    process.env.XENDIT_SECRET_KEY = "xnd_development_key";
    delete process.env.ILUMA_API_KEY;
    const a = await call({ action: "validate_account", accountNumber: "1234567890", bankCode: "ID_BCA" });
    const b = await call({ action: "validate_account", accountNumber: "1234567890", bankCode: "ID_BCA" });
    expect(a.statusCode).toBe(200);
    expect(a.body).toMatchObject({ status: "COMPLETED", simulated: true });
    expect(a.body.accountHolderName).toBe(b.body.accountHolderName); // deterministic
    expect(a.body.accountHolderName).toMatch(/^[A-Z ]+$/);
  });

  it("validate_account rejects a non-numeric / short account", async () => {
    process.env.XENDIT_SECRET_KEY = "xnd_development_key";
    expect((await call({ action: "validate_account", accountNumber: "abc", bankCode: "ID_BCA" })).statusCode).toBe(400);
    expect((await call({ action: "validate_account", accountNumber: "123", bankCode: "ID_BCA" })).statusCode).toBe(400);
  });

  it("rejects non-integer, coercible, and over-cap amounts", async () => {
    process.env.XENDIT_SECRET_KEY = "xnd_development_key";
    expect((await call({ action: "create_va", externalId: "d1", amount: 999_999_999 })).statusCode).toBe(400);
    expect((await call({ action: "create_va", externalId: "d1", amount: true })).statusCode).toBe(400);
    expect((await call({ action: "create_va", externalId: "d1", amount: "100000" })).statusCode).toBe(400);
    expect((await call({ action: "create_va", externalId: "d1", amount: 0 })).statusCode).toBe(400);
  });

  it("rejects missing / non-string identifiers", async () => {
    process.env.XENDIT_SECRET_KEY = "xnd_development_key";
    expect((await call({ action: "create_va", amount: 100000 })).statusCode).toBe(400);
    expect((await call({ action: "payout", referenceId: 123, amount: 1000, accountNumber: "1", accountHolderName: "Y" })).statusCode).toBe(400);
  });
});

describe("xendit webhook token check", () => {
  it("matches only the exact token", () => {
    expect(tokenMatches("abc", "abc")).toBe(true);
    expect(tokenMatches("abc", "abd")).toBe(false);
    expect(tokenMatches("ab", "abc")).toBe(false);
    expect(tokenMatches("", "abc")).toBe(false);
    expect(tokenMatches("abc", "")).toBe(false);
    expect(tokenMatches("abc", undefined)).toBe(false);
  });
});
