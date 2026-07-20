import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ClockCountdown,
  Copy,
  FileText,
  Images,
  MapPin,
  ShieldCheck,
  Star,
  WarningCircle,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { getCompletedCampaign } from "../data/campaigns.js";
import { formatRupiah } from "../lib/finance.js";

export function CompletedCampaignPage() {
  const { slug } = useParams();
  const campaign = getCompletedCampaign(slug);
  const { ratings } = useApp();
  const [copied, setCopied] = useState(false);

  if (!campaign) return <Navigate to="/jelajahi" replace />;

  const sessionRating = ratings.find((item) => item.slug === campaign.slug);

  const copyHash = async () => {
    await navigator.clipboard?.writeText(campaign.transactionHash);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="completed-campaign-page page-gutter">
      <Link className="back-link" to={`/creator/${campaign.organizerSlug}#rekam-jejak`}>
        <ArrowLeft size={18} /> Kembali ke rekam jejak
      </Link>

      <section className="completed-campaign-hero">
        <div className="completed-campaign-hero__media">
          <img src={campaign.image} alt={`Dokumentasi ${campaign.title}`} />
          <span><CheckCircle size={16} weight="fill" /> Campaign selesai</span>
        </div>
        <div className="completed-campaign-hero__summary">
          <span><MapPin size={17} /> {campaign.location}</span>
          <h1>{campaign.title}</h1>
          <p>{campaign.summary}</p>
          <Link className="completed-creator-line" to={`/creator/${campaign.organizerSlug}`}>
            <img src={campaign.organizer.avatar} alt={campaign.organizer.name} />
            <span><strong>{campaign.organizer.name}</strong><small>{campaign.organizer.handle} | Tier {campaign.organizer.tier}</small></span>
            <ArrowRight size={18} />
          </Link>
          <div className="completed-campaign-hero__metrics">
            <div><small>Terkumpul</small><strong>{formatRupiah(campaign.amount)}</strong></div>
            <div><small>Selesai</small><strong>{campaign.completedAt}</strong></div>
            <div><small>Rating donatur</small><strong><Star size={17} weight="fill" /> {campaign.rating}</strong></div>
          </div>
        </div>
      </section>

      <div className="completed-campaign-layout">
        <main>
          <section className="completed-section">
            <div className="completed-section__heading">
              <span><Images size={18} /> Bukti penyaluran</span>
              <h2>Dokumentasi yang mengikat cerita dengan hasil</h2>
              <p>Foto dan catatan di bawah adalah data prototype. Struktur ini menunjukkan bagaimana bukti asli, invoice, dan konfirmasi penerima akan disajikan.</p>
            </div>
            <div className="completed-proof-grid">
              {campaign.proof.map((item, index) => (
                <article key={item.type}>
                  {item.image ? (
                    <div className="completed-proof-grid__media">
                      <img src={item.image} alt={`${item.type} untuk ${campaign.title}`} />
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    </div>
                  ) : (
                    <div className="completed-proof-record" aria-label={`Catatan ${item.type}`}>
                      <span><FileText size={30} weight="duotone" /></span>
                      <div>
                        <small>Referensi dokumen</small>
                        <code>{item.reference}</code>
                      </div>
                      <div>
                        <small>Penerima</small>
                        <strong>{campaign.beneficiary}</strong>
                      </div>
                      <span className="completed-proof-record__status"><ShieldCheck size={16} weight="fill" /> Direview</span>
                    </div>
                  )}
                  <span>{item.type}</span>
                  <h3>{item.title}</h3>
                  <p>{item.caption}</p>
                </article>
              ))}
            </div>
            <div className="beneficiary-confirmation">
              <ShieldCheck size={28} weight="fill" />
              <span>
                <small>Konfirmasi penerima</small>
                <strong>{campaign.beneficiary} mengonfirmasi bantuan telah diterima.</strong>
                <p>Konfirmasi ini memperkuat paket bukti, tetapi tidak membuktikan sendiri bahwa seluruh klaim dunia nyata benar.</p>
              </span>
            </div>
          </section>

          <section className="completed-section">
            <div className="completed-section__heading">
              <span><Star size={18} weight="fill" /> Ulasan donatur</span>
              <h2>Yang dinilai setelah hasilnya terlihat</h2>
              <p>Rating hanya dibuka untuk donatur campaign setelah paket bukti tersedia.</p>
            </div>
            <div className="completed-review-grid">
              {campaign.reviews.map((review) => (
                <article key={review.id}>
                  <header><strong>{review.name}</strong><span><Star size={15} weight="fill" /> {review.rating}</span></header>
                  <p>{review.body}</p>
                  <small><CheckCircle size={14} weight="fill" /> Donatur terkonfirmasi</small>
                </article>
              ))}
              {sessionRating ? (
                <article className="completed-review-grid__mine">
                  <header><strong>Anda</strong><span><Star size={15} weight="fill" /> {sessionRating.stars}</span></header>
                  <p>{sessionRating.review || "Rating diberikan tanpa ulasan tertulis."}</p>
                  <small><CheckCircle size={14} weight="fill" /> Tersimpan di sesi prototype</small>
                </article>
              ) : null}
            </div>
          </section>
        </main>

        <aside className="completed-verification-panel">
          <span>Status bukti</span>
          <h2>Selesai dan direview</h2>
          <div><CheckCircle size={20} weight="fill" /><span><strong>Penyaluran selesai</strong><small>{campaign.completedAt}</small></span></div>
          <div><ClockCountdown size={20} /><span><strong>Bukti disetujui</strong><small>{campaign.proofApprovedAt}</small></span></div>
          <div><FileText size={20} /><span><strong>{campaign.proof.length} paket bukti</strong><small>Foto, invoice, dan konfirmasi</small></span></div>
          <div className="completed-hash">
            <small>Hash pencatatan prototype</small>
            <code>{campaign.transactionHash}</code>
            <button type="button" onClick={copyHash}><Copy size={16} /> {copied ? "Tersalin" : "Salin hash"}</button>
          </div>
          <p className="completed-honesty"><WarningCircle size={17} /> Hash ini hanya contoh UI dan bukan transaksi Stellar Testnet.</p>
          <Link className="button button--coral button--full" to={`/review/completed/${campaign.slug}`}>
            {sessionRating ? "Edit rating Anda" : "Beri rating setelah melihat bukti"}
          </Link>
          <small className="completed-rating-note">Rating hanya tersedia untuk campaign yang sudah selesai dan donatur yang terkonfirmasi.</small>
          <Link className="button button--outline-light button--full" to={`/campaign/${campaign.activeCampaignSlug}`}>
            Lihat campaign aktif
          </Link>
        </aside>
      </div>
    </div>
  );
}
