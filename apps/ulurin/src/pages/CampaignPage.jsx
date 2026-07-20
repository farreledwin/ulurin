import {
  ArrowRight,
  ArrowSquareOut,
  CalendarDots,
  ChatCircleText,
  CheckCircle,
  Clock,
  Copy,
  MapPin,
  ShareNetwork,
  ShieldCheck,
  Star,
  WarningCircle,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { MoneySplit } from "../components/MoneySplit.jsx";
import { contractUrl } from "../lib/stellar.js";
import { shareCampaign } from "../lib/share.js";
import { useApp } from "../context/AppContext.jsx";
import { getCampaign } from "../data/campaigns.js";
import { formatRupiah, progressPercent } from "../lib/finance.js";

const statusIcon = {
  verified: CheckCircle,
  review: Clock,
  pending: WarningCircle,
};

export function CampaignPage() {
  const { slug } = useParams();
  const campaign = getCampaign(slug);
  const [tab, setTab] = useState("story");
  const [copied, setCopied] = useState(false);
  const [comment, setComment] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const { campaignComments, addCampaignComment } = useApp();

  if (!campaign) return <Navigate to="/jelajahi" replace />;

  const progress = progressPercent(campaign.raised, campaign.target);
  const demoHash = "c7d45a91b6a48f3e7d2008d31c0c28f77ad13e79b5c6aa6e0f941d2b9c230e42";

  const copyHash = async () => {
    await navigator.clipboard?.writeText(demoHash);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const submitComment = (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    addCampaignComment({ slug: campaign.slug, body: comment, anonymous });
    setComment("");
  };

  return (
    <div className="campaign-page">
      <section className="campaign-hero page-gutter">
        <div className="campaign-hero__media">
          <img src={campaign.image} alt={`Kegiatan ${campaign.title}`} />
          <span>{campaign.category}</span>
        </div>
        <div className="campaign-hero__summary">
          <div className="campaign-hero__meta"><MapPin size={17} /> {campaign.location}</div>
          <h1>{campaign.title}</h1>
          <p>{campaign.excerpt}</p>
          <Link className="organizer-line" to={`/creator/${campaign.organizer.slug}`}>
            <span className="organizer-line__avatar" style={{ backgroundImage: `url(${campaign.organizer.avatar})` }} />
            <span>
              <strong>{campaign.organizer.name} <CheckCircle size={15} weight="fill" /></strong>
              <small><Star size={13} weight="fill" /> {campaign.organizer.rating} | {campaign.organizer.completed} campaign selesai</small>
            </span>
            <ArrowRight size={18} />
          </Link>
          <div className="campaign-funding">
            <div>
              <strong>{formatRupiah(campaign.raised)}</strong>
              <span>terkumpul dari {formatRupiah(campaign.target)}</span>
            </div>
            <span>{progress}%</span>
          </div>
          <div className="progress-track progress-track--large"><span style={{ width: `${progress}%` }} /></div>
          <div className="campaign-hero__facts">
            <span>{campaign.donors} donatur simulasi</span>
            <span><CalendarDots size={16} /> {campaign.cycle}</span>
            <span>{campaign.daysLeft} hari tersisa</span>
          </div>
          {/* Sharing is how Indonesian campaigns actually travel — WhatsApp
              first. Until now this product could copy a transaction hash to
              the clipboard but had no way to share a campaign. */}
          <button className="button button--outline-dark campaign-share" type="button" onClick={() => shareCampaign(campaign)}>
            <ShareNetwork size={18} /> Bagikan campaign ini
          </button>
        </div>
      </section>

      <section className="campaign-body page-gutter">
        <div className="campaign-content">
          <div className="campaign-tabs" role="tablist" aria-label="Informasi campaign">
            {[
              ["story", "Cerita"],
              ["proof", "Bukti"],
              ["transparency", "Transparansi"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={tab === value ? "active" : ""}
                onClick={() => setTab(value)}
                role="tab"
                aria-selected={tab === value}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "story" ? (
            <article className="campaign-article">
              <h2>Mengapa campaign ini ada</h2>
              <p>{campaign.story}</p>
              <h3>Campaign dinyatakan selesai ketika</h3>
              <p>{campaign.completion}</p>
              <div className="beneficiary-callout">
                <ShieldCheck size={24} />
                <span>
                  <strong>Penerima atau proyek</strong>
                  <p>{campaign.beneficiary}</p>
                </span>
              </div>
              <img src={campaign.image} alt={`Dokumentasi ${campaign.shortTitle}`} loading="lazy" />
            </article>
          ) : null}

          {tab === "proof" ? (
            <article className="campaign-article">
              <h2>Bukti siklus berjalan</h2>
              <p>
                Bukti adalah data off-chain yang direview. Hash hanya membantu memastikan file yang dilihat
                tidak berubah setelah dicatat.
              </p>
              <div className="proof-list">
                {campaign.proof.map((item) => {
                  const Icon = statusIcon[item.status];
                  return (
                    <div key={item.label}>
                      <Icon size={22} weight={item.status === "verified" ? "fill" : "regular"} />
                      <span><strong>{item.label}</strong><small>{item.date}</small></span>
                      <span>{item.status === "verified" ? "Terverifikasi" : item.status === "review" ? "Direview" : "Menunggu"}</span>
                    </div>
                  );
                })}
              </div>
            </article>
          ) : null}

          {tab === "transparency" ? (
            <article className="campaign-article">
              <h2>Pembagian dan jejak transaksi</h2>
              <MoneySplit split={campaign.split} tier={campaign.organizer.tier} />
              <div className="hash-panel">
                <span>
                  <small>Hash transaksi demo</small>
                  <code>{demoHash}</code>
                </span>
                <button type="button" onClick={copyHash}><Copy size={18} /> {copied ? "Tersalin" : "Salin"}</button>
              </div>
              <p className="honesty-note">
                <WarningCircle size={18} /> Hash ini dibuat untuk tampilan prototype dan tidak mewakili
                transaksi Stellar Testnet. Pembagian di atas juga masih simulasi.
              </p>
              <p className="honesty-note">
                <ShieldCheck size={18} /> Yang sudah nyata: vault Ulurin di Stellar Testnet. Aturan
                pembagiannya, batas 10%, dan kunci imbalan sampai bukti diunggah dijalankan di sana, bukan
                di server kami.{" "}
                <a className="text-link" href={contractUrl} target="_blank" rel="noreferrer">
                  Periksa kontraknya <ArrowSquareOut size={16} />
                </a>
              </p>
            </article>
          ) : null}

          <section className="campaign-comments" aria-labelledby="campaign-comments-title">
            <div className="campaign-comments__heading">
              <div>
                <span><ChatCircleText size={18} /> Dukungan dari donatur</span>
                <h2 id="campaign-comments-title">Pesan yang ikut berjalan bersama campaign</h2>
              </div>
              <small>{(campaignComments[campaign.slug] || []).length} komentar terverifikasi</small>
            </div>

            <form className="campaign-comment-form" onSubmit={submitComment}>
              <label htmlFor="campaign-comment">Tulis dukungan atau pertanyaan</label>
              <textarea
                id="campaign-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder={`Tulis pesan untuk ${campaign.organizer.name}`}
              />
              <div>
                <label className="campaign-comment-form__anonymous">
                  <input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} />
                  Tampilkan sebagai donatur anonim
                </label>
                <button className="button button--outline-dark" type="submit" disabled={!comment.trim()}>
                  Kirim komentar
                </button>
              </div>
              <small>Dalam produk nyata, kolom ini hanya terbuka setelah donasi terkonfirmasi. Di prototype, komentar hanya tersimpan selama sesi.</small>
            </form>

            <div className="campaign-comment-list">
              {(campaignComments[campaign.slug] || []).map((item) => (
                <article key={item.id}>
                  <div className="campaign-comment-list__avatar">{item.name === "Donatur anonim" ? "DA" : item.name.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <header>
                      <span>
                        <strong>{item.name}</strong>
                        {item.verified ? <small><CheckCircle size={14} weight="fill" /> Donatur terkonfirmasi</small> : null}
                      </span>
                      <time>{item.createdAt}</time>
                    </header>
                    <p>{item.body}</p>
                    {item.amount ? <small className="campaign-comment-list__amount">Berdonasi {formatRupiah(item.amount)}</small> : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="campaign-donate-card">
          <span>Dana dibagi sebelum Anda membayar</span>
          <MoneySplit split={campaign.split} tier={campaign.organizer.tier} />
          <div className="creator-reason">
            <strong>Mengapa Kreator dibayar {campaign.split.creator}%?</strong>
            <p>{campaign.creatorReason}</p>
          </div>
          <Link className="button button--coral button--full" to={`/donate/${campaign.slug}`}>
            Donasi ke campaign ini
          </Link>
          <p><ShieldCheck size={16} /> Prototype memakai alur pembayaran Xendit Sandbox yang disimulasikan.</p>
        </aside>
      </section>
    </div>
  );
}
