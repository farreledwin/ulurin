import {
  ArrowRight,
  ArrowSquareOut,
  CheckCircle,
  Copy,
  Heart,
  Hourglass,
  Info,
  LockKey,
  Receipt,
  ShareNetwork,
  ShieldCheck,
  WarningCircle,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { MoneySplit } from "../components/MoneySplit.jsx";
import { shareCampaign } from "../lib/share.js";
import {
  DEMO_RATE_IDR_PER_USDC,
  contractUrl,
  formatUsdc,
  rupiahToUsdcUnits,
  txUrl,
} from "../lib/stellar.js";
import { useApp } from "../context/AppContext.jsx";
import { completedCampaigns, getCampaign } from "../data/campaigns.js";
import { formatRupiah } from "../lib/finance.js";

export function ReceiptPage() {
  const { receiptId } = useParams();
  const { receipts } = useApp();
  const receipt = receipts[receiptId];
  const campaign = receipt ? getCampaign(receipt.slug) : null;
  const completedExample = completedCampaigns.find(
    (item) => item.organizerSlug === campaign?.organizer.slug,
  );
  const [copied, setCopied] = useState(false);

  if (!receipt || !campaign) return <Navigate to="/jelajahi" replace />;

  // The rate this donation was converted at, recorded on the receipt. Older
  // receipts predate the field, so fall back to the fixed demo rate/label.
  const receiptRate = receipt.rate ?? DEMO_RATE_IDR_PER_USDC;
  const receiptRateSource = receipt.rateSource ?? "demo";

  const copyHash = async () => {
    await navigator.clipboard?.writeText(receipt.hash);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="receipt-page page-gutter">
      <section className="thanks">
        <span className="thanks__heart" aria-hidden="true"><Heart size={22} weight="fill" /></span>
        <h1>Terima kasih.</h1>
        <p className="thanks__lead">Donasimu untuk <strong>{campaign.shortTitle}</strong> sudah masuk dan tercatat.</p>
        <figure className="thanks__note">
          <img src={campaign.organizer.avatar} alt={`Foto ${campaign.organizer.name}`} loading="lazy" />
          <blockquote>
            <p>Setiap rupiah langsung ke {campaign.beneficiary}. Terima kasih sudah percaya dan menjaga kerja ini tetap jalan.</p>
            <figcaption>{campaign.organizer.name}</figcaption>
          </blockquote>
        </figure>
        <div className="thanks__actions">
          <button type="button" className="button button--coral" onClick={() => shareCampaign(campaign)}>
            <ShareNetwork size={18} /> Ajak yang lain
          </button>
          <Link className="button button--outline-dark" to={`/campaign/${campaign.slug}`}>
            Pantau kabarnya <ArrowRight size={17} />
          </Link>
        </div>
        <p className="thanks__meta">Receipt {receipt.id} &middot; bukti dan pembagian lengkap ada di bawah.</p>
      </section>

      <div className="receipt-layout">
        <article className="receipt-card">
          <header>
            <Receipt size={25} />
            <span><strong>Receipt donasi</strong><small>{new Date(receipt.createdAt).toLocaleString("id-ID")}</small></span>
            <span className="receipt-status">Terkonfirmasi demo</span>
          </header>
          <div className="receipt-card__campaign">
            <img src={campaign.image} alt={campaign.shortTitle} />
            <span><strong>{campaign.title}</strong><small>{campaign.organizer.name}</small></span>
          </div>
          <div className="receipt-card__total"><span>Total</span><strong>{formatRupiah(receipt.amount)}</strong></div>
          <MoneySplit split={campaign.split} amount={receipt.amount} tier={campaign.organizer.tier} />
          <div className="receipt-card__meta">
            <span><small>Pembayaran</small><strong>{receipt.paymentMethod.toUpperCase()} via Xendit Sandbox simulasi</strong></span>
            <span><small>Jadwal</small><strong>{receipt.recurring ? "Bulanan" : "Satu kali"}</strong></span>
            <span><small>Nama publik</small><strong>{receipt.anonymous ? "Anonim" : "Anda"}</strong></span>
          </div>
        </article>

        <aside className="release-status">
          <h2>Status pencairan</h2>
          <div className="release-step release-step--done">
            <CheckCircle size={22} weight="fill" />
            <span><strong>Bagian penerima tersedia</strong><small>Penerima tidak menunggu kreator selesai membuat laporan.</small></span>
          </div>
          <div className="release-step">
            <Hourglass size={22} />
            <span><strong>Imbalan Kreator masih terkunci</strong><small>Terbuka setelah bukti diunggah dan direview.</small></span>
          </div>
          <div className="release-step">
            <Hourglass size={22} />
            <span><strong>Platform fee mengikuti status prototype</strong><small>Waktu pencairan final masih keputusan produk terbuka.</small></span>
          </div>
          <Link className="text-link" to={`/campaign/${campaign.slug}`}>Pantau campaign <ArrowRight size={17} /></Link>
        </aside>
      </div>

      <section className="transaction-panel">
        <div>
          <span>{receipt.onchain ? "Hash transaksi Stellar Testnet" : "Hash transaksi demo"}</span>
          <code>{receipt.hash}</code>
        </div>
        <button type="button" onClick={copyHash}><Copy size={18} /> {copied ? "Tersalin" : "Salin hash"}</button>

        {receipt.onchain ? (
          <>
            <p>
              <ShieldCheck size={17} /> Transaksi ini nyata. Kontrak yang membagi dananya, bukan server
              kami, dan siapa pun bisa memeriksanya tanpa meminta izin kepada Ulurin.{" "}
              <a className="text-link" href={txUrl(receipt.hash)} target="_blank" rel="noreferrer">
                Buka di explorer <ArrowSquareOut size={15} />
              </a>
            </p>
            <p>
              <Info size={17} /> Rupiah di struk ini dikonversi pada kurs {receiptRateSource}{" "}
              <strong>Rp {receiptRate.toLocaleString("id-ID")} / USDC</strong> saat donasi, jadi yang
              berpindah di chain adalah {formatUsdc(rupiahToUsdcUnits(receipt.amount, receiptRate))}. Penandatangannya
              akun demo Ulurin, bukan wallet Anda, dan testnet USDC bukan uang sungguhan.
            </p>
          </>
        ) : (
          <>
            <p><WarningCircle size={17} /> Hash dibuat secara lokal untuk menguji UI. Ia tidak ada di Stellar Testnet explorer.</p>
            <p>
              <ShieldCheck size={17} /> Vault yang menjalankan aturan pembagian ini sudah live di testnet.{" "}
              <a className="text-link" href={contractUrl} target="_blank" rel="noreferrer">
                Periksa kontraknya <ArrowSquareOut size={15} />
              </a>
            </p>
          </>
        )}
      </section>

      <section className="rating-gate">
        <div className="rating-gate__icon"><LockKey size={28} /></div>
        <div>
          <span>Rating Kreator belum terbuka</span>
          <h2>Donasi selesai. Penyaluran dan buktinya belum.</h2>
          <p>
            Anda baru dapat menilai {campaign.organizer.name} setelah bantuan disalurkan, bukti foto dan video
            diunggah, lalu bukti tersebut lolos review.
          </p>
          <div className="rating-gate__steps" aria-label="Tahapan sebelum rating terbuka">
            <span className="done"><CheckCircle size={18} weight="fill" /> Donasi terkonfirmasi</span>
            <span><Hourglass size={18} /> Bukti penyaluran direview</span>
            <span><Hourglass size={18} /> Rating Kreator terbuka</span>
          </div>
          {completedExample ? (
            <Link className="button button--outline-dark" to={`/completed/${completedExample.slug}`}>
              Lihat campaign selesai dan bukti ratingnya <ArrowRight size={17} />
            </Link>
          ) : null}
          <small>Riwayat berikut memakai campaign yang sudah selesai, bukan donasi yang baru dibuat.</small>
        </div>
      </section>
    </div>
  );
}
