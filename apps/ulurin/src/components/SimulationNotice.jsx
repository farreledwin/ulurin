import { Info, X } from "@phosphor-icons/react";
import { useState } from "react";

export function SimulationNotice() {
  const [open, setOpen] = useState(false);

  return (
    <div className={`simulation-notice ${open ? "simulation-notice--open" : ""}`}>
      <button
        className="simulation-notice__trigger"
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buka informasi simulasi lokal"
        title="Buka informasi simulasi lokal"
        aria-expanded={open}
      >
        <Info size={17} />
        <span>Simulasi lokal</span>
      </button>
      {open ? (
        <div className="simulation-notice__panel" role="dialog" aria-label="Batas prototype">
          <button type="button" onClick={() => setOpen(false)} aria-label="Tutup penjelasan">
            <X size={18} />
          </button>
          <strong>Ini prototype lokal.</strong>
          <p>
            Donasi rupiah, Xendit, rating, bukti, dan aktivitas adalah data simulasi. Tidak ada uang
            sungguhan yang bergerak.
          </p>
          <p>
            Yang nyata: vault Ulurin di Stellar Testnet. Panel on-chain di dashboard membaca kontrak itu
            langsung dan bisa Anda periksa sendiri di stellar.expert. Testnet XLM bukan uang sungguhan,
            dan angkanya tidak berhubungan dengan angka rupiah di halaman ini.
          </p>
        </div>
      ) : null}
    </div>
  );
}
