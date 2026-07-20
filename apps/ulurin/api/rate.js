// Live USDC -> IDR rate from Indodax's public ticker. No API key: this is public
// market data. Indodax is OJK-registered, the same kind of licensed exchange the
// app names as its on-ramp partner, so the rate a donor sees matches where a real
// conversion would happen.
//
// Served through our own origin (not fetched from the browser) so the Android
// WebView and CORS are non-issues, cached briefly to be a good ticker citizen,
// and backed by a DISCLOSED fixed fallback — the wallet never shows a blank or a
// fabricated number, and it always says which of the two it is showing.

const INDODAX_TICKER = "https://indodax.com/api/ticker/usdc_idr";
// The app's long-standing demo rate. Used ONLY when Indodax is unreachable, and
// always labelled as the fallback so it is never mistaken for a live quote.
const FALLBACK_RATE = 16000;
const CACHE_MS = 60_000;

let cache = null; // { payload, fetchedAt }

// Pure: pull a sane positive number out of the ticker, or null. Kept separate so
// the parsing is unit-tested without a network.
export function pickRate(data) {
  const last = Number(data?.ticker?.last);
  return Number.isFinite(last) && last > 0 ? last : null;
}

export async function fetchUsdcIdr(now = Date.now()) {
  if (cache && now - cache.fetchedAt < CACHE_MS) return cache.payload;
  try {
    const res = await fetch(INDODAX_TICKER, { headers: { "User-Agent": "ulurin/1.0" } });
    if (!res.ok) throw new Error("indodax " + res.status);
    const data = await res.json();
    const rate = pickRate(data);
    if (rate === null) throw new Error("ticker missing a usable last price");
    const at = Number(data?.ticker?.server_time) * 1000;
    const payload = {
      rate,
      source: "Indodax",
      pair: "USDC/IDR",
      at: Number.isFinite(at) ? at : now,
      live: true,
    };
    cache = { payload, fetchedAt: now };
    return payload;
  } catch {
    // A stale-but-real quote beats the fixed fallback; mark it not-live either way.
    if (cache) return { ...cache.payload, live: false };
    return { rate: FALLBACK_RATE, source: "kurs demo", pair: "USDC/IDR", at: null, live: false };
  }
}

export default async function handler(req, res) {
  const payload = await fetchUsdcIdr();
  // Let the CDN hold it briefly too, so a burst of dashboards shares one quote.
  res.setHeader("Cache-Control", "public, max-age=30");
  return res.status(200).json(payload);
}
