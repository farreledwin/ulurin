import {
  Account,
  Address,
  BASE_FEE,
  Contract,
  Keypair,
  Networks,
  TransactionBuilder,
  nativeToScVal,
  rpc,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";

export const RPC_URL =
  process.env.STELLAR_RPC_URL ?? "https://soroban-testnet.stellar.org";
export const FRIENDBOT = "https://friendbot.stellar.org";
export const CONTRACT_ID =
  process.env.BAGIBAGI_CAMPAIGN_CONTRACT ??
  "CARFPJ3NBQJNRLVFYJKRZNSFWWXE6HPY6FOMUVK4AU5BZWSP6LESG3EA";
export const TOKEN_ID =
  process.env.BAGIBAGI_TOKEN_CONTRACT ??
  "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";
export const DEFAULT_CAMPAIGN_ID = Number(
  process.env.BAGIBAGI_DEFAULT_CAMPAIGN_ID ?? "1",
);

const MAX_TESTNET_STROOPS = 10_000_000;

export type OnchainResult =
  | { ok: true; hash: string; link: string; value: unknown }
  | { ok: false; error: string };

export type OnchainCampaignState = {
  id: number;
  contractId: string;
  tokenId: string;
  explorer: string;
  organizer: string;
  beneficiary: string;
  allowanceBps: number;
  allowancePct: number;
  tier: number;
  raisedStroops: string;
  beneficiaryAvailableStroops: string;
  allowanceEscrowStroops: string;
  proofUploaded: boolean;
};

export function testnetReady() {
  return Boolean(
    process.env.BAGIBAGI_ADMIN_SECRET &&
      process.env.BAGIBAGI_ORGANIZER_SECRET &&
      process.env.BAGIBAGI_DONOR_SECRET &&
      process.env.BAGIBAGI_BENEFICIARY_SECRET,
  );
}

export function publicKeys() {
  return {
    admin: keypair("BAGIBAGI_ADMIN_SECRET").publicKey(),
    organizer: keypair("BAGIBAGI_ORGANIZER_SECRET").publicKey(),
    donor: keypair("BAGIBAGI_DONOR_SECRET").publicKey(),
    beneficiary: keypair("BAGIBAGI_BENEFICIARY_SECRET").publicKey(),
  };
}

export async function fundDemoAccounts() {
  const keys = publicKeys();
  await Promise.all(
    Object.values(keys).map((pub) =>
      fetch(`${FRIENDBOT}/?addr=${pub}`, { cache: "no-store" }).catch(() => null),
    ),
  );
  return keys;
}

export async function setOrganizerTier(tier: number): Promise<OnchainResult> {
  const organizer = keypair("BAGIBAGI_ORGANIZER_SECRET").publicKey();
  return invoke("BAGIBAGI_ADMIN_SECRET", "set_tier", [
    sc.addr(organizer),
    sc.u32(clampTier(tier)),
  ]);
}

export async function createCampaignOnchain(
  allowancePct: number,
  tier: number,
): Promise<OnchainResult> {
  const organizer = keypair("BAGIBAGI_ORGANIZER_SECRET").publicKey();
  const beneficiary = keypair("BAGIBAGI_BENEFICIARY_SECRET").publicKey();
  const tierResult = await setOrganizerTier(tier);
  if (!tierResult.ok) return tierResult;
  return invoke("BAGIBAGI_ORGANIZER_SECRET", "create_campaign", [
    sc.addr(organizer),
    sc.addr(beneficiary),
    sc.u32(Math.max(0, Math.min(1_000, Math.round(allowancePct * 100)))),
  ]);
}

export async function donateOnchain(
  campaignId: number,
  displayAmount: number,
): Promise<OnchainResult> {
  const donor = keypair("BAGIBAGI_DONOR_SECRET").publicKey();
  return invoke("BAGIBAGI_DONOR_SECRET", "donate", [
    sc.addr(donor),
    sc.u32(safeCampaignId(campaignId)),
    sc.i128(displayAmountToStroops(displayAmount)),
  ]);
}

export async function withdrawBeneficiaryOnchain(
  campaignId: number,
): Promise<OnchainResult> {
  const state = await getCampaignState(campaignId);
  const amount = BigInt(state.beneficiaryAvailableStroops);
  if (amount <= 0n) return { ok: false, error: "No beneficiary balance to withdraw." };
  const beneficiary = keypair("BAGIBAGI_BENEFICIARY_SECRET").publicKey();
  return invoke("BAGIBAGI_BENEFICIARY_SECRET", "withdraw_beneficiary", [
    sc.u32(safeCampaignId(campaignId)),
    sc.addr(beneficiary),
    sc.i128(amount),
  ]);
}

export async function uploadProofOnchain(
  campaignId: number,
  proofText: string,
): Promise<OnchainResult> {
  const { createHash } = await import("node:crypto");
  const organizer = keypair("BAGIBAGI_ORGANIZER_SECRET").publicKey();
  const proof = createHash("sha256")
    .update(proofText || `bagibagi-proof-${Date.now()}`)
    .digest();
  return invoke("BAGIBAGI_ORGANIZER_SECRET", "upload_proof", [
    sc.u32(safeCampaignId(campaignId)),
    sc.addr(organizer),
    sc.bytes(proof),
  ]);
}

export async function releaseAllowanceOnchain(
  campaignId: number,
): Promise<OnchainResult> {
  const state = await getCampaignState(campaignId);
  const amount = BigInt(state.allowanceEscrowStroops);
  if (amount <= 0n) return { ok: false, error: "No allowance escrow to release." };
  return invoke("BAGIBAGI_ADMIN_SECRET", "release_allowance", [
    sc.u32(safeCampaignId(campaignId)),
    sc.i128(amount),
  ]);
}

export async function getCampaignState(
  campaignId = DEFAULT_CAMPAIGN_ID,
): Promise<OnchainCampaignState> {
  const raw = (await readContract("campaign", [
    sc.u32(safeCampaignId(campaignId)),
  ])) as Record<string, unknown>;
  const allowanceBps = Number(raw.allowance_bps ?? 0);
  return {
    id: safeCampaignId(campaignId),
    contractId: CONTRACT_ID,
    tokenId: TOKEN_ID,
    explorer: `https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`,
    organizer: String(raw.organizer ?? ""),
    beneficiary: String(raw.beneficiary ?? ""),
    allowanceBps,
    allowancePct: allowanceBps / 100,
    tier: Number(raw.tier ?? 0),
    raisedStroops: amountString(raw.raised),
    beneficiaryAvailableStroops: amountString(raw.beneficiary_available),
    allowanceEscrowStroops: amountString(raw.allowance_escrow),
    proofUploaded: Boolean(raw.proof_uploaded),
  };
}

function keypair(envKey: string): Keypair {
  const secret = process.env[envKey];
  if (!secret) throw new Error(`${envKey} missing in .env.local`);
  return Keypair.fromSecret(secret);
}

function server() {
  return new rpc.Server(RPC_URL);
}

async function readContract(method: string, args: xdr.ScVal[] = []) {
  const srv = server();
  const source = new Account(publicKeys().admin, "0");
  const tx = new TransactionBuilder(source, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(new Contract(CONTRACT_ID).call(method, ...args))
    .setTimeout(30)
    .build();
  const sim = await srv.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(sim)) throw new Error(sim.error);
  const ret = (sim as rpc.Api.SimulateTransactionSuccessResponse).result?.retval;
  return ret ? scValToNative(ret) : null;
}

async function invoke(
  signerEnv: string,
  method: string,
  args: xdr.ScVal[] = [],
): Promise<OnchainResult> {
  try {
    const srv = server();
    const kp = keypair(signerEnv);
    const source = await srv.getAccount(kp.publicKey());
    const built = new TransactionBuilder(source, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(new Contract(CONTRACT_ID).call(method, ...args))
      .setTimeout(60)
      .build();
    const prepared = await srv.prepareTransaction(built);
    prepared.sign(kp);
    const sent = await srv.sendTransaction(prepared);
    if (sent.status === "ERROR") {
      return { ok: false, error: JSON.stringify(sent.errorResult ?? sent) };
    }

    let tx = await srv.getTransaction(sent.hash);
    for (let i = 0; i < 30 && tx.status === "NOT_FOUND"; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      tx = await srv.getTransaction(sent.hash);
    }
    if (tx.status !== "SUCCESS") return { ok: false, error: `tx ${tx.status}` };
    return {
      ok: true,
      hash: sent.hash,
      link: txLink(sent.hash),
      value: tx.returnValue != null ? scValToNative(tx.returnValue) : null,
    };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

function displayAmountToStroops(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) return 1n;
  return BigInt(Math.min(MAX_TESTNET_STROOPS, Math.max(1, Math.round(amount))));
}

function safeCampaignId(campaignId: number) {
  return Math.max(1, Math.min(4_294_967_295, Math.floor(campaignId || 1)));
}

function clampTier(tier: number) {
  return Math.max(0, Math.min(2, Math.floor(tier || 0)));
}

function amountString(value: unknown) {
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "number") return String(Math.trunc(value));
  if (typeof value === "string") return value;
  return "0";
}

export const sc = {
  addr: (a: string) => new Address(a).toScVal(),
  i128: (v: bigint) => nativeToScVal(v, { type: "i128" }),
  u32: (v: number) => nativeToScVal(v, { type: "u32" }),
  bytes: (v: Buffer) => xdr.ScVal.scvBytes(v),
};

export const txLink = (hash: string) =>
  `https://stellar.expert/explorer/testnet/tx/${hash}`;
