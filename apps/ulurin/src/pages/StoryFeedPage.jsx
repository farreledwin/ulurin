import {
  BookmarkSimple,
  CaretDown,
  CaretUp,
  ChatCircle,
  CheckCircle,
  Heart,
  Pause,
  Play,
  ShareNetwork,
  Star,
  X,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { MoneySplit } from "../components/MoneySplit.jsx";
import { useApp } from "../context/AppContext.jsx";
import { campaigns, completedCampaigns } from "../data/campaigns.js";
import { compactRupiah, formatRupiah, progressPercent } from "../lib/finance.js";
import { shareCampaign } from "../lib/share.js";

// A photo-story surface, deliberately not a TikTok feed. The product's own
// docs commit to photo and text campaigns being first-class, to ranking that
// never rewards drama, and to donors deciding with the numbers in view — three
// promises a full-bleed autoplay video feed structurally fights. So this page
// stays honest about what it is: every control here does something, every
// number is real, and the funding facts survive on a phone.
export function StoryFeedPage() {
  const feed = campaigns;
  const { saved, toggleSaved, campaignComments, addCampaignComment } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(true);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const campaign = feed[activeIndex];
  const suggestedDonation = campaign.suggestedDonation || 50000;
  const progress = progressPercent(campaign.raised, campaign.target);
  const comments = campaignComments[campaign.slug] || [];
  const isSaved = saved.includes(campaign.slug);
  // Same read as CreatorProfilePage.jsx:22. A creator's finished work is the
  // only claim in this panel a donor can open and check for themselves.
  const history = completedCampaigns.filter((item) => item.organizerSlug === campaign.organizer.slug);

  const move = (direction) => {
    setActiveIndex((current) => (current + direction + feed.length) % feed.length);
    setPaused(false);
    setCommentsOpen(false);
  };

  const submitComment = (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;
    addCampaignComment({ slug: campaign.slug, body: commentText, anonymous });
    setCommentText("");
  };

  return (
    <div className="story-page">
      <aside className="story-creator-panel">
        {/* The badge belongs to the avatar, not to a percentage of the column.
            Anchored to 50% - 160px it was a leftover from when this column was
            centred, and it drifted with the window height on every resize. */}
        <span className="story-creator-panel__avatar" style={{ backgroundImage: `url(${campaign.organizer.avatar})` }}>
          <CheckCircle className="story-creator-panel__check" size={19} weight="fill" />
        </span>
        <h1>{campaign.organizer.name}</h1>
        <p>{campaign.organizer.handle}</p>
        <div className="story-creator-panel__rating">
          <Star size={17} weight="fill" /> {campaign.organizer.rating} ({campaign.organizer.reviewCount})
        </div>
        {/* organizer.bio, not campaign.excerpt: the excerpt is already on the
            stage 300px away (line 94), so the creator column was spending its
            one description on a sentence the reader had just read. */}
        <p className="story-creator-panel__bio">{campaign.organizer.bio}</p>

        <div className="story-creator-panel__trail">
          <header>
            <span>Selesai dan dibuktikan</span>
            {/* "N terbaru dari M", never a bare N. The seed carries 2-4 finished
                campaigns per creator while organizer.completed claims 6-29, and
                every other surface prints that larger number — a bare count here
                would make this page contradict /campaign about the same person.
                No money total either: summing only the visible rows under a
                heading that names all of them invites reading it as a lifetime
                figure. Each row already carries its own amount. */}
            <small>
              {history.length} terbaru dari {campaign.organizer.completed} campaign selesai
            </small>
          </header>
          <ul>
            {history.map((item) => (
              <li key={item.slug}>
                <Link to={`/completed/${item.slug}`}>
                  <img src={item.image} alt="" loading="lazy" />
                  <div>
                    <strong>{item.title}</strong>
                    <small>
                      {item.completedAt} &middot; {compactRupiah(item.amount)} &middot;{" "}
                      <Star size={11} weight="fill" /> {item.rating}
                    </small>
                    <p>{item.summary}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Read from campaignComments — the same array the sheet's comment
            dialog writes to, so a reader's own message appears here the moment
            they send it. Not completedCampaigns[].reviews: that field holds two
            hardcoded sentences for all sixteen finished campaigns, so any
            surface that cycles it would advertise its own testimonials as
            fabricated. No stars per comment either — the record has no rating
            field, and this panel does not invent one. */}
        {comments.length ? (
          <div className="story-creator-panel__voice">
            <span>Kata donatur</span>
            {comments.slice(0, 2).map((item) => (
              <article key={item.id}>
                <p>{item.body}</p>
                <small>{item.name} &middot; {item.createdAt}</small>
              </article>
            ))}
          </div>
        ) : null}

        <Link className="button button--outline-light button--full" to={`/creator/${campaign.organizer.slug}`}>
          Lihat profil
        </Link>
      </aside>

      <section className={`story-stage ${paused ? "story-stage--paused" : ""}`}>
        <img src={campaign.image} alt={`Cerita ${campaign.shortTitle}`} />
        <div className="story-stage__scrim" />
        <div className="story-stage__top">
          <strong>Cerita Kebaikan</strong>
          <span>Contoh media campaign</span>
        </div>
        <button
          className="story-stage__pause"
          type="button"
          onClick={() => setPaused((current) => !current)}
          aria-label={paused ? "Putar gerakan foto" : "Jeda gerakan foto"}
        >
          {paused ? <Play size={28} weight="fill" /> : <Pause size={28} weight="fill" />}
        </button>
        <div className="story-stage__copy">
          <Link to={`/creator/${campaign.organizer.slug}`}>@{campaign.organizer.handle.replace("@", "")}</Link>
          <h2>{campaign.title}</h2>
          <p>{campaign.excerpt}</p>
          <span>{campaign.location}</span>
        </div>
        <div className="story-stage__navigation">
          <button type="button" onClick={() => move(-1)} aria-label="Cerita sebelumnya"><CaretUp size={23} /></button>
          <span>{activeIndex + 1} / {feed.length}</span>
          <button type="button" onClick={() => move(1)} aria-label="Cerita berikutnya"><CaretDown size={23} /></button>
        </div>

        <div className={`story-donation-sheet ${sheetOpen ? "story-donation-sheet--open" : ""}`}>
          {/* The rail is anchored to the TOP of this sheet, not to the bottom
              of the viewport. The old fixed 280px offset was a guess about the
              sheet's height, and it guessed wrong the moment the sheet grew —
              the share button ended up buried underneath it. Anchored here it
              can never be covered, whatever the sheet's height becomes. */}
          <div className="story-stage__social">
            {/* A real donor count, not a like button. This page is "deliberately
                not a TikTok feed" (top of file) and every number here is real, so
                the heart is labelled as the statistic it is rather than dressed up
                as a tappable like — which would be a fabricated engagement metric
                on a product whose whole claim is that its numbers can be trusted. */}
            <span className="story-stage__stat" aria-label={`${campaign.donors} donatur mendukung`}>
              <Heart size={27} weight="fill" />
              <span>{campaign.donors}</span>
              <small>donatur</small>
            </span>
            <button type="button" onClick={() => setCommentsOpen(true)} aria-label={`Lihat ${comments.length} komentar`}>
              <ChatCircle size={27} />
              <span>{comments.length}</span>
            </button>
            <button type="button" onClick={() => toggleSaved(campaign.slug)} aria-label={isSaved ? "Hapus dari tersimpan" : "Simpan campaign"}>
              <BookmarkSimple size={27} weight={isSaved ? "fill" : "regular"} />
              <span>{isSaved ? "Tersimpan" : "Simpan"}</span>
            </button>
            <button type="button" onClick={() => shareCampaign(campaign)} aria-label="Bagikan cerita">
              <ShareNetwork size={27} />
              <span>Bagikan</span>
            </button>
          </div>
          <button
            className="story-donation-sheet__handle"
            type="button"
            onClick={() => setSheetOpen((current) => !current)}
            aria-label={sheetOpen ? "Kecilkan lembar donasi" : "Buka lembar donasi"}
          >
            <span />
          </button>
          {/* The funding facts live on the sheet because the sheet is the only
              part of this screen that survives a phone viewport. Hiding the
              raised/target while showing the pay button put the ask ahead of
              the information — backwards for a product about informed consent.
              The sheet opens by default, so the numbers lead; collapsing is the
              reader's own choice to go back to the photograph. */}
          {sheetOpen ? (
            <div className="story-donation-sheet__funding" aria-label={`${progress}% terkumpul`}>
              <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
              <span>
                <strong>{compactRupiah(campaign.raised)}</strong> dari {compactRupiah(campaign.target)} · {progress}%
              </span>
            </div>
          ) : null}
          <div className="story-donation-sheet__summary">
            <span>
              <small>Jumlah donasi</small>
              <strong>{formatRupiah(suggestedDonation)}</strong>
            </span>
            <span>{campaign.recurring ? "Bulanan" : "Sekali"}</span>
          </div>
          {sheetOpen ? <MoneySplit split={campaign.split} amount={suggestedDonation} tier={campaign.organizer.tier} compact /> : null}
          <Link className="button button--coral button--full" to={`/donate/${campaign.slug}?amount=${suggestedDonation}`}>
            Donasi sekarang
          </Link>
        </div>

        {commentsOpen ? (
          <div className="story-comments" role="dialog" aria-label={`Komentar untuk ${campaign.shortTitle}`}>
            <header>
              <strong>{comments.length} komentar terverifikasi</strong>
              <button type="button" onClick={() => setCommentsOpen(false)} aria-label="Tutup komentar">
                <X size={20} />
              </button>
            </header>
            <div className="story-comments__list">
              {comments.map((item) => (
                <article key={item.id}>
                  <div className="story-comments__avatar">{item.name === "Donatur anonim" ? "DA" : item.name.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <header>
                      <strong>{item.name}</strong>
                      {item.verified ? <small><CheckCircle size={13} weight="fill" /> Donatur terkonfirmasi</small> : null}
                      <time>{item.createdAt}</time>
                    </header>
                    <p>{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
            <form onSubmit={submitComment}>
              <textarea
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder={`Tulis pesan untuk ${campaign.organizer.name}`}
                rows={2}
              />
              <div>
                <label>
                  <input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} />
                  Anonim
                </label>
                <button className="button button--mint" type="submit" disabled={!commentText.trim()}>
                  Kirim
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </section>

      <aside className="story-detail-panel">
        <span>Campaign {campaign.recurring ? "bulanan" : "sekali jalan"}</span>
        <h2>{campaign.title}</h2>
        <p className="story-detail-panel__story">{campaign.story}</p>
        <MoneySplit split={campaign.split} tier={campaign.organizer.tier} />
        <Link className="text-link" to={`/campaign/${campaign.slug}`}>Lihat campaign lengkap</Link>
      </aside>
    </div>
  );
}
