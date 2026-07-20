// Server-side writes to the Ulurin vault on Stellar testnet.
//
// This exists because a signature needs a secret key and the browser bundle is
// public. Reads live in src/lib/stellar.js and need none of this — they run in
// the client, in the APK, offline of any backend. Only the writes come here.
//
// The demo accounts are custodial on purpose, and the honest framing is that
// the donor here is OUR account, not the visitor's wallet. Donor signing moves
// to a real wallet later and replaces exactly one branch below. The admin
// release does NOT move: a creator who could release their own reward after
// uploading any 32 bytes would make the proof gate decorative, so that
// signature stays on a key the creator does not hold.

import {
  BASE_FEE,
  Contract,
  Keypair,
  Networks,
  TransactionBuilder,
  nativeToScVal,
  rpc,
  scValToNative,
} from "@stellar/stellar-sdk";

const CONTRACT_ID = "CBDQHOGSOMQ6KGROJ47ZBZOEYQP72QL4TVOEHFOZDIP3DIU3IUSAZ2E3";
const RPC_URL = "https://soroban-testnet.stellar.org";

// 10 USDC. This endpoint is unauthenticated and the demo donor's balance is
// public, so without a cap one curious visitor drains it and the demo is dead
// for everyone after them. Testnet money, real outage.
const MAX_DONATION_UNITS = 100_000_000n;

const SIGNERS = {
  donor: "ULURIN_DONOR_SECRET",
  organizer: "ULURIN_ORGANIZER_SECRET",
  admin: "ULURIN_ADMIN_SECRET",
};

// The contract's rejections are the product working, not a crash — the whole
// argument is that the rule fails before the violation. So they reach the
// caller as sentences, not as a HostError blob with an event log stapled to it.
// Keys are the discriminants in contracts/ulurin-vault/src/lib.rs.
const CONTRACT_ERRORS = {
  1: "Kontrak belum diinisialisasi.",
  2: "Jumlah harus lebih besar dari nol.",
  3: "Total pembiayaan campaign melebihi batas 10% (PP No. 29/1980 Pasal 6(1)).",
  4: "Tier kreator tidak mengizinkan imbalan sebesar itu.",
  5: "Tier tidak dikenal.",
  6: "Campaign tidak ditemukan di kontrak.",
  7: "Akun ini tidak berhak melakukan aksi tersebut.",
  8: "Saldo campaign tidak mencukupi.",
  9: "Imbalan kreator terkunci sampai bukti penyaluran diunggah.",
};

function readableError(message) {
  const code = message.match(/Error\(Contract, #(\d+)\)/)?.[1];
  return CONTRACT_ERRORS[code] ?? message.split("\n")[0];
}

function keypair(role) {
  const secret = process.env[SIGNERS[role]];
  if (!secret) throw new Error(`${SIGNERS[role]} is not configured`);
  return Keypair.fromSecret(secret);
}

async function invoke(role, method, args) {
  const kp = keypair(role);
  const server = new rpc.Server(RPC_URL);
  const account = await server.getAccount(kp.publicKey());

  const built = new TransactionBuilder(account, {
    fee: (Number(BASE_FEE) * 100).toString(),
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(new Contract(CONTRACT_ID).call(method, ...args))
    .setTimeout(60)
    .build();

  const sim = await server.simulateTransaction(built);
  if (rpc.Api.isSimulationError(sim)) {
    // Contract errors surface here rather than on-chain — the cap and the proof
    // gate both reject at simulation, before anything is submitted or paid for.
    throw new Error(sim.error);
  }

  const tx = rpc.assembleTransaction(built, sim).build();
  tx.sign(kp);
  const sent = await server.sendTransaction(tx);
  if (sent.status === "ERROR") throw new Error(JSON.stringify(sent.errorResult));

  let result = await server.getTransaction(sent.hash);
  for (let i = 0; i < 30 && result.status === "NOT_FOUND"; i += 1) {
    await new Promise((r) => setTimeout(r, 1000));
    result = await server.getTransaction(sent.hash);
  }
  if (result.status !== "SUCCESS") throw new Error(`transaction ${result.status}`);

  return {
    hash: sent.hash,
    returnValue: result.returnValue ? scValToNative(result.returnValue) : null,
  };
}

const u32 = (v) => nativeToScVal(Number(v), { type: "u32" });
const i128 = (v) => nativeToScVal(BigInt(v), { type: "i128" });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "POST only" });
  }

  const { action, campaignId, amount, proofHash } = req.body ?? {};
  const id = Number(campaignId);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "campaignId must be a positive integer" });
  }

  try {
    switch (action) {
      case "donate": {
        const units = BigInt(amount ?? 0);
        if (units <= 0n) return res.status(400).json({ error: "amount must be positive" });
        if (units > MAX_DONATION_UNITS) {
          return res.status(400).json({
            error: `demo donations are capped at ${MAX_DONATION_UNITS / 10_000_000n} USDC`,
          });
        }
        const donor = keypair("donor").publicKey();
        const out = await invoke("donor", "donate", [
          nativeToScVal(donor, { type: "address" }),
          u32(id),
          i128(units),
        ]);
        return res.status(200).json({ ...out, donor });
      }

      case "proof": {
        if (!/^[0-9a-f]{64}$/i.test(proofHash ?? "")) {
          return res.status(400).json({ error: "proofHash must be 64 hex chars (sha-256)" });
        }
        const organizer = keypair("organizer").publicKey();
        const out = await invoke("organizer", "upload_proof", [
          u32(id),
          nativeToScVal(organizer, { type: "address" }),
          nativeToScVal(Buffer.from(proofHash, "hex"), { type: "bytes" }),
        ]);
        return res.status(200).json(out);
      }

      case "release": {
        const units = BigInt(amount ?? 0);
        if (units <= 0n) return res.status(400).json({ error: "amount must be positive" });
        // No proof, no release. The contract decides that, not this handler —
        // it answers Error(Contract, #9) at simulation and we surface it.
        const out = await invoke("admin", "release_creator", [u32(id), i128(units)]);
        return res.status(200).json(out);
      }

      default:
        return res.status(400).json({ error: "action must be donate, proof, or release" });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(400).json({ error: readableError(message) });
  }
}
