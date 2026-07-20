import { ArrowLeft, ShieldCheck } from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleSignInButton } from "./GoogleSignInButton.jsx";

// Shown when nobody is signed in: the dashboard is gated behind a real Google
// login. The credential is verified server-side (api/wallet.js) before any
// session exists here.
export function DashboardLogin({ onSignIn }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handle = async (credential) => {
    setError("");
    setBusy(true);
    try {
      await onSignIn(credential);
    } catch (caught) {
      setError(caught.message || "Login gagal. Coba lagi.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="dash-gate page-gutter">
      <div className="dash-gate__card">
        <span className="dash-gate__eyebrow">Dashboard Kreator</span>
        <h1>Masuk untuk membuka dashboard.</h1>
        <p>
          Dashboard ini tertaut ke satu akun Google. Masuk dengan Google, dan wallet Stellar testnet-mu
          muncul otomatis — tanpa seed phrase.
        </p>
        <GoogleSignInButton onCredential={handle} />
        {busy ? <p className="dash-gate__status">Memeriksa akun…</p> : null}
        {error ? <p className="dash-gate__error">{error}</p> : null}
        <p className="dash-gate__note">
          <ShieldCheck size={14} weight="fill" /> Token Google diverifikasi di server. Testnet demo — bukan uang sungguhan.
        </p>
        <Link className="dash-gate__back" to="/">
          <ArrowLeft size={15} /> Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
