import Link from "next/link";
import WebShell from "@/components/web/WebShell";
import { donationBreakdown, PLATFORM_FEE_PCT } from "@/lib/circles/allowance";
import { formatParts } from "@/lib/ui/currency";

export const metadata = {
  title: "Transparansi · Ulurin Web",
  description: "Model pembagian donasi, bukti penyaluran, dan jejak testnet Ulurin.",
};

export default function WebTransparencyPage() {
  const sample = donationBreakdown(100_000, 5);
  const money = (value: number) => {
    const parts = formatParts(value, "id");
    return `${parts.symbol}${parts.int}`;
  };

  return (
    <WebShell
      eyebrow="Model transparansi"
      title="Donatur melihat pembagian sebelum berkontribusi."
      description="Ulurin menampilkan beneficiary share, allowance organizer, dan status bukti dalam satu alur yang bisa diperiksa publik."
    >
      <div className="web-transparency-band">
        <section className="web-flow-card">
          <p className="web-flow-kicker">Contoh pembagian</p>
          <h2>Dari setiap Rp100.000</h2>
          <strong className="web-flow-money">{money(sample.beneficiary)} ke penerima</strong>
          <div className="web-flow-split" aria-label="Contoh pembagian donasi">
            <span style={{ width: "95%" }} />
            <span style={{ width: "5%" }} />
          </div>
          <div className="web-flow-split-labels">
            <span>95% penerima</span>
            <span>5% Imbalan Kreator</span>
          </div>
          <div className="web-fee-list">
            <div className="web-fee-row beneficiary">
              <div><strong>Penerima</strong><small>Dipakai untuk kebutuhan utama campaign.</small></div>
              <strong>{money(sample.beneficiary)}</strong>
            </div>
            <div className="web-fee-row creator">
              <div><strong>Imbalan Kreator</strong><small>Kerja lapangan, verifikasi, produksi cerita, penyaluran, dan pelaporan.</small></div>
              <strong>{money(sample.creator)}</strong>
            </div>
            <div className="web-fee-row platform">
              <div><strong>Fee platform ({PLATFORM_FEE_PCT}%)</strong><small>Infrastruktur pembayaran, moderasi, keamanan, dan receipt publik.</small></div>
              <strong>+{money(sample.platformFee)}</strong>
            </div>
          </div>
          <div className="web-checkout-total">
            <span>Total checkout produksi</span>
            <strong>{money(sample.checkoutTotal)}</strong>
          </div>
          <p className="web-fee-disclaimer">Platform fee ditambahkan di atas donasi. Kontrak testnet saat ini belum memungut fee tersebut.</p>
        </section>

        <section className="web-flow-card">
          <h2>Jejak yang direncanakan</h2>
          <div className="web-transparency-steps">
            {[
              ["1", "Kontribusi", "Jumlah dan pembagian dikonfirmasi sebelum donor melanjutkan."],
              ["2", "Pencairan penerima", "Saldo beneficiary dipisahkan dari allowance organizer."],
              ["3", "Bukti penyaluran", "Organizer mengunggah bukti sebelum allowance dapat dirilis."],
              ["4", "Release allowance", "Pelepasan mengikuti proof gate dan dispute window."],
            ].map(([number, title, copy]) => (
              <div key={number} className="web-transparency-step">
                <span>{number}</span>
                <div><strong>{title}</strong><p>{copy}</p></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="web-flow-card">
        <p className="web-flow-kicker">Status produk</p>
        <h2>Preview Indonesia-first di Stellar testnet</h2>
        <p>Marketplace, campaign builder, donor breakdown, testnet donation, dan organizer dashboard tersedia di repo ini. Rail fiat produksi seperti QRIS dan e-wallet belum memindahkan uang nyata pada versi preview.</p>
        <div className="web-flow-actions">
          <Link href="/web#campaigns" className="web-flow-link-button">Lihat campaign</Link>
          <Link href="/web/you/kyc-tier" className="web-flow-link-button secondary">Pelajari KYC tier</Link>
        </div>
      </section>
    </WebShell>
  );
}
