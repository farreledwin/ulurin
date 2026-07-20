// The on-chain half of a deposit/withdraw. After the Xendit sandbox "payment"
// succeeds in the client, this moves REAL testnet USDC between the funder and the
// user's own Stellar wallet, at the live Indodax rate. This is the simulated
// on-ramp: in production the funder transfer is replaced by a licensed OJK
// exchange, but the on-chain result is genuine and checkable on Stellar Expert.
//
// Auth: a valid session token (from login) is REQUIRED. The user's wallet is
// re-derived server-side from the token's `sub`, so a request can only ever move
// the token-holder's OWN wallet — never an address the client names.

import { Asset, BASE_FEE, Horizon, Networks, Operation, TransactionBuilder } from "@stellar/stellar-sdk";
import { deriveKeypair, funderKeypair, usdcBalanceOf, verifyToken } from "./wallet.js";
import { fetchUsdcIdr } from "./rate.js";

const HORIZON = "https://horizon-testnet.stellar.org";
const USDC = new Asset("USDC", "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5");
const MIN_IDR = 10_000;
const MAX_IDR = 100_000_000;
// Anti-drain: a single demo wallet can hold at most this much USDC via deposits.
// Combined with the Google consent screen being in Testing (only allowlisted test
// users can even log in), this keeps the funder from being emptied.
//
// Accepted testnet limitation: the balance checks below are read-then-act with no
// per-user rate limit or lock, so a single allowlisted user firing many parallel
// requests could race the cap or grief the funder's XLM fees. A real fix needs a
// KV-backed lock/limit (serverless is stateless). Acceptable here because logins
// are allowlisted and it's testnet play money — revisit before any mainnet use.
const MAX_WALLET_USDC = 500;

// Rupiah -> USDC (7-dp string) at the live rate — the same conversion the wallet
// displays, so what settles matches what the user was shown.
const idrToUsdc = (idr, rate) => (Number(idr) / rate).toFixed(7);

async function submit(server, source, signer, op) {
  const tx = new TransactionBuilder(source, { fee: String(Number(BASE_FEE) * 20), networkPassphrase: Networks.TESTNET })
    .addOperation(op)
    .setTimeout(60)
    .build();
  tx.sign(signer);
  return server.submitTransaction(tx);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "POST only" });
  }
  const master = process.env.WALLET_MASTER_SECRET;
  if (!master) return res.status(503).json({ error: "wallet belum dikonfigurasi" });

  const { action, token, amount } = req.body ?? {};
  const sub = verifyToken(token);
  if (!sub) return res.status(401).json({ error: "sesi tidak valid — masuk lagi dengan Google" });
  const idr = Number(amount);
  if (!Number.isFinite(idr) || idr < MIN_IDR || idr > MAX_IDR) {
    return res.status(400).json({ error: "nominal tidak valid" });
  }
  if (action !== "deposit" && action !== "withdraw") {
    return res.status(400).json({ error: "action harus deposit atau withdraw" });
  }

  const user = deriveKeypair(master, sub);
  const funder = funderKeypair();
  if (!funder) return res.status(503).json({ error: "funder belum siap" });

  const server = new Horizon.Server(HORIZON);
  try {
    const { rate } = await fetchUsdcIdr();
    const usdc = idrToUsdc(idr, rate);
    const userAcct = await server.loadAccount(user.publicKey());
    const funderAcct = await server.loadAccount(funder.publicKey());
    const userUsdc = Number(usdcBalanceOf(userAcct) ?? "0");
    const funderUsdc = Number(usdcBalanceOf(funderAcct) ?? "0");

    if (action === "deposit") {
      if (usdcBalanceOf(userAcct) === null) {
        return res.status(409).json({ error: "wallet belum punya trustline USDC — masuk ulang dulu" });
      }
      if (userUsdc + Number(usdc) > MAX_WALLET_USDC) {
        return res.status(400).json({ error: `melebihi batas wallet demo (${MAX_WALLET_USDC} USDC)` });
      }
      if (funderUsdc < Number(usdc)) {
        return res.status(503).json({ error: "celengan USDC habis — jalankan /api/setup-funder lagi" });
      }
      const r = await submit(server, funderAcct, funder, Operation.payment({ destination: user.publicKey(), asset: USDC, amount: usdc }));
      const after = await server.loadAccount(user.publicKey());
      return res.status(200).json({ ok: true, action, usdc, rate, hash: r.hash, balance: usdcBalanceOf(after) });
    }

    // withdraw: user -> funder
    if (userUsdc < Number(usdc)) {
      return res.status(400).json({ error: "saldo USDC wallet tidak cukup" });
    }
    const r = await submit(server, userAcct, user, Operation.payment({ destination: funder.publicKey(), asset: USDC, amount: usdc }));
    const after = await server.loadAccount(user.publicKey());
    return res.status(200).json({ ok: true, action, usdc, rate, hash: r.hash, balance: usdcBalanceOf(after) });
  } catch (e) {
    const detail = e?.response?.data?.extras?.result_codes ? JSON.stringify(e.response.data.extras.result_codes) : e.message;
    return res.status(500).json({ error: "settle gagal: " + detail });
  }
}
