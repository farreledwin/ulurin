"use server";

import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { supabaseAdminConfigured } from "@/lib/supabase/env";

// Preview only: no money moves. This stores a pledge so Bagibagi can notify
// donors when the real donation rail is ready.
export async function joinCirclesWaitlist(input: {
  email: string;
  circleId: string;
  locale: string;
  pesoPledge: number;
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
  const pesoPledge =
    Number.isFinite(input.pesoPledge) && input.pesoPledge >= 0
      ? Math.min(10_000_000, Math.floor(input.pesoPledge))
      : 0;
  const anonymous = Boolean(input.anonymous);
  const marketingOk = Boolean(input.marketingOk);

  if (!supabaseAdminConfigured()) {
    console.log("[bagibagi/waitlist] preview, no Supabase configured", {
      email,
      circleId,
      pesoPledge,
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
      peso_pledge: pesoPledge,
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
