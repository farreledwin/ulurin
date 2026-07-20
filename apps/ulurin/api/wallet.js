// Custodial per-user Stellar wallet, provisioned at Google login. Testnet demo.
//
// The key is DERIVED from a server master secret + the user's Google subject id
// (HKDF-SHA256), so the same person always lands on the same address with no
// database. ponytail: deterministic derivation avoids a keystore for the demo —
// production stores random keys in a KMS and never re-derives from an identity,
// so a rotated master secret can't strand a user's funds.
//
// SECURITY: this is a SINGLE-master-secret custodial model. `sub` is not secret,
// so if WALLET_MASTER_SECRET ever leaks, every user's key is recomputable
// offline. That is acceptable ONLY because this is testnet play money. Do not
// reuse for mainnet without per-user random keys in a KMS. Only the PUBLIC key
// ever leaves this endpoint. Nothing fires unless WALLET_MASTER_SECRET and
// GOOGLE_CLIENT_ID are set.

import crypto from "node:crypto";
import { Asset, BASE_FEE, Horizon, Keypair, Networks, Operation, TransactionBuilder } from "@stellar/stellar-sdk";

const HORIZON = "https://horizon-testnet.stellar.org";
const FRIENDBOT = "https://friendbot.stellar.org";
const GOOGLE_ISSUERS = new Set(["accounts.google.com", "https://accounts.google.com"]);

// The settlement asset: Circle's USDC on testnet, the same one the vault holds
// (DEPLOYMENTS.md). It is a classic asset, so a G-address MUST open a trustline
// before it can hold any — the issuer sets auth_required:false, so no approval is
// needed. This lets each Google account hold real USDC, shown to the user as
// Rupiah (never crypto). Testnet play money only.
const USDC_CODE = "USDC";
const USDC_ISSUER = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";
// HKDF's security rests on the master secret carrying real entropy; a short
// human-typed value silently weakens every derived key, so refuse it.
const MIN_MASTER_SECRET_LEN = 32;

export function deriveKeypair(masterSecret, sub) {
  if (!masterSecret) throw new Error("WALLET_MASTER_SECRET not set");
  if (!sub) throw new Error("sub required");
  // hkdfSync returns an ArrayBuffer; wrap it as a plain Uint8Array (not a Node
  // Buffer) so the ed25519 lib's cross-realm `instanceof Uint8Array` check holds
  // in both the jsdom test env and the Node serverless runtime.
  const seed = new Uint8Array(
    crypto.hkdfSync(
      "sha256",
      Buffer.from(masterSecret),
      Buffer.from(String(sub)), // salt: the Google subject id, stable per user
      Buffer.from("ulurin-stellar-wallet"),
      32,
    ),
  );
  return Keypair.fromRawEd25519Seed(seed);
}

// Verify a Google ID token via Google's tokeninfo endpoint, then check issuer,
// audience, subject and expiry. Every check FAILS CLOSED: a missing field
// rejects, it never passes. ponytail: tokeninfo is one network call and fine for
// a demo; a high-traffic service verifies the JWT locally against Google's JWKS.
export async function verifyGoogleToken(credential, clientId) {
  const res = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(credential));
  if (!res.ok) throw new Error("invalid Google credential");
  const payload = await res.json().catch(() => ({}));
  if (!GOOGLE_ISSUERS.has(payload.iss)) throw new Error("token issuer mismatch");
  if (payload.aud !== clientId) throw new Error("token audience mismatch");
  if (!payload.sub) throw new Error("token missing subject");
  const expMs = Number(payload.exp) * 1000;
  if (!Number.isFinite(expMs) || expMs < Date.now()) throw new Error("token expired");
  return { sub: payload.sub, email: payload.email ?? null };
}

// Allowlist gate for the demo creator dashboard: which verified Google email may
// enter as the owner. Case- and whitespace-insensitive. An unset/empty
// DEMO_OWNER_EMAIL means NOBODY is owner — the gate fails closed, never open.
export function isOwner(email, ownerEmail) {
  if (!ownerEmail || !email) return false;
  return email.trim().toLowerCase() === ownerEmail.trim().toLowerCase();
}

// Native (XLM) balance from a Horizon account object; "0" when absent so the UI
// never renders undefined. Testnet play money — for display only.
export function nativeBalanceOf(account) {
  const native = account?.balances?.find((entry) => entry.asset_type === "native");
  return native?.balance ?? "0";
}

async function readAccount(publicKey) {
  const res = await fetch(`${HORIZON}/accounts/${publicKey}`).catch(() => null);
  if (!res || !res.ok) return null;
  return res.json().catch(() => null);
}

// The account that seeds each user's USDC. An explicit ULURIN_WALLET_FUNDER_SECRET
// wins; otherwise it is derived deterministically from WALLET_MASTER_SECRET, so no
// extra secret needs managing — /api/setup-funder just tops up this derived account.
// Testnet only (same custodial-derivation caveats as deriveKeypair above).
export function funderKeypair() {
  const explicit = process.env.ULURIN_WALLET_FUNDER_SECRET;
  if (explicit) return Keypair.fromSecret(explicit);
  const master = process.env.WALLET_MASTER_SECRET;
  if (!master || master.length < MIN_MASTER_SECRET_LEN) return null;
  return deriveKeypair(master, "ulurin-usdc-funder");
}

// A signed session token so a user can authorize wallet moves AFTER login without
// re-doing Google sign-in each time. HMAC-SHA256 over {sub, exp}, keyed by the
// master secret. The settle endpoint re-derives the wallet from `sub`, so a token
// can only ever move the token-HOLDER's own funds — never an arbitrary address.
// Testnet demo horizon: 24h.
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const b64url = (buf) =>
  Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

export function mintToken(sub, now = Date.now()) {
  const master = process.env.WALLET_MASTER_SECRET;
  if (!master || !sub) return null;
  const payload = b64url(JSON.stringify({ sub: String(sub), exp: now + TOKEN_TTL_MS }));
  const sig = b64url(crypto.createHmac("sha256", master).update(payload).digest());
  return `${payload}.${sig}`;
}

// Returns the sub if the token is authentic and unexpired, else null. Fails closed
// on every check; the HMAC compare is constant-time.
export function verifyToken(token, now = Date.now()) {
  const master = process.env.WALLET_MASTER_SECRET;
  if (!master || typeof token !== "string" || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  const expected = b64url(crypto.createHmac("sha256", master).update(payload).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const { sub, exp } = JSON.parse(Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
    if (!sub || typeof exp !== "number" || exp < now) return null;
    return String(sub);
  } catch {
    return null;
  }
}

// Best-effort testnet funding. Reports funded only when the account is actually
// on-ledger or Friendbot accepted the request — a down/rate-limited bot must not
// masquerade as success. Also returns the account's real native XLM balance so
// the dashboard can show the user's own on-chain wallet, not a fabricated number.
async function ensureFunded(publicKey) {
  const existing = await readAccount(publicKey);
  if (existing) return { funded: true, xlm: nativeBalanceOf(existing) };
  const bot = await fetch(`${FRIENDBOT}?addr=${encodeURIComponent(publicKey)}`).catch(() => null);
  if (!bot || !bot.ok) return { funded: false, xlm: "0" };
  const funded = await readAccount(publicKey);
  return { funded: true, xlm: funded ? nativeBalanceOf(funded) : "0" };
}

// USDC (classic) balance from a Horizon account object: the balance string, or
// null when the account has NO USDC trustline at all (distinct from "0.0").
export function usdcBalanceOf(account) {
  const line = account?.balances?.find(
    (b) => b.asset_code === USDC_CODE && b.asset_issuer === USDC_ISSUER,
  );
  return line ? line.balance : null;
}

// Whether to send the demo USDC seed: only when the user holds none yet AND the
// funder actually has enough (a null funder balance means the pool is unset/empty).
//
// INVARIANT this relies on: the "seed only if balance is 0" test is balance-based,
// not a persisted "already seeded" flag. That is safe ONLY because nothing in this
// app can debit a user's derived wallet after seeding — there is no endpoint that
// signs an outgoing payment with the derived key, and the client never holds it.
// If a real withdraw / external-send / bridge is ever added, a user could drain
// their own wallet to 0 and re-trigger a seed on the next login: at that point
// switch this to a durable per-sub "seeded" marker (KV row or a manage_data entry
// on the account) instead of the live balance.
export function shouldSeed(currentUsdc, funderUsdc, seedUsdc) {
  if (currentUsdc !== null && Number(currentUsdc) > 0) return false;
  if (funderUsdc === null) return false;
  return Number(funderUsdc) >= Number(seedUsdc);
}

// Give the derived account a REAL USDC balance: open its trustline if missing,
// then seed it once from the funder account. Returns the USDC balance as a
// decimal string ("0" if it could not be seeded). Best-effort — each step is
// guarded so a funder that is empty/unset just leaves the account at its real
// balance. Idempotent on chain for now (a re-login re-runs no ops) — but that
// rests on the invariant documented on shouldSeed(); revisit before adding any
// path that can debit the derived wallet.
async function provisionUsdc(keypair) {
  const server = new Horizon.Server(HORIZON);
  const publicKey = keypair.publicKey();
  const usdc = new Asset(USDC_CODE, USDC_ISSUER);

  let account = await server.loadAccount(publicKey);
  let current = usdcBalanceOf(account); // null = no trustline yet
  if (current !== null && Number(current) > 0) return current; // already provisioned

  if (current === null) {
    const trustTx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase: Networks.TESTNET })
      .addOperation(Operation.changeTrust({ asset: usdc }))
      .setTimeout(60)
      .build();
    trustTx.sign(keypair);
    await server.submitTransaction(trustTx);
    current = "0";
    account = await server.loadAccount(publicKey);
  }

  const funder = funderKeypair();
  if (!funder) return current; // no funder available -> trustline only
  const seed = process.env.ULURIN_WALLET_SEED_USDC || "30";
  const funderAccount = await server.loadAccount(funder.publicKey()).catch(() => null);
  if (!funderAccount || !shouldSeed(current, usdcBalanceOf(funderAccount), seed)) return current;

  const payTx = new TransactionBuilder(funderAccount, { fee: BASE_FEE, networkPassphrase: Networks.TESTNET })
    .addOperation(Operation.payment({ destination: publicKey, asset: usdc, amount: String(seed) }))
    .setTimeout(60)
    .build();
  payTx.sign(funder);
  await server.submitTransaction(payTx);
  return String(seed);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "POST only" });
  }
  const master = process.env.WALLET_MASTER_SECRET;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!master || !clientId) {
    return res.status(503).json({ error: "wallet not configured (set WALLET_MASTER_SECRET and GOOGLE_CLIENT_ID)" });
  }
  if (master.length < MIN_MASTER_SECRET_LEN) {
    return res.status(503).json({ error: "WALLET_MASTER_SECRET too short (need >= 32 chars of entropy)" });
  }

  const { credential } = req.body ?? {};
  if (!credential) return res.status(400).json({ error: "credential (Google ID token) required" });

  // Auth first: a bad token is a 401, and we return a generic message rather
  // than echoing which check failed.
  let identity;
  try {
    identity = await verifyGoogleToken(credential, clientId);
  } catch {
    return res.status(401).json({ error: "Google sign-in could not be verified" });
  }

  // Provisioning is infra, not auth: if Friendbot is down we still return the
  // valid derived address and report funded:false honestly, not a 401.
  try {
    const keypair = deriveKeypair(master, identity.sub);
    const publicKey = keypair.publicKey();
    const { funded, xlm } = await ensureFunded(publicKey);
    // USDC provisioning is best-effort: a login must not fail because Friendbot
    // or the funder pool is having a bad day. usdc stays "0" and the user still
    // gets their address, funded honestly; the next login retries.
    let usdc = "0";
    try {
      usdc = await provisionUsdc(keypair);
    } catch {
      /* trustline/seed unavailable this time */
    }
    return res.status(200).json({
      publicKey,
      email: identity.email,
      // owner gates the demo creator dashboard; the wallet itself is provisioned
      // for any valid Google account, owner or not.
      owner: isOwner(identity.email, process.env.DEMO_OWNER_EMAIL),
      funded,
      xlm,
      usdc,
      // Session token authorizing later deposit/withdraw for THIS user's wallet.
      token: mintToken(identity.sub),
      explorer: `https://stellar.expert/explorer/testnet/account/${publicKey}`,
    });
  } catch {
    return res.status(500).json({ error: "could not provision wallet" });
  }
}
