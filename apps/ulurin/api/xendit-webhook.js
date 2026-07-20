// Xendit webhook receiver. Every Xendit callback carries an x-callback-token
// header — a static shared secret, not an HMAC signature. We compare it
// constant-time against XENDIT_WEBHOOK_TOKEN and reject anything else, so a
// spoofed "invoice.paid" can't trick us into releasing funds.

import crypto from "node:crypto";

export function tokenMatches(got, want) {
  if (!want) return false;
  const a = Buffer.from(String(got ?? ""));
  const b = Buffer.from(String(want));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "POST only" });
  }
  if (!tokenMatches(req.headers["x-callback-token"], process.env.XENDIT_WEBHOOK_TOKEN)) {
    return res.status(401).json({ error: "invalid callback token" });
  }

  // Xendit retries any non-2xx, so ack fast and keep it idempotent (dedupe on
  // id). Real handling — mark the donation paid, then trigger the on-chain
  // donate — hangs off this point; the demo just acknowledges.
  const event = req.body ?? {};
  return res.status(200).json({ received: true, id: event.id ?? event.external_id ?? null });
}
