import { ArrowsClockwise, BookmarkSimple, Clock, MapPin, SealCheck, ShareNetwork, Star } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { compactRupiah, progressPercent } from "../lib/finance.js";
import { shareCampaign } from "../lib/share.js";

export function CampaignCard({ campaign }) {
  const { saved, toggleSaved } = useApp();
  const progress = progressPercent(campaign.raised, campaign.target);
  const isSaved = saved.includes(campaign.slug);
  const proofTotal = campaign.proof?.length ?? 0;
  const proofVerified = campaign.proof?.filter((item) => item.status === "verified").length ?? 0;

  return (
    <article className="campaign-card">
      <Link className="campaign-card__media" to={`/campaign/${campaign.slug}`}>
        <img src={campaign.image} alt={`Kegiatan ${campaign.shortTitle}`} loading="lazy" />
        <span className="campaign-card__category">{campaign.category}</span>
      </Link>
      <button
        className="campaign-card__save"
        type="button"
        onClick={() => toggleSaved(campaign.slug)}
        aria-label={isSaved ? "Hapus dari tersimpan" : "Simpan campaign"}
      >
        <BookmarkSimple size={20} weight={isSaved ? "fill" : "regular"} />
      </button>
      <div className="campaign-card__body">
        <Link to={`/campaign/${campaign.slug}`}>
          <h3>{campaign.title}</h3>
        </Link>
        <p>{campaign.excerpt}</p>
        <div className="campaign-card__organizer">
          <span className="campaign-card__avatar" style={{ backgroundImage: `url(${campaign.organizer.avatar})` }} />
          <span>
            <strong>{campaign.organizer.name}</strong>
            <small>
              <Star size={13} weight="fill" /> {campaign.organizer.rating} · {campaign.organizer.completed} selesai
            </small>
          </span>
        </div>
        <div className="progress-track" aria-label={`${progress}% terkumpul`}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="campaign-card__funding">
          <span>
            <strong>{compactRupiah(campaign.raised)}</strong>
            <small>dari {compactRupiah(campaign.target)}</small>
          </span>
          <span>{progress}%</span>
        </div>
        <div className="campaign-card__meta">
          <span><MapPin size={15} /> {campaign.location}</span>
          <span className={`campaign-card__cycle ${campaign.recurring ? "is-monthly" : "is-oneoff"}`}>
            {campaign.recurring ? <ArrowsClockwise size={12} weight="bold" /> : <Clock size={12} weight="bold" />}
            {campaign.recurring ? "Bulanan" : "Sekali jalan"}
          </span>
        </div>
        <div className="campaign-card__split" aria-label="Pembagian dana">
          <span>Penerima {campaign.split.beneficiary}%</span>
          <span>Kreator {campaign.split.creator}%</span>
          <span>Ulurin {campaign.split.platform}%</span>
        </div>
        {/* The proof trail is the differentiator, and until now neither
            discovery surface showed it — a donor had to already be on the
            campaign page to learn it exists. */}
        <div className="campaign-card__footer">
          {proofTotal > 0 ? (
            <span className="campaign-card__proof">
              <SealCheck size={14} weight="fill" /> {proofVerified}/{proofTotal} bukti terverifikasi
            </span>
          ) : (
            <span className="campaign-card__proof campaign-card__proof--pending">
              <SealCheck size={14} /> Belum ada bukti
            </span>
          )}
          <button type="button" onClick={() => shareCampaign(campaign)} aria-label={`Bagikan ${campaign.shortTitle}`}>
            <ShareNetwork size={15} /> Bagikan
          </button>
        </div>
      </div>
    </article>
  );
}
