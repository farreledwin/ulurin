import { useEffect, useRef, useState } from "react";
import { GOOGLE_CLIENT_ID, loadGsi } from "../lib/googleAuth.js";

// Renders Google's own "Continue with Google" button and hands the raw
// credential (a signed id_token) up to onCredential. Verification is the
// server's job (api/wallet.js) — this component never trusts the token itself.
// onCredential is read through a ref so a changing handler identity does not
// re-initialize GSI or re-render the button.
export function GoogleSignInButton({ onCredential, theme = "outline" }) {
  const holder = useRef(null);
  const handler = useRef(onCredential);
  handler.current = onCredential;
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    loadGsi()
      .then((id) => {
        if (cancelled || !holder.current) return;
        id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => handler.current?.(response.credential),
        });
        holder.current.replaceChildren();
        id.renderButton(holder.current, { theme, size: "large", text: "continue_with", shape: "pill" });
      })
      .catch(() => {
        if (!cancelled) setError("Tidak bisa memuat Google Sign-In. Cek koneksi lalu muat ulang.");
      });
    return () => {
      cancelled = true;
    };
  }, [theme]);

  return (
    <div className="gsi">
      <div ref={holder} className="gsi__button" />
      {error ? <p className="gsi__error">{error}</p> : null}
    </div>
  );
}
