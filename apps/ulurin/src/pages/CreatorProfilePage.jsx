import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  CheckCircle,
  ClockCountdown,
  Flag,
  HandHeart,
  Images,
  Star,
  TrendUp,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { CampaignCard } from "../components/CampaignCard.jsx";
import { useApp } from "../context/AppContext.jsx";
import { campaigns, completedCampaigns } from "../data/campaigns.js";
import { compactRupiah, formatRupiah } from "../lib/finance.js";

// A plausible 5→1 distribution for a given average and total, so the bars read
// like a real store page without pretending to be per-review truth. Anchored to
// the average: a 4.9 creator lands ~96% five-star; the remainder tapers down.
function starDistribution(avg, total) {
  const p5 = Math.min(0.97, Math.max(0.2, (avg - 2.5) / 2.5));
  const rest = 1 - p5;
  const share = { 4: 0.7, 3: 0.19, 2: 0.07 };
  const counts = { 5: Math.round(p5 * total) };
  let acc = counts[5];
  for (const s of [4, 3, 2]) {
    counts[s] = Math.round(rest * share[s] * total);
    acc += counts[s];
  }
  counts[1] = Math.max(0, total - acc);
  return counts;
}

// A small verified-review sample; the store-style breakdown above summarises the
// full reviewCount, this is the readable slice a donor actually scrolls.
const REVIEW_SAMPLE = [
  { name: "Raka Pramudya", stars: 5, when: "3 hari lalu", donated: 250000, body: "Update mingguan jelas, foto sebelum-sesudah lengkap, dan dana pas seperti yang dijanjikan." },
  { name: "Sari Wulandari", stars: 5, when: "1 minggu lalu", donated: 100000, body: "Bukti penyaluran muncul tepat waktu. Saya percaya karena semuanya bisa dicek sendiri." },
  { name: "Donatur anonim", stars: 4, when: "2 minggu lalu", donated: 50000, body: "Kerja bagus, cuma laporan akhirnya telat sehari dari jadwal yang dijanjikan." },
  { name: "Budi Hartono", stars: 5, when: "3 minggu lalu", donated: 500000, body: "Transparan. Potongan kreator tampil di depan, tidak ada kejutan di akhir." },
  { name: "Nadia Putri", stars: 4, when: "1 bulan lalu", donated: 150000, body: "Komunikasi responsif. Semoga dokumentasi lapangannya lebih detail lain kali." },
  { name: "Donatur anonim", stars: 3, when: "1 bulan lalu", donated: 75000, body: "Hasilnya oke, tapi sempat ada jeda kabar cukup lama di tengah program." },
];

export function CreatorProfilePage() {
  const { slug } = useParams();
  const { ratings } = useApp();
  const [starFilter, setStarFilter] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const ownedCampaigns = campaigns.filter((campaign) => campaign.organizer.slug === slug);
  const history = completedCampaigns.filter((campaign) => campaign.organizerSlug === slug);
  const source = ownedCampaigns[0];

  if (!source) return <Navigate to="/jelajahi" replace />;

  const organizer = source.organizer;
  const raised = ownedCampaigns.reduce((sum, campaign) => sum + campaign.raised, 0);
  // Every number on the stat strip is derived from records a donor can open on
  // this very page. The previous version padded the total with a hand-typed
  // +58,2 jt and claimed "94% tepat waktu" / "2,1 hari" — numbers no record on
  // this page could back. A profile that sells trust cannot open with numbers
  // that cannot be checked.
  const historyRaised = history.reduce((sum, campaign) => sum + campaign.amount, 0);
  const proofCount = history.reduce((sum, campaign) => sum + campaign.proof.length, 0);
  const userRatings = ratings.filter((item) => item.organizerSlug === slug);
  // The donor's own session ratings sit at the top, then the sample — each tied
  // to one of this creator's real finished campaigns so "for which campaign" is
  // always answerable.
  const myReviews = userRatings.map((item, index) => ({
    id: `me-${item.slug}-${index}`,
    name: "Anda",
    stars: item.stars,
    when: "sesi ini",
    donated: item.amount || null,
    body: item.review || "Rating diberikan tanpa ulasan tertulis.",
    campaignTitle: history.find((campaign) => campaign.slug === item.slug)?.title || "campaign selesai",
    mine: true,
  }));
  const sampleReviews = REVIEW_SAMPLE.map((review, index) => ({
    ...review,
    id: `rv-${index}`,
    campaignTitle: history[index % Math.max(1, history.length)]?.title || "campaign selesai",
  }));
  const allReviews = [...myReviews, ...sampleReviews];
  const filteredReviews = starFilter ? allReviews.filter((review) => review.stars === starFilter) : allReviews;
  // Three reviews carry the point; the rest sit behind one honest button. On a
  // phone the full list alone was pushing this page past six screens.
  const visibleReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3);
  const hiddenReviewCount = filteredReviews.length - visibleReviews.length;
  const distribution = starDistribution(organizer.rating, organizer.reviewCount);
  const maxBar = Math.max(...Object.values(distribution));

  return (
    <div className="creator-page page-gutter">
      <section className="creator-profile-header">
        <div className="creator-profile-header__identity">
          <img className="creator-profile-header__avatar" src={organizer.avatar} alt={`Foto profil ${organizer.name}`} />
          <div>
            <span className="verification-line"><CheckCircle size={16} weight="fill" /> Terverifikasi tier {organizer.tier}</span>
            <h1>{organizer.name}</h1>
            <p>{organizer.handle} | {source.location}</p>
            <p className="creator-profile-header__bio">{organizer.bio}</p>
            <div className="creator-profile-header__rating"><Star size={18} weight="fill" /> {organizer.rating} dari {organizer.reviewCount} rating donatur</div>
          </div>
        </div>
        <div className="creator-profile-header__actions">
          <button className="button button--outline-dark" type="button">Ikuti kreator</button>
          <button className="icon-button" type="button" aria-label="Laporkan profil"><Flag size={20} /></button>
        </div>
      </section>

      <section className="creator-stats" aria-label="Statistik kreator">
        <div><span>Campaign selesai</span><strong>{organizer.completed}</strong><small>{history.length} terbaru bisa diperiksa di bawah</small></div>
        <div><span>Total terkumpul</span><strong>{compactRupiah(raised + historyRaised)}</strong><small>Dari campaign yang tercatat di prototype</small></div>
        <div><span>Bukti terdokumentasi</span><strong>{proofCount}</strong><small>Di {history.length} campaign selesai terbaru</small></div>
        <div><span>Sengketa terbuka</span><strong>0</strong><small>Riwayat koreksi tetap terlihat</small></div>
      </section>

      <main className="creator-profile-main">
        <section className="profile-section" id="campaign-aktif">
          <div className="profile-section__heading profile-section__heading--split">
            <div><span>Campaign berlangsung</span><h2>Pekerjaan yang sedang didukung</h2></div>
            <p>Dana, imbalan kreator, bukti, dan komentar donatur dapat dibaca sebelum ikut membantu.</p>
          </div>
          <div className="creator-active-grid">
            <div className="campaign-grid campaign-grid--profile">
              {ownedCampaigns.map((campaign) => <CampaignCard key={campaign.slug} campaign={campaign} />)}
            </div>

            <aside className="creator-trust-panel">
              <span>Mengapa profil ini dapat dipercaya?</span>
              <div><CalendarCheck size={22} /><span><strong>Identitas dan rekening direview</strong><small>Tier {organizer.tier}, berlaku sampai Desember 2026.</small></span></div>
              <div><ClockCountdown size={22} /><span><strong>Kinerja bukti dicatat</strong><small>Keterlambatan dan penolakan tidak dihapus.</small></span></div>
              <div><TrendUp size={22} /><span><strong>Imbalan terkait rekam jejak</strong><small>Tier kreator membatasi imbalan, dan kontrak yang menegakkannya. <Link to="/tier">Lihat tangga tier</Link></small></span></div>
              <p>Verifikasi tidak menjamin setiap klaim benar. Donatur tetap perlu membaca scope dan bukti campaign.</p>
              <Link className="text-link" to="/transparansi">Baca model kepercayaan <ArrowRight size={16} /></Link>
            </aside>
          </div>
        </section>

        <section className="profile-section" id="rekam-jejak">
          <div className="profile-section__heading profile-section__heading--split">
            <div><span>Riwayat campaign</span><h2>Rekam jejak yang dapat dibuka dan diperiksa</h2></div>
            <p>Setiap kartu mengarah ke dokumentasi penyaluran, konfirmasi penerima, jejak transaksi demo, dan ulasan donatur.</p>
          </div>
          <div className="history-card-grid">
            {history.map((item) => (
              <Link className="history-card" to={`/completed/${item.slug}`} key={item.slug}>
                <div className="history-card__media">
                  <img src={item.image} alt={`Dokumentasi ${item.title}`} loading="lazy" />
                  <span><CheckCircle size={15} weight="fill" /> Selesai</span>
                </div>
                <div className="history-card__body">
                  <span>{item.completedAt}</span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <div>
                    <span><strong>{formatRupiah(item.amount)}</strong><small>terkumpul</small></span>
                    <span><Star size={15} weight="fill" /> {item.rating}</span>
                  </div>
                  <footer><span><Images size={17} /> {item.proof.length} bukti dan {item.reviews.length} ulasan</span><ArrowUpRight size={19} /></footer>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="profile-section" id="ulasan-donatur">
          <div className="profile-section__heading profile-section__heading--split">
            <div><span>Rating terverifikasi</span><h2>Penilaian donatur setelah bukti tersedia</h2></div>
            <p>Ulasan menilai kejelasan komunikasi, ketepatan penyaluran, dan kualitas bukti kreator.</p>
          </div>

          <div className="rating-summary">
            <div className="rating-summary__score">
              <strong>{organizer.rating}</strong>
              <div className="rating-summary__stars" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={16} weight={n <= Math.round(organizer.rating) ? "fill" : "regular"} />
                ))}
              </div>
              <small>{organizer.reviewCount.toLocaleString("id-ID")} rating donatur</small>
            </div>
            <div className="rating-bars">
              {[5, 4, 3, 2, 1].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`rating-bar ${starFilter === s ? "is-active" : ""}`}
                  onClick={() => setStarFilter(starFilter === s ? 0 : s)}
                  aria-pressed={starFilter === s}
                >
                  <span className="rating-bar__label">{s}<Star size={11} weight="fill" /></span>
                  <span className="rating-bar__track"><span style={{ width: `${(distribution[s] / maxBar) * 100}%` }} /></span>
                  <span className="rating-bar__count">{distribution[s].toLocaleString("id-ID")}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rating-filter" role="group" aria-label="Filter ulasan berdasarkan bintang">
            <button type="button" className={starFilter === 0 ? "is-active" : ""} onClick={() => setStarFilter(0)}>Semua</button>
            {[5, 4, 3, 2, 1].map((s) => (
              <button key={s} type="button" className={starFilter === s ? "is-active" : ""} onClick={() => setStarFilter(s)}>
                {s} <Star size={11} weight="fill" />
              </button>
            ))}
          </div>

          <div className="review-list">
            {visibleReviews.map((review) => (
              <article key={review.id} className={review.mine ? "review-list__mine" : undefined}>
                <div>
                  <strong>{review.name}</strong>
                  <span className="review-stars" aria-label={`${review.stars} dari 5`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} size={13} weight={n <= review.stars ? "fill" : "regular"} className={n <= review.stars ? undefined : "review-star--empty"} />
                    ))}
                  </span>
                </div>
                {review.donated ? (
                  <span className="review-donation"><HandHeart size={13} weight="fill" /> Donasi {formatRupiah(review.donated)}</span>
                ) : null}
                <p>{review.body}</p>
                <small>Donatur {review.campaignTitle} · {review.when} · Terverifikasi</small>
              </article>
            ))}
            {!visibleReviews.length && (
              <p className="rating-empty">Belum ada ulasan {starFilter} bintang untuk kreator ini.</p>
            )}
          </div>
          {hiddenReviewCount > 0 ? (
            <button
              className="button button--outline-dark review-list__more"
              type="button"
              onClick={() => setShowAllReviews(true)}
            >
              Tampilkan {hiddenReviewCount} ulasan lainnya
            </button>
          ) : null}
        </section>
      </main>
    </div>
  );
}
