// One-time (or top-up) setup for the Ulurin per-user USDC "funder" on Stellar
// TESTNET. The funder is the account api/wallet.js pays each new Google user's
// seed from, so its secret goes into Vercel as ULURIN_WALLET_FUNDER_SECRET.
//
// Run from apps/ulurin:
//   node tools/setup-funder.mjs            # new funder, buys 500 testnet USDC
//   node tools/setup-funder.mjs 1000       # new funder, buys 1000 USDC
//   FUNDER_SECRET=S... node tools/setup-funder.mjs 500   # top up an existing funder
//
// It generates a keypair, funds XLM via Friendbot, opens the USDC trustline, and
// swaps XLM -> USDC on the testnet DEX (Circle's faucet is DNS-blocked in ID —
// see DEPLOYMENTS.md). Everything here is testnet play money. The SECRET it prints
// is what you paste into Vercel; keep it out of git.

import { Asset, BASE_FEE, Horizon, Keypair, Networks, Operation, TransactionBuilder } from "@stellar/stellar-sdk";

const HORIZON = "https://horizon-testnet.stellar.org";
const FRIENDBOT = "https://friendbot.stellar.org";
const USDC = new Asset("USDC", "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5");
const target = String(process.argv[2] || "500"); // USDC to acquire

const server = new Horizon.Server(HORIZON);
const usdcBal = (acct) => {
  const l = acct?.balances?.find((b) => b.asset_code === "USDC" && b.asset_issuer === USDC.getIssuer());
  return l ? l.balance : null;
};
async function loadOrNull(pk) {
  try {
    return await server.loadAccount(pk);
  } catch {
    return null;
  }
}
async function submit(kp, addOps) {
  const acct = await server.loadAccount(kp.publicKey());
  const b = new TransactionBuilder(acct, { fee: String(Number(BASE_FEE) * 20), networkPassphrase: Networks.TESTNET });
  const tx = addOps(b).setTimeout(120).build();
  tx.sign(kp);
  try {
    return await server.submitTransaction(tx);
  } catch (e) {
    throw new Error(JSON.stringify(e?.response?.data?.extras?.result_codes ?? e.message));
  }
}

const kp = process.env.FUNDER_SECRET ? Keypair.fromSecret(process.env.FUNDER_SECRET) : Keypair.random();
const pk = kp.publicKey();
console.log("Funder public key:", pk);

let acct = await loadOrNull(pk);
if (!acct) {
  console.log("Funding XLM via Friendbot…");
  const r = await fetch(`${FRIENDBOT}?addr=${pk}`);
  if (!r.ok) throw new Error("friendbot failed: " + r.status);
  acct = await server.loadAccount(pk);
}
if (usdcBal(acct) === null) {
  console.log("Opening USDC trustline…");
  await submit(kp, (b) => b.addOperation(Operation.changeTrust({ asset: USDC })));
}

console.log(`Quoting XLM -> ${target} USDC on the testnet DEX…`);
const quote = await fetch(
  `${HORIZON}/paths/strict-receive?source_account=${pk}` +
    `&destination_asset_type=credit_alphanum4&destination_asset_code=USDC&destination_asset_issuer=${USDC.getIssuer()}` +
    `&destination_amount=${target}`,
).then((r) => r.json());
const best = (quote._embedded?.records ?? []).sort((a, b) => Number(a.source_amount) - Number(b.source_amount))[0];
if (!best) throw new Error("no XLM->USDC path for that amount; try a smaller target (e.g. 100)");
const sendMax = (Number(best.source_amount) * 1.2).toFixed(7); // 20% slippage buffer
console.log(`Path found: ~${best.source_amount} XLM -> ${target} USDC (sendMax ${sendMax})`);

await submit(kp, (b) =>
  b.addOperation(
    Operation.pathPaymentStrictReceive({
      sendAsset: Asset.native(),
      sendMax,
      destination: pk, // swap to self
      destAsset: USDC,
      destAmount: target,
      path: (best.path ?? []).map((p) => (p.asset_type === "native" ? Asset.native() : new Asset(p.asset_code, p.asset_issuer))),
    }),
  ),
);

const after = await server.loadAccount(pk);
console.log("\nDONE.");
console.log("USDC balance:", usdcBal(after));
console.log("XLM balance :", after.balances.find((b) => b.asset_type === "native")?.balance);
console.log("Explorer    :", `https://stellar.expert/explorer/testnet/account/${pk}`);
console.log("\n>>> Paste this into Vercel as ULURIN_WALLET_FUNDER_SECRET (keep it secret):");
console.log(kp.secret());
