// Google Identity Services (GSI) — the client half of "login Google -> wallet".
// The OAuth client id is PUBLIC by design (it identifies the app to Google; it
// is not a secret), so a repo fallback is fine — override per environment with
// VITE_GOOGLE_CLIENT_ID. The server independently verifies every token's
// audience against its own GOOGLE_CLIENT_ID, so a wrong id here fails closed.
export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "1073731117596-gdm4r3ucopg3oq00ieav4khrtiem3so0.apps.googleusercontent.com";

const GSI_SRC = "https://accounts.google.com/gsi/client";
let gsiPromise = null;

// Load the GSI script once. Resolves with google.accounts.id; rejects if the
// script cannot load (offline / blocked) so the caller can show a fallback.
export function loadGsi() {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.google?.accounts?.id) return Promise.resolve(window.google.accounts.id);
  if (gsiPromise) return gsiPromise;
  gsiPromise = new Promise((resolve, reject) => {
    // Start a fresh script for this attempt. A tag left over from a previous
    // FAILED load is inert — browsers do not re-fire load/error on a request that
    // already completed — so reusing it would leave this promise hanging forever.
    // We only reach here when gsiPromise was null (no load in flight), so any
    // existing tag is settled and safe to drop.
    document.querySelector(`script[src="${GSI_SRC}"]`)?.remove();
    const script = document.createElement("script");
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () =>
      window.google?.accounts?.id
        ? resolve(window.google.accounts.id)
        : reject(new Error("GSI loaded without accounts.id"));
    script.onerror = () => {
      gsiPromise = null; // let a later call re-issue the request
      script.remove();
      reject(new Error("GSI failed to load"));
    };
    document.head.appendChild(script);
  });
  return gsiPromise;
}
