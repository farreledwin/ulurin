import {
  ArrowLeft,
  CheckCircle,
  FileText,
  ShieldCheck,
  Star,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { getCompletedCampaign } from "../data/campaigns.js";
import { formatRupiah } from "../lib/finance.js";

export function CreatorReviewPage() {
  const { slug } = useParams();
  const campaign = getCompletedCampaign(slug);
  const { ratings, submitRating } = useApp();
  const existingRating = ratings.find((item) => item.slug === campaign?.slug);
  const [stars, setStars] = useState(existingRating?.stars || 0);
  const [review, setReview] = useState(existingRating?.review || "");

  if (!campaign) return <Navigate to="/jelajahi" replace />;

  const proofReviewId = campaign.transactionHash;

  const saveRating = (event) => {
    event.preventDefault();
    if (!stars) return;
    submitRating({
      slug: campaign.slug,
      organizerSlug: campaign.organizer.slug,
      stars,
      review,
      proofReviewId,
    });
  };

  return (
    <div className="creator-review-page page-gutter">
      <Link className="back-link" to={`/completed/${campaign.slug}`}>
        <ArrowLeft size={18} /> Kembali ke dokumentasi campaign
      </Link>

      <header className="creator-review-hero">
        <span><CheckCircle size={18} weight="fill" /> Campaign selesai | Bukti sudah direview</span>
        <h1>Bukti sudah tersedia. Sekarang nilai {campaign.organizer.name}.</h1>
        <p>
          Rating diberikan kepada Kreator Kebaikan setelah penyaluran selesai. Yang dinilai adalah kejelasan
          komunikasi, ketepatan pelaksanaan, dan kualitas bukti, bukan seberapa dramatis ceritanya.
        </p>
        <div className="creator-review-identity">
          <img src={campaign.organizer.avatar} alt={campaign.organizer.name} />
          <span>
            <strong>{campaign.organizer.name}</strong>
            <small>{campaign.organizer.handle} | Kreator terverifikasi tier {campaign.organizer.tier}</small>
          </span>
        </div>
      </header>

      <div className="creator-review-layout">
        <article className="proof-review-card">
          <header>
            <div>
              <span>Dokumentasi campaign selesai</span>
              <h2>{campaign.title} | Selesai dan direview</h2>
            </div>
            <span className="proof-reviewed-badge"><ShieldCheck size={17} /> Lolos review</span>
          </header>

          <div className="proof-review-summary">
            <span><small>Dana terkumpul</small><strong>{formatRupiah(campaign.amount)}</strong></span>
            <span><small>Selesai</small><strong>{campaign.completedAt}</strong></span>
            <span><small>Bukti disetujui</small><strong>{campaign.proofApprovedAt}</strong></span>
          </div>

          <div className="proof-media-grid">
            {campaign.proof.map((item) => (
              <div className="proof-media-card" key={item.type}>
                <div className="proof-media-card__visual">
                  {item.image ? (
                    <img src={item.image} alt={`${item.type} ${campaign.title}`} />
                  ) : (
                    <span className="proof-media-card__document"><FileText size={44} weight="duotone" /></span>
                  )}
                </div>
                <div>
                  <span>{item.type}</span>
                  <strong>{item.title}</strong>
                  <small>{item.reference ? `Referensi ${item.reference} | Direview` : item.caption}</small>
                </div>
              </div>
            ))}
          </div>

          <div className="beneficiary-proof">
            <CheckCircle size={24} weight="fill" />
            <span>
              <strong>Konfirmasi penerima tersedia</strong>
              <p>{campaign.beneficiary} mengonfirmasi bahwa bantuan pada campaign ini telah diterima.</p>
            </span>
          </div>

          <div className="proof-review-note">
            <FileText size={21} />
            <p>{campaign.summary}</p>
          </div>
        </article>

        <aside className="rating-panel rating-panel--creator">
          <div>
            <span>Hanya donatur terkonfirmasi yang dapat menilai</span>
            <h2>Bagaimana {campaign.organizer.name} menjalankan amanah ini?</h2>
            <p>Rating ini masuk ke profil Kreator Kebaikan dan terhubung ke bukti siklus yang sudah direview.</p>
          </div>
          <form onSubmit={saveRating}>
            <div className="star-picker" aria-label={`Beri rating untuk ${campaign.organizer.name}`}>
              {[1, 2, 3, 4, 5].map((value) => (
                <button type="button" key={value} onClick={() => setStars(value)} aria-label={`${value} bintang`}>
                  <Star size={32} weight={value <= stars ? "fill" : "regular"} />
                </button>
              ))}
            </div>
            <textarea
              value={review}
              onChange={(event) => setReview(event.target.value)}
              placeholder="Nilai kejelasan update, ketepatan penyaluran, dan kualitas buktinya."
            />
            <button className="button button--coral button--full" type="submit" disabled={!stars}>
              Kirim rating untuk {campaign.organizer.name}
            </button>
            {existingRating ? (
              <p className="rating-saved" role="status"><CheckCircle size={17} weight="fill" /> Rating Anda sudah tersimpan.</p>
            ) : null}
          </form>
        </aside>
      </div>
    </div>
  );
}
