import { ArrowSquareOut, CheckCircle, Circle, LockKey, ShieldCheck } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { campaigns } from "../data/campaigns.js";
import {
  KYC_TIER_CEILING,
  MAX_TOTAL_FINANCING_PCT,
  PLATFORM_FEE_PCT,
  creatorCeilingPct,
} from "../lib/finance.js";
import { contractUrl } from "../lib/stellar.js";
import "./tier.css";

// Why this page exists: a donor reading "Imbalan Kreator 5%" has no way to know
// what stands behind it. The ladder is the answer — the reward is bounded by
// what the creator has proven about themselves, and the bound is in the
// contract rather than in a policy page we could quietly edit.
const TIERS = [
  {
    tier: 0,
    name: "Tanpa verifikasi",
    required: ["Tidak perlu mengumpulkan dokumen apa pun"],
    unlocks: [
      "Menggalang dana dan menerima donasi seperti biasa",
      "Imbalan Kreator 0% — seluruh sisa donasi ke penerima setelah fee platform",
    ],
  },
  {
    tier: 1,
    name: "Identitas dasar",
    required: [
      "KTP atau paspor berfoto",
      "Selfie yang cocok dengan dokumen",
      "Konfirmasi kepemilikan rekening penerima",
    ],
    unlocks: [
      "Imbalan Kreator sampai 3% per campaign",
      "Imbalan ditahan kontrak sampai bukti penyaluran diunggah",
    ],
  },
  {
    tier: 2,
    name: "Verifikasi lanjutan dan rekam jejak",
    required: [
      "Seluruh syarat Tier 1",
      "Minimal 3 campaign selesai dengan bukti penyaluran",
      "Tidak ada sengketa yang belum selesai",
    ],
    unlocks: [
      "Imbalan Kreator sampai 5% per campaign",
      "Rekam jejak terlihat oleh setiap donatur berikutnya",
    ],
  },
];

export function TierPage() {
  const current = campaigns[0].organizer.tier;

  return (
    <div className="tier-page page-gutter">
      <header className="tier-header">
        <span>Tier Kreator</span>
        <h1>Berapa yang boleh Anda ambil ditentukan oleh apa yang sudah Anda buktikan.</h1>
        <p>
          Imbalan Kreator bukan angka yang bisa diketik bebas. Tier verifikasi menetapkan batasnya, batas
          itu ditanam ke kontrak saat campaign dibuat, dan tidak bisa diubah setelah donasi pertama masuk.
          Donatur melihat persentasenya sebelum membayar — halaman ini menjelaskan apa yang berdiri di
          belakangnya.
        </p>
      </header>

      <div className="tier-ladder">
        {TIERS.map(({ tier, name, required, unlocks }) => {
          const ceiling = creatorCeilingPct(tier);
          const isCurrent = tier === current;
          return (
            <article key={tier} className={`tier-card${isCurrent ? " tier-card--current" : ""}`}>
              <header>
                <strong className="tier-card__number">{tier}</strong>
                <span className="tier-card__kicker">Maksimum {ceiling}%</span>
                <h2>Tier {tier}</h2>
                <p>{name}</p>
              </header>

              <div className="tier-card__block">
                <span>Dibutuhkan</span>
                <ul>
                  {required.map((item) => (
                    <li key={item}><Circle size={7} weight="fill" /> {item}</li>
                  ))}
                </ul>
              </div>

              <div className="tier-card__block">
                <span>Membuka</span>
                <ul>
                  {unlocks.map((item) => (
                    <li key={item}><CheckCircle size={14} weight="fill" /> {item}</li>
                  ))}
                </ul>
              </div>

              <footer>
                <span className="tier-card__total">
                  {ceiling}% kreator + {PLATFORM_FEE_PCT}% platform = <strong>{ceiling + PLATFORM_FEE_PCT}%</strong> total pembiayaan
                </span>
                {isCurrent ? (
                  <span className="tier-card__state">Tier Anda saat ini</span>
                ) : tier > current ? (
                  <button type="button" className="button button--outline-dark" disabled>
                    Verifikasi identitas
                  </button>
                ) : null}
              </footer>
            </article>
          );
        })}
      </div>

      <section className="tier-law">
        <ShieldCheck size={22} />
        <div>
          <h2>Kenapa berhenti di {MAX_TOTAL_FINANCING_PCT}%.</h2>
          <p>
            <strong>PP No. 29/1980 Pasal 6(1)</strong> membatasi pembiayaan usaha pengumpulan sumbangan
            sebanyak-banyaknya {MAX_TOTAL_FINANCING_PCT}% dari hasil pengumpulan yang bersangkutan. Yang
            dihitung adalah totalnya — imbalan kreator ditambah fee platform — bukan salah satunya saja.
            Karena itu setiap anak tangga di atas ({KYC_TIER_CEILING.map((c) => `${c + PLATFORM_FEE_PCT}%`).join(", ")})
            berada di bawah batas, dan kontrak menolak campaign yang melewatinya sebelum satu rupiah pun
            bergerak.
          </p>
          <a className="text-link" href={contractUrl} target="_blank" rel="noreferrer">
            Periksa batasnya di kontrak <ArrowSquareOut size={16} />
          </a>
        </div>
      </section>

      <p className="tier-preview-note">
        <LockKey size={17} /> Verifikasi KYC belum mengumpulkan dokumen pada versi preview ini. Tombolnya
        sengaja mati — kami tidak meminta KTP untuk sesuatu yang belum bisa kami simpan dengan benar.
      </p>

      <Link className="text-link tier-back" to="/dashboard">Kembali ke dashboard</Link>
    </div>
  );
}
