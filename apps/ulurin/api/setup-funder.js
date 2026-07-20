// One-time setup: fund the USDC "funder" so user wallets can be seeded and
// deposits can settle. Visiting this URL once (with the right token) makes the
// derived funder friendbot its OWN XLM and swap it for testnet USDC on the DEX —
// no terminal, no secret to copy. It touches no other account, is idempotent
// (tops up only if below target), and is protected by SETUP_TOKEN (fails closed).
//
//   GET /api/setup-funder?token=YOURTOKEN[&usdc=500]

import crypto from "node:crypto";
import { Asset, BASE_FEE, Horizon, Networks, Operation, TransactionBuilder } from "@stellar/stellar-sdk";
import { funderKeypair, usdcBalanceOf } from "./wallet.js";

const HORIZON = "https://horizon-testnet.stellar.org";
const FRIENDBOT = "https://friendbot.stellar.org";
const USDC = new Asset("USDC", "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5");
const MAX_TARGET = 2000;

const explorer = (pk) => `https://stellar.expert/explorer/testnet/account/${pk}`;
// Constant-time token compare so timing can't leak the token char-by-char.
function tokenMatches(provided, expected) {
  if (typeof provided !== "string" || provided.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

export default async function handler(req, res) {
  const setupToken = process.env.SETUP_TOKEN;
  if (!setupToken) {
    return res.status(503).json({ error: "SETUP_TOKEN belum di-set di env (fail-closed). Set dulu, lalu redeploy." });
  }
  // Token also accepted via the query string so this can be a plain browser link
  // (no terminal). It's a bounded, idempotent top-up endpoint, so URL-log leakage
  // only risks resource abuse, not a drain — rotate SETUP_TOKEN after setup.
  const provided = req.query?.token ?? req.body?.token;
  if (!tokenMatches(provided, setupToken)) return res.status(401).json({ error: "token salah atau kosong" });

  const funder = funderKeypair();
  if (!funder) return res.status(503).json({ error: "WALLET_MASTER_SECRET (atau ULURIN_WALLET_FUNDER_SECRET) belum di-set" });

  const target = Math.min(Math.max(Number(req.query?.usdc ?? 500), 1), MAX_TARGET);
  const server = new Horizon.Server(HORIZON);
  const pk = funder.publicKey();

  try {
    let account = await server.loadAccount(pk).catch(() => null);
    if (!account) {
      const bot = await fetch(`${FRIENDBOT}?addr=${pk}`);
      if (!bot.ok) throw new Error("friendbot gagal");
      account = await server.loadAccount(pk);
    }

    let current = usdcBalanceOf(account); // null = no trustline yet
    if (current === null) {
      const trust = new TransactionBuilder(account, { fee: String(Number(BASE_FEE) * 20), networkPassphrase: Networks.TESTNET })
        .addOperation(Operation.changeTrust({ asset: USDC }))
        .setTimeout(60)
        .build();
      trust.sign(funder);
      await server.submitTransaction(trust);
      account = await server.loadAccount(pk);
      current = "0";
    }

    const need = target - Number(current);
    if (need <= 0) {
      return res.status(200).json({ ok: true, funder: pk, usdc: current, note: "sudah cukup didanai", explorer: explorer(pk) });
    }

    const quote = await fetch(
      `${HORIZON}/paths/strict-receive?source_account=${pk}` +
        `&destination_asset_type=credit_alphanum4&destination_asset_code=USDC&destination_asset_issuer=${USDC.getIssuer()}` +
        `&destination_amount=${need}`,
    ).then((r) => r.json());
    const best = (quote._embedded?.records ?? []).sort((a, b) => Number(a.source_amount) - Number(b.source_amount))[0];
    if (!best) throw new Error("tidak ada jalur XLM->USDC untuk jumlah itu; coba usdc lebih kecil");
    const sendMax = (Number(best.source_amount) * 1.25).toFixed(7);

    const swap = new TransactionBuilder(account, { fee: String(Number(BASE_FEE) * 20), networkPassphrase: Networks.TESTNET })
      .addOperation(
        Operation.pathPaymentStrictReceive({
          sendAsset: Asset.native(),
          sendMax,
          destination: pk,
          destAsset: USDC,
          destAmount: String(need),
          path: (best.path ?? []).map((p) => (p.asset_type === "native" ? Asset.native() : new Asset(p.asset_code, p.asset_issuer))),
        }),
      )
      .setTimeout(90)
      .build();
    swap.sign(funder);
    await server.submitTransaction(swap);

    const after = await server.loadAccount(pk);
    return res.status(200).json({ ok: true, funder: pk, usdc: usdcBalanceOf(after), explorer: explorer(pk) });
  } catch (e) {
    const detail = e?.response?.data?.extras?.result_codes ? JSON.stringify(e.response.data.extras.result_codes) : e.message;
    return res.status(500).json({ error: "setup funder gagal: " + detail });
  }
}
