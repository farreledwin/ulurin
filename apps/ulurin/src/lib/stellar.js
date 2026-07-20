// Read-only client for the Ulurin vault on Stellar testnet.
//
// Everything here is an unauthenticated simulation: no secret key, no backend,
// no signing. That is deliberate — this bundle ships to every user and to the
// Android WebView, so it must never be a place a key could live. Writes
// (donate, upload_proof, release_creator) need a signer and belong behind a
// server endpoint, not here.

// The SDK is ~450kB and only the chain panel needs it, so it is imported on
// first use instead of at module load. Without this the landing page pays for
// a library it never calls, and the gzipped bundle blows past its budget.
let sdkPromise;
const sdk = () => (sdkPromise ??= import("@stellar/stellar-sdk"));

export const CONTRACT_ID = "CBDQHOGSOMQ6KGROJ47ZBZOEYQP72QL4TVOEHFOZDIP3DIU3IUSAZ2E3";
export const RPC_URL = "https://soroban-testnet.stellar.org";

// Circle's USDC on testnet — the asset the product actually settles in. The
// vault takes its token as a constructor argument, so this is a deployment
// fact, not a code path.
export const TOKEN_ID = "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA";
const USDC_DECIMALS = 7;

/// Every campaign in the seed data maps onto this one live vault campaign. The
/// contract is real; the seven campaigns around it are not, and giving each a
/// fake on-chain counterpart would be exactly the fabrication this is meant to
/// avoid.
///
/// Campaign 3 is the current demo: created after the platform fee moved to 200
/// bps, so it settles the 93/5/2 split the UI advertises. (Campaigns 1-2 were
/// opened at the old 300 bps and keep that snapshot on chain — the vault holds
/// every campaign to the fee it was created under.)
export const CHAIN_CAMPAIGN_ID = 3;

export const contractUrl = `https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`;
export const txUrl = (hash) => `https://stellar.expert/explorer/testnet/tx/${hash}`;

// The demo's own Stellar testnet account — real and funded, so its address
// resolves on Stellar Expert (it is the source behind the vault activity the app
// shows). Displayed as the user's wallet address on the dashboard.
export const WALLET_ADDRESS = "GCJPAZVNDKXBVDQNQH7KIQN2WCYG7UICEQJT3W53MAOBHFFWIHLY65B5";
export const accountUrl = (address) => `https://stellar.expert/explorer/testnet/account/${address}`;

/// A fixed demo rate, disclosed wherever a rupiah figure meets a chain figure.
///
/// In production this is struck at the Xendit on-ramp and recorded with the
/// donation — the rate is a fact about a moment, not a constant. It is pinned
/// here because the prototype has no ramp, and a pinned-and-stated rate is
/// honest in a way that an unstated one never is. What makes A's
/// displayAmountToStroops dishonest is not that it showed rupiah; it is that it
/// mapped 1 rupiah to 1 stroop with no rate, no source, and a silent clamp.
export const DEMO_RATE_IDR_PER_USDC = 16_000;

/// Rupiah in, USDC units out, at the given rate (defaults to the fixed demo rate
/// for callers that have no live quote). The contract never sees this: the cap it
/// enforces is a ratio, and ratios survive any exchange rate. This is presentation
/// — but the SAME rate must reach both the on-chain settlement and the receipt, or
/// the receipt would misstate how much USDC actually moved.
export function rupiahToUsdcUnits(rupiah, rate = DEMO_RATE_IDR_PER_USDC) {
  return Math.round((Number(rupiah) / rate) * UNITS_PER_USDC);
}

export function usdcUnitsToRupiah(units) {
  return Math.round((Number(units) / UNITS_PER_USDC) * DEMO_RATE_IDR_PER_USDC);
}

async function post(body, fallback) {
  const response = await fetch("/api/vault", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? fallback);
  return data;
}

/// Settle a rupiah donation on testnet. Signing needs a secret key, so it
/// happens on the server — never in this bundle, which every visitor downloads.
export async function settleOnTestnet({ campaignId, rupiah, rate = DEMO_RATE_IDR_PER_USDC }) {
  return post(
    { action: "donate", campaignId, amount: String(rupiahToUsdcUnits(rupiah, rate)) },
    "Gagal mengirim ke testnet.",
  );
}

const hex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

const sha256 = async (bytes) => new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));

/// One commitment over the whole proof package: every file's bytes, plus the
/// note the reviewer will read.
///
/// It runs in the browser and only the 32-byte digest is ever sent, so the
/// files themselves never leave the creator's machine. That is what makes the
/// page's own promises true — "hash hanya menjaga integritas file" and
/// "prototype tidak mengunggah file ke server" were claims about a hash that
/// did not exist until now.
///
/// File digests are sorted before combining, so the same evidence picked in a
/// different order commits to the same hash. Otherwise re-uploading the same
/// files would look like different evidence.
export async function proofDigest(files, note) {
  const digests = await Promise.all(
    files.map(async (file) => sha256(await file.arrayBuffer())),
  );
  digests.sort((a, b) => {
    for (let i = 0; i < 32; i += 1) if (a[i] !== b[i]) return a[i] - b[i];
    return 0;
  });

  const noteBytes = new TextEncoder().encode(note ?? "");
  const combined = new Uint8Array(digests.length * 32 + noteBytes.length);
  digests.forEach((d, i) => combined.set(d, i * 32));
  combined.set(noteBytes, digests.length * 32);

  return hex(await sha256(combined));
}

/// Commit the proof on chain. The hash proves the creator cannot swap the file
/// afterwards; it proves nothing about what the file shows, which stays a
/// human's job.
export async function uploadProofOnchain({ campaignId, files, note }) {
  const digest = await proofDigest(files, note);
  const result = await post(
    { action: "proof", campaignId, proofHash: digest },
    "Gagal mengunggah bukti ke testnet.",
  );
  return { ...result, proofHash: digest };
}

/// Admin-signed by design: a creator who could release their own reward after
/// uploading any 32 bytes would make the proof gate decorative.
export async function releaseCreatorOnchain({ campaignId, units }) {
  return post(
    { action: "release", campaignId, amount: String(units) },
    "Gagal merilis imbalan.",
  );
}

// A simulated call still needs a source account to shape the envelope, but the
// transaction is never signed or submitted. Any real address does; this one is
// the deployer's, and only its public half is used.
const READ_SOURCE = WALLET_ADDRESS;

const UNITS_PER_USDC = 10 ** USDC_DECIMALS;

async function read(method, buildArgs = () => []) {
  const { Account, BASE_FEE, Contract, Networks, TransactionBuilder, rpc, scValToNative } =
    await sdk();

  const server = new rpc.Server(RPC_URL);
  const tx = new TransactionBuilder(new Account(READ_SOURCE, "0"), {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(new Contract(CONTRACT_ID).call(method, ...(await buildArgs())))
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(sim)) throw new Error(sim.error);
  return sim.result?.retval ? scValToNative(sim.result.retval) : null;
}

const u32 = async (v) => {
  const { nativeToScVal } = await sdk();
  return nativeToScVal(v, { type: "u32" });
};

/// USDC, the settlement unit. Never call this rupiah: a rupiah figure needs the
/// rate that was struck at the on-ramp, and until a donation carries that rate
/// there is nothing honest to convert with.
export function formatUsdc(units) {
  const n = Number(units ?? 0) / UNITS_PER_USDC;
  return `${n.toLocaleString("id-ID", { maximumFractionDigits: 2 })} USDC`;
}

/// The cap and the platform fee, read from the contract rather than a constant
/// typed into a component. If the contract's policy ever moves, the UI moves
/// with it instead of quietly disagreeing.
export async function getConfig() {
  const [maxTotalBps, platformBps] = await read("config");
  return { maxTotalBps: Number(maxTotalBps), platformBps: Number(platformBps) };
}

export async function getCeilingBps(tier) {
  return Number(await read("ceiling_for", async () => [await u32(tier)]));
}

export async function getCampaignState(campaignId) {
  const c = await read("campaign", async () => [await u32(campaignId)]);
  return {
    campaignId,
    organizer: String(c.organizer),
    beneficiary: String(c.beneficiary),
    creatorBps: Number(c.creator_bps),
    platformBps: Number(c.platform_bps),
    tier: Number(c.tier),
    proofUploaded: Boolean(c.proof_uploaded),
    raisedUnits: String(c.raised),
    beneficiaryAvailableUnits: String(c.beneficiary_available),
    creatorLockedUnits: String(c.creator_locked),
    platformAccruedUnits: String(c.platform_accrued),
  };
}
