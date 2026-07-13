"use server";

import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { supabaseAdminConfigured } from "@/lib/supabase/env";
import {
  DEFAULT_CAMPAIGN_ID,
  CONTRACT_ID,
  TOKEN_ID,
  createCampaignOnchain,
  donateOnchain,
  fundDemoAccounts,
  getCampaignState,
  releaseAllowanceOnchain,
  testnetReady,
  uploadProofOnchain,
  withdrawBeneficiaryOnchain,
} from "@/lib/server/bagibagi";

// Preview only: no money moves. This stores a pledge so Bagibagi can notify
// donors when the real donation rail is ready.
export async function joinCirclesWaitlist(input: {
  email: string;
  circleId: string;
  locale: string;
  rupiahPledge: number;
  anonymous: boolean;
  marketingOk: boolean;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Invalid request." };
  }

  const email = (input.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email." };
  }
  if (email.length > 200) return { ok: false, error: "Email is too long." };

  const circleId =
    typeof input.circleId === "string" && input.circleId.length <= 120
      ? input.circleId
      : null;
  const locale =
    typeof input.locale === "string" && input.locale.length <= 8
      ? input.locale
      : null;
  const rupiahPledge =
    Number.isFinite(input.rupiahPledge) && input.rupiahPledge >= 0
      ? Math.min(10_000_000_000, Math.floor(input.rupiahPledge))
      : 0;
  const anonymous = Boolean(input.anonymous);
  const marketingOk = Boolean(input.marketingOk);

  if (!supabaseAdminConfigured()) {
    console.log("[bagibagi/waitlist] preview, no Supabase configured", {
      email,
      circleId,
      rupiahPledge,
      anonymous,
      marketingOk,
      locale,
    });
    return { ok: true };
  }

  try {
    const admin = createSupabaseAdmin();
    const { error } = await admin.from("circles_waitlist").insert({
      email,
      circle_id: circleId,
      rupiah_pledge: rupiahPledge,
      anonymous,
      marketing_ok: marketingOk,
      locale,
    });
    if (error) {
      console.error("[bagibagi/waitlist] insert failed:", error.message);
      return { ok: false, error: "Couldn't save right now. Please try again." };
    }
    return { ok: true };
  } catch (error) {
    console.error("[bagibagi/waitlist] unexpected error:", error);
    return { ok: false, error: "Couldn't save right now. Please try again." };
  }
}

export async function bagibagiTestnetConfig() {
  return {
    ready: testnetReady(),
    contractId: CONTRACT_ID,
    tokenId: TOKEN_ID,
    defaultCampaignId: DEFAULT_CAMPAIGN_ID,
    explorer: `https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`,
  };
}

export async function bagibagiFundDemoAccounts() {
  try {
    const keys = await fundDemoAccounts();
    return { ok: true as const, keys };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function bagibagiGetCampaign(campaignId = DEFAULT_CAMPAIGN_ID) {
  try {
    return { ok: true as const, state: await getCampaignState(campaignId) };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function bagibagiCreateCampaign(input: {
  allowancePct: number;
  tier: number;
}) {
  return createCampaignOnchain(input.allowancePct, input.tier);
}

export async function bagibagiDonate(input: {
  campaignId: number;
  displayAmount: number;
}) {
  return donateOnchain(input.campaignId, input.displayAmount);
}

export async function bagibagiWithdrawBeneficiary(campaignId = DEFAULT_CAMPAIGN_ID) {
  return withdrawBeneficiaryOnchain(campaignId);
}

export async function bagibagiUploadProof(input: {
  campaignId: number;
  proofText: string;
}) {
  return uploadProofOnchain(input.campaignId, input.proofText);
}

export async function bagibagiReleaseAllowance(campaignId = DEFAULT_CAMPAIGN_ID) {
  return releaseAllowanceOnchain(campaignId);
}
