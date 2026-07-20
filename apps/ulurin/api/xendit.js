// Server-side Xendit TEST-MODE calls for the Ulurin demo.
//
// This is the fiat rail: it collects Rupiah (a closed Virtual Account) and pays
// Rupiah out (Payouts v2). It NEVER touches USDC — the IDR<->USDC swap is a
// separate licensed party (an OJK exchange), not this endpoint and not Xendit.
//
// SAFETY: this endpoint is unauthenticated, so it is locked to TEST MODE in
// code — a production key (xnd_production_) is refused outright, so one
// misconfigured env var cannot turn it into an open money-transfer API. Nothing
// fires unless XENDIT_SECRET_KEY is set (503 otherwise), so an unconfigured
// deploy leaves the existing donation demo untouched.
// ponytail: add real auth + a rate limit before this ever runs live at all.

const BASE = process.env.XENDIT_API_BASE || "https://api.xendit.co";

// Per-call cap. The endpoint is unauthenticated and the sandbox balance is
// shared, so an uncapped amount lets one caller exhaust it. There is no
// cumulative/rate cap yet — acceptable only because the dev-key gate keeps this
// on test money. ponytail: add a rate limit with the auth work above.
const MAX_IDR = 100_000_000;

// Basic auth: secret key as username, EMPTY password. The trailing ":" is
// mandatory — base64("key") fails auth, base64("key:") succeeds.
export function authHeader(secret) {
  return "Basic " + Buffer.from(secret + ":").toString("base64");
}

async function xendit(method, path, body, extraHeaders = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: { Authorization: authHeader(process.env.XENDIT_SECRET_KEY), "Content-Type": "application/json", ...extraHeaders },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Log the upstream detail server-side; return a generic message so an
    // unauthenticated caller can't harvest Xendit's raw error bodies for probing.
    console.error(`Xendit ${method} ${path} -> ${res.status}`, data);
    throw new Error(`Xendit request failed (${res.status})`);
  }
  return data;
}

const isDevKey = () => (process.env.XENDIT_SECRET_KEY || "").startsWith("xnd_development_");
const nonEmptyStr = (v) => typeof v === "string" && v.trim() !== "";

// A deterministic Indonesian name from an account number, so the verified-name
// step works honestly in the prototype. The real lookup is Xendit Data Services
// / Iluma — a separate product + key not on this sandbox; used only when set.
const DEMO_NAMES = ["BUDI SANTOSO", "SITI RAHAYU", "AHMAD WIJAYA", "DEWI LESTARI", "EKO PRASETYO", "RINA MARLINA", "HENDRA GUNAWAN", "FITRI HANDAYANI"];
const demoAccountName = (accountNumber) =>
  DEMO_NAMES[String(accountNumber).split("").reduce((sum, digit) => sum + (Number(digit) || 0), 0) % DEMO_NAMES.length];
// A real JSON integer only — rejects true (Number(true)===1), "100000", arrays.
const positiveIdr = (v) => typeof v === "number" && Number.isInteger(v) && v > 0 && v <= MAX_IDR;

// Our method key -> Xendit e-wallet channel_code. NOTE: GoPay one-time is the
// bare "GOPAY" (there is no "ID_GOPAY"); the ID_ prefix applies to the others.
const EWALLET_CHANNELS = { GOPAY: "GOPAY", OVO: "ID_OVO", DANA: "ID_DANA", SHOPEEPAY: "ID_SHOPEEPAY", LINKAJA: "ID_LINKAJA" };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "POST only" });
  }
  if (!process.env.XENDIT_SECRET_KEY) {
    return res.status(503).json({ error: "Xendit not configured (set XENDIT_SECRET_KEY)" });
  }
  if (!isDevKey()) {
    return res.status(403).json({ error: "test-mode only: use an xnd_development_ key" });
  }

  const { action } = req.body ?? {};
  try {
    switch (action) {
      // ON-RAMP: a closed (fixed-amount) Virtual Account the donor "pays".
      case "create_va": {
        const { externalId, amount, bankCode } = req.body;
        if (!nonEmptyStr(externalId)) return res.status(400).json({ error: "externalId (string) required" });
        if (!positiveIdr(amount)) return res.status(400).json({ error: `amount must be an integer 1..${MAX_IDR} IDR` });
        if (bankCode !== undefined && !nonEmptyStr(bankCode)) return res.status(400).json({ error: "bankCode must be a string" });
        const va = await xendit("POST", "/callback_virtual_accounts", {
          external_id: externalId,
          bank_code: bankCode || "BRI",
          name: "ULURIN DONATION",
          is_closed: true,
          expected_amount: amount,
          is_single_use: true,
          // A real expiry so the VA card's countdown reflects Xendit, not fiction.
          expiration_date: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        });
        return res.status(200).json({
          id: va.id,
          externalId: va.external_id,
          bankCode: va.bank_code,
          accountNumber: va.account_number,
          expectedAmount: va.expected_amount,
          status: va.status,
          expiresAt: va.expiration_date ?? null,
        });
      }

      // ON-RAMP alt: a hosted Xendit checkout (Invoice) — the donor picks
      // e-wallet / card / VA on Xendit's own page, which is the honest way to
      // offer those methods without rebuilding each channel flow here.
      case "create_invoice": {
        const { externalId, amount, paymentMethods } = req.body;
        if (!nonEmptyStr(externalId)) return res.status(400).json({ error: "externalId (string) required" });
        if (!positiveIdr(amount)) return res.status(400).json({ error: `amount must be an integer 1..${MAX_IDR} IDR` });
        // Optional allow-list to make the hosted page show ONE method (e.g.
        // ["CREDIT_CARD"] -> straight to the card form, not the all-methods page).
        if (paymentMethods !== undefined && (!Array.isArray(paymentMethods) || paymentMethods.length === 0 || !paymentMethods.every((m) => typeof m === "string" && /^[A-Z_]{2,24}$/.test(m)))) {
          return res.status(400).json({ error: "paymentMethods must be a non-empty array of channel codes" });
        }
        const invoice = await xendit("POST", "/v2/invoices", {
          external_id: externalId,
          amount,
          currency: "IDR",
          description: "Ulurin wallet top up",
          ...(paymentMethods ? { payment_methods: paymentMethods } : {}),
        });
        return res.status(200).json({
          id: invoice.id,
          externalId: invoice.external_id,
          status: invoice.status,
          amount: invoice.amount,
          invoiceUrl: invoice.invoice_url,
        });
      }

      // Poll an invoice after the payer returns from the hosted page. The
      // Invoice API has no sandbox simulate endpoint; the hosted test page is
      // where a test payment happens, so status is the source of truth.
      case "invoice_status": {
        const { invoiceId } = req.body;
        if (!nonEmptyStr(invoiceId)) return res.status(400).json({ error: "invoiceId (string) required" });
        const invoice = await xendit("GET", `/v2/invoices/${encodeURIComponent(invoiceId)}`);
        return res.status(200).json({ id: invoice.id, status: invoice.status, paidAmount: invoice.paid_amount ?? null });
      }

      // ON-RAMP: a channel-SPECIFIC e-wallet charge — the honest opposite of the
      // hosted invoice. Picking OVO lands on OVO, not a generic all-methods page.
      // Each channel resolves differently: OVO pushes to the app (needs a phone,
      // no redirect), DANA/GoPay/LinkAja hand back a checkout URL to redirect to,
      // ShopeePay hands back a QR string to render. There is no e-wallet simulate
      // endpoint — in test mode OVO auto-succeeds; the redirect/QR channels settle
      // on Xendit's mock page — so the client polls ewallet_status.
      case "create_ewallet": {
        const { referenceId, amount, channel, mobileNumber, returnUrl } = req.body;
        if (!nonEmptyStr(referenceId)) return res.status(400).json({ error: "referenceId (string) required" });
        if (!positiveIdr(amount)) return res.status(400).json({ error: `amount must be an integer 1..${MAX_IDR} IDR` });
        const channelCode = EWALLET_CHANNELS[channel];
        if (!channelCode) return res.status(400).json({ error: `channel must be one of ${Object.keys(EWALLET_CHANNELS).join(", ")}` });

        let channelProperties;
        if (channelCode === "ID_OVO") {
          // OVO is push-based: the donor's registered mobile number, E.164.
          // Normalize Indonesian forms (0812…/62812…/812…) to +62812… here so the
          // charge is valid regardless of how the client formatted it.
          const digits = String(mobileNumber ?? "").replace(/\D/g, "");
          if (digits.length < 9 || digits.length > 15) return res.status(400).json({ error: "mobileNumber (E.164) required for OVO" });
          const e164 = digits.startsWith("0") ? "+62" + digits.slice(1) : digits.startsWith("62") ? "+" + digits : "+62" + digits;
          channelProperties = { mobile_number: e164 };
        } else {
          // Redirect / QR channels bounce the donor back here when they finish.
          if (!/^https?:\/\//i.test(String(returnUrl ?? ""))) return res.status(400).json({ error: "returnUrl (http/https) required" });
          channelProperties =
            channelCode === "GOPAY"
              ? { success_redirect_url: returnUrl, failure_redirect_url: returnUrl, cancel_redirect_url: returnUrl }
              : { success_redirect_url: returnUrl, failure_redirect_url: returnUrl };
        }

        // The e-wallet Charges API REQUIRES a callback URL (unlike VA/QR/Invoice):
        // without one Xendit rejects the charge with 404 CALLBACK_URL_NOT_FOUND.
        // Set it per-request via x-callback-url so it works without dashboard setup.
        const hdrs = req.headers || {};
        const callbackUrl = process.env.XENDIT_CALLBACK_URL || `https://${hdrs["x-forwarded-host"] || hdrs.host}/api/xendit-webhook`;
        const charge = await xendit(
          "POST",
          "/ewallets/charges",
          {
            reference_id: referenceId,
            currency: "IDR",
            amount,
            checkout_method: "ONE_TIME_PAYMENT",
            channel_code: channelCode,
            channel_properties: channelProperties,
          },
          { "x-callback-url": callbackUrl },
        );
        return res.status(200).json({
          id: charge.id,
          status: charge.status,
          amount: charge.charge_amount ?? amount,
          channel,
          actions: {
            // Collapse Xendit's per-channel action fields into what the UI needs:
            // one URL to redirect to, or one QR string to render.
            checkoutUrl: charge.actions?.desktop_web_checkout_url || charge.actions?.mobile_web_checkout_url || null,
            deeplinkUrl: charge.actions?.mobile_deeplink_checkout_url || null,
            qrString: charge.actions?.qr_checkout_string || null,
          },
        });
      }

      // Poll an e-wallet charge (no simulate endpoint exists for e-wallets).
      case "ewallet_status": {
        const { chargeId } = req.body;
        if (!nonEmptyStr(chargeId)) return res.status(400).json({ error: "chargeId (string) required" });
        const charge = await xendit("GET", `/ewallets/charges/${encodeURIComponent(chargeId)}`);
        return res.status(200).json({ id: charge.id, status: charge.status });
      }

      // The client needs the PUBLISHABLE key to tokenize cards with Xendit.js.
      // It is public by design (browser-safe) and can only tokenize, never charge;
      // the PAN goes browser -> Xendit and never reaches this server. Only a
      // development public key is ever returned, matching the test-mode lock.
      case "public_config": {
        const pk = process.env.XENDIT_PUBLIC_KEY || "";
        return res.status(200).json({ publicKey: pk.startsWith("xnd_public_development_") ? pk : null });
      }

      // ON-RAMP: charge a card that Xendit.js already tokenized client-side, so
      // no PAN ever hits us. capture:true = authorize + capture in one call, so
      // the status comes back synchronously (CAPTURED) with no webhook needed.
      case "card_charge": {
        const { tokenId, externalId, amount, authenticationId } = req.body;
        if (!nonEmptyStr(tokenId)) return res.status(400).json({ error: "tokenId (string) required" });
        if (!nonEmptyStr(externalId)) return res.status(400).json({ error: "externalId (string) required" });
        if (!positiveIdr(amount)) return res.status(400).json({ error: `amount must be an integer 1..${MAX_IDR} IDR` });
        if (authenticationId !== undefined && !nonEmptyStr(authenticationId)) return res.status(400).json({ error: "authenticationId must be a string" });
        const charge = await xendit("POST", "/credit_card_charges", {
          token_id: tokenId,
          external_id: externalId,
          amount,
          currency: "IDR",
          capture: true,
          ...(authenticationId ? { authentication_id: authenticationId } : {}),
        });
        return res.status(200).json({
          id: charge.id,
          status: charge.status,
          amount: charge.capture_amount ?? charge.authorized_amount ?? amount,
          maskedCard: charge.masked_card_number ?? null,
          failureReason: charge.failure_reason ?? null,
        });
      }

      // Mark the test VA paid without real money (already dev-key-gated above).
      case "simulate": {
        const { externalId, amount } = req.body;
        if (!nonEmptyStr(externalId)) return res.status(400).json({ error: "externalId (string) required" });
        if (!positiveIdr(amount)) return res.status(400).json({ error: `amount must be an integer 1..${MAX_IDR} IDR` });
        const out = await xendit(
          "POST",
          `/callback_virtual_accounts/external_id=${encodeURIComponent(externalId)}/simulate_payment`,
          { amount },
        );
        return res.status(200).json(out);
      }

      // ON-RAMP alt: a dynamic QRIS code the payer scans with any QRIS app.
      case "create_qr": {
        const { referenceId, amount } = req.body;
        if (!nonEmptyStr(referenceId)) return res.status(400).json({ error: "referenceId (string) required" });
        if (!positiveIdr(amount)) return res.status(400).json({ error: `amount must be an integer 1..${MAX_IDR} IDR` });
        const qr = await xendit(
          "POST",
          "/qr_codes",
          { reference_id: referenceId, type: "DYNAMIC", currency: "IDR", amount },
          { "api-version": "2022-07-31" },
        );
        return res.status(200).json({ id: qr.id, qrString: qr.qr_string, status: qr.status, amount: qr.amount, expiresAt: qr.expires_at ?? null });
      }

      // Mark the test QR paid (dev-key-gated above, like the VA simulate).
      case "simulate_qr": {
        const { qrId, amount } = req.body;
        if (!nonEmptyStr(qrId)) return res.status(400).json({ error: "qrId (string) required" });
        if (!positiveIdr(amount)) return res.status(400).json({ error: `amount must be an integer 1..${MAX_IDR} IDR` });
        const out = await xendit("POST", `/qr_codes/${encodeURIComponent(qrId)}/payments/simulate`, { amount }, { "api-version": "2022-07-31" });
        return res.status(200).json(out);
      }

      // Verify an account number -> the real holder name, before a payout. The
      // real lookup is Iluma (separate key); without it, a deterministic demo
      // name keeps the verified-name UX honest (client shows a "(demo)" tag).
      case "validate_account": {
        const { accountNumber, bankCode } = req.body;
        if (!/^\d{6,20}$/.test(accountNumber ?? "")) return res.status(400).json({ error: "accountNumber must be 6-20 digits" });
        if (!nonEmptyStr(bankCode)) return res.status(400).json({ error: "bankCode (string) required" });
        if (!process.env.ILUMA_API_KEY) {
          return res.status(200).json({ status: "COMPLETED", accountHolderName: demoAccountName(accountNumber), simulated: true });
        }
        const out = await fetch("https://api.iluma.ai/v1.1/identity/bank_account_data_requests", {
          method: "POST",
          headers: {
            Authorization: "Basic " + Buffer.from(process.env.ILUMA_API_KEY + ":").toString("base64"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bank_account_number: accountNumber, bank_code: bankCode, reference_id: `ulurin-nv-${Date.now()}` }),
        })
          .then((response) => response.json())
          .catch(() => ({ status: "FAILED" }));
        return res.status(200).json({ status: out.status, accountHolderName: out.result?.account_holder_name ?? null, simulated: false });
      }

      // OFF-RAMP: disburse Rupiah to a beneficiary bank account (Payouts v2).
      case "payout": {
        const { referenceId, amount, accountNumber, accountHolderName, channelCode } = req.body;
        if (!nonEmptyStr(referenceId)) return res.status(400).json({ error: "referenceId (string) required" });
        if (!nonEmptyStr(accountNumber) || !nonEmptyStr(accountHolderName)) {
          return res.status(400).json({ error: "accountNumber and accountHolderName (strings) required" });
        }
        if (channelCode !== undefined && !nonEmptyStr(channelCode)) return res.status(400).json({ error: "channelCode must be a string" });
        if (!positiveIdr(amount)) return res.status(400).json({ error: `amount must be an integer 1..${MAX_IDR} IDR` });
        const out = await xendit(
          "POST",
          "/v2/payouts",
          {
            reference_id: referenceId,
            channel_code: channelCode || "ID_BCA",
            channel_properties: { account_holder_name: accountHolderName, account_number: accountNumber },
            amount,
            currency: "IDR",
            description: "Ulurin disbursement",
          },
          // Same key + same body replays the original response instead of paying twice.
          { "Idempotency-key": referenceId },
        );
        return res.status(200).json({ id: out.id, referenceId: out.reference_id, status: out.status, amount: out.amount });
      }

      default:
        return res.status(400).json({ error: "action must be create_va, create_invoice, create_ewallet, create_qr, invoice_status, ewallet_status, public_config, card_charge, simulate, simulate_qr, validate_account, or payout" });
    }
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
}
