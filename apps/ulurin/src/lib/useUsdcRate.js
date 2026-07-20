import { useEffect, useState } from "react";
import { DEMO_RATE_IDR_PER_USDC } from "./stellar.js";

// The live USDC/IDR rate from our own /api/rate (Indodax, fetched server-side so
// CORS and the Android WebView are non-issues). Starts on the disclosed demo rate
// and swaps to the live one when it arrives — the wallet renders immediately and
// never blocks on the network. One fetch per mount; the caller shows `source`
// ("Indodax" when live, "kurs demo" on fallback) so the number is always sourced.
export function useUsdcRate() {
  const [state, setState] = useState({
    rate: DEMO_RATE_IDR_PER_USDC,
    source: "kurs demo",
    live: false,
    at: null,
  });

  useEffect(() => {
    let alive = true;
    fetch("/api/rate")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("rate " + res.status))))
      .then((data) => {
        const rate = Number(data?.rate);
        if (!alive || !Number.isFinite(rate) || rate <= 0) return;
        setState({
          rate,
          source: data.source ?? "Indodax",
          live: Boolean(data.live),
          at: data.at ?? null,
        });
      })
      .catch(() => {
        /* keep the disclosed demo fallback already in state */
      });
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
