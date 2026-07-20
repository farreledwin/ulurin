import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  HandCoins,
  ShieldCheck,
  Sparkle,
} from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ActivityTicker } from "../components/ActivityTicker.jsx";
import { ProofTimeline } from "../components/ProofTimeline.jsx";
import { SiteFooter } from "../components/SiteFooter.jsx";
import { campaigns } from "../data/campaigns.js";
import { compactRupiah, progressPercent } from "../lib/finance.js";

const heroCampaign = campaigns[0];
// Enam wajah kerja lapangan sebagai pembuka — satu foto latar diganti mosaik.
// File-file ini slot: menimpa public/assets/hero/*.webp mengganti wajah hero
// tanpa menyentuh kode. Alt ditulis per foto karena mosaik ini KONTEN, bukan
// dekorasi: inilah jawaban visual atas "apa itu Kreator Kebaikan".
const HERO_MOSAIC = [
  { src: "/assets/hero/sungai.webp", alt: "Kreator memunguti sampah plastik dari sungai bersama relawan" },
  { src: "/assets/hero/dapur.webp", alt: "Relawan dapur umum mengisi kotak makan siang" },
  { src: "/assets/hero/banjir.webp", alt: "Relawan menyerahkan paket bantuan kepada keluarga di posko banjir" },
  { src: "/assets/hero/lansia.webp", alt: "Pendamping berjalan menggandeng warga lansia" },
  { src: "/assets/hero/pendidikan.webp", alt: "Anak menerima perlengkapan sekolah di rumah belajar" },
  { src: "/assets/hero/hewan.webp", alt: "Perawat memeluk anjing rescue di penampungan" },
];
// Kipas mulai dari campaigns[1] lalu memutar: menjaga variasi urutan foto di
// bawah mosaik hero.
const fanCampaigns = [...campaigns.slice(1), campaigns[0]];
const FAN_MID = (fanCampaigns.length - 1) / 2;
// Ketiga angka diturunkan dari data campaign, bukan diketik; ikut berubah bila
// split-nya berubah. Kreator memakai MAX (plafon tertinggi = tier 2, 5%) supaya
// janji "paling banyak segini" jujur untuk semua kreator.
const minBeneficiaryShare = Math.min(...campaigns.map((campaign) => campaign.split.beneficiary));
const maxCreatorShare = Math.max(...campaigns.map((campaign) => campaign.split.creator));
const maxPlatformShare = Math.max(...campaigns.map((campaign) => campaign.split.platform));
const problemSlides = [
  {
    label: "Kasus ACT",
    value: "Rp117,98 miliar",
    body: "Dana dialihkan dari program Boeing untuk keluarga dan komunitas korban Lion Air JT610. Masalah strukturalnya adalah satu institusi menguasai dana, alokasi, laporan, dan bukti.",
  },
  {
    label: "PP No. 29/1980",
    value: "Aturannya sudah ada sejak 1980.",
    body: "Ulurin bukan membuat hukum baru. Prototype ini memperlihatkan bagaimana batas fee dapat menjadi aturan transaksi yang gagal sebelum pelanggaran terjadi.",
  },
];

export function LandingPage() {
  const problemTrackRef = useRef(null);
  const [activeProblem, setActiveProblem] = useState(0);

  const showProblemSlide = (index) => {
    const nextIndex = Math.max(0, Math.min(problemSlides.length - 1, index));
    const track = problemTrackRef.current;
    const slide = track?.children[nextIndex];
    setActiveProblem(nextIndex);
    track?.scrollTo?.({ left: slide?.offsetLeft || 0, behavior: "smooth" });
  };

  const syncProblemSlide = () => {
    const track = problemTrackRef.current;
    if (!track) return;
    const trackLeft = track.getBoundingClientRect().left;
    const nextIndex = Array.from(track.children).reduce((closest, slide, index) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - trackLeft);
      return distance < closest.distance ? { index, distance } : closest;
    }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;
    setActiveProblem((current) => current === nextIndex ? current : nextIndex);
  };

  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero__content page-gutter">
          <div className="landing-hero__copy">
            <h1 aria-label="Berbuat baik sebagai pekerjaan utama.">
              <span className="landing-hero__line">Berbuat baik </span>
              <span className="landing-hero__line">sebagai pekerjaan </span>
              <span className="landing-hero__line">
                utama<span className="landing-hero__period">.</span>
              </span>
            </h1>
            <p>
              Dukung Kreator Kebaikan yang bekerja setiap hari. Lihat pembagian dana sebelum
              berdonasi, lalu ikuti bukti sampai bantuan diterima.
            </p>
            <div className="landing-hero__actions">
              <Link className="button button--mint" to="/cerita">
                Mulai dari cerita <ArrowRight size={19} />
              </Link>
              <Link className="text-link text-link--light" to="/jelajahi">
                Satu cerita bisa lewat.<br />Dampaknya jangan.
              </Link>
            </div>
          </div>
        </div>
        {/* Enam foto = satu latar penuh yang melebur ke --ink (bukan kartu terpisah).
            Ditaruh SETELAH konten di DOM supaya screen reader membaca h1 dulu; z-index
            (mosaik 0 < scrim 1 < teks 2) yang menaruhnya di belakang, bukan urutan DOM.
            Tetap 6 <img> dari HERO_MOSAIC + alt bermakna karena mosaik ini KONTEN. */}
        <ul className="hero-mosaic" aria-label="Kerja Kreator Kebaikan di lapangan">
          {HERO_MOSAIC.map((photo, index) => (
            <li key={photo.src}>
              {/* Foto kiri-atas kandidat LCP terkuat -> fetchPriority high supaya
                  LCP tak bergantung urutan round-robin 6 unduhan eager. */}
              <img
                src={photo.src}
                alt={photo.alt}
                width="1536"
                height="1024"
                loading="eager"
                decoding="async"
                fetchPriority={index === 0 ? "high" : undefined}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="landing-fan" aria-labelledby="landing-fan-heading">
        {/* Split heading: headline left, the 93/5/2 stat rail right — otherwise
            a wide desktop leaves the whole right half empty and it reads broken. */}
        <div className="section-heading section-heading--split page-gutter">
          <div>
            <span className="section-number">Sedang berjalan</span>
            <h2 id="landing-fan-heading">Kerja baik yang bisa Anda lanjutkan hari ini.</h2>
          </div>
          <dl className="fan-split" aria-label="Pembagian setiap donasi di Ulurin">
            <div className="fan-split__row fan-split__row--beneficiary">
              <dt><span className="fan-split__cap">Minimal</span><span className="fan-split__pct">{minBeneficiaryShare}%</span></dt>
              <dd>langsung ke penerima</dd>
            </div>
            <div className="fan-split__row fan-split__row--creator">
              <dt><span className="fan-split__cap">Maksimal</span><span className="fan-split__pct">{maxCreatorShare}%</span></dt>
              <dd>imbalan kerja Kreator Kebaikan yang turun ke lapangan</dd>
            </div>
            <div className="fan-split__row fan-split__row--platform">
              <dt><span className="fan-split__cap">Maksimal</span><span className="fan-split__pct">{maxPlatformShare}%</span></dt>
              <dd>untuk operasional Ulurin</dd>
            </div>
          </dl>
        </div>

        <ul className="landing-fan__rail" aria-label="Campaign yang sedang berjalan">
          {fanCampaigns.map((campaign, index) => (
            <li
              key={campaign.slug}
              style={{
                "--fan-r": `${(index - FAN_MID) * 4}deg`,
                "--fan-y": `${(index - FAN_MID) ** 2 * 3.5}px`,
              }}
            >
              <Link className="fan-card" to={`/campaign/${campaign.slug}`}>
                <img
                  src={campaign.image}
                  alt={`Kegiatan ${campaign.shortTitle} di ${campaign.location}`}
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
                <span className="fan-card__meta">
                  <small>{campaign.category}</small>
                  <strong>{campaign.shortTitle}</strong>
                  <em>
                    {compactRupiah(campaign.raised)} · {progressPercent(campaign.raised, campaign.target)}% terkumpul
                  </em>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="landing-fan__more page-gutter">
          <Link className="text-link" to="/jelajahi">
            Jelajahi semua campaign <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <section className="landing-proof-band page-gutter">
        <div className="landing-proof-band__copy">
          <span>Bukti yang bisa diikuti</span>
          <h2>Setiap bantuan dicatat, diverifikasi, dan bisa dilacak.</h2>
        </div>
        <ProofTimeline />
      </section>

      <ActivityTicker />

      <section className="landing-problem section-shell page-gutter" id="masalah">
        <div className="section-heading section-heading--split">
          <div>
            <span className="section-number">01</span>
            <h2>Keinginan memberi tidak hilang. Kepercayaannya yang patah.</h2>
          </div>
          <p>
            Masalahnya bukan kurangnya orang baik. Donatur tidak dapat melihat siapa yang mengambil
            bagian, kapan dana bergerak, dan apakah bantuan benar-benar sampai.
          </p>
        </div>
        <div
          className="problem-ledger"
          ref={problemTrackRef}
          onScroll={syncProblemSlide}
          role="region"
          aria-roledescription="carousel"
          aria-label="Fakta masalah kepercayaan donasi"
        >
          {problemSlides.map((slide, index) => (
            <article
              className="problem-ledger__slide"
              key={slide.label}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} dari ${problemSlides.length}`}
            >
              <span>{slide.label}</span>
              <strong>{slide.value}</strong>
              <p>{slide.body}</p>
            </article>
          ))}
        </div>
        <div className="problem-ledger__controls" aria-label="Kontrol fakta masalah">
          <button
            type="button"
            onClick={() => showProblemSlide(activeProblem - 1)}
            disabled={activeProblem === 0}
            aria-label="Fakta sebelumnya"
          >
            <ArrowLeft size={18} />
          </button>
          <span aria-live="polite">{activeProblem + 1} dari {problemSlides.length}</span>
          <button
            type="button"
            onClick={() => showProblemSlide(activeProblem + 1)}
            disabled={activeProblem === problemSlides.length - 1}
            aria-label="Fakta berikutnya"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <section className="creator-economy section-shell">
        <div className="creator-economy__photo">
          <img src="/assets/campaigns/road-repair.webp" alt="Relawan memperbaiki jalan kampung" loading="lazy" />
        </div>
        <div className="creator-economy__copy">
          <span className="section-number">02</span>
          <h2>Kerja baik tidak harus disembunyikan sebagai biaya.</h2>
          <p>
            Kreator menemukan kasus, memverifikasi, bepergian, mengatur penyaluran, dan membuat bukti.
            Ulurin memberi pekerjaan itu nama, batas, alasan, dan syarat pencairan.
          </p>
          <ul>
            <li><HandCoins size={21} /> Imbalan diumumkan sebelum donatur membayar.</li>
            <li><ShieldCheck size={21} /> Tier 0 tidak dapat mengambil imbalan.</li>
            <li><CheckCircle size={21} /> Imbalan terkunci sampai bukti direview.</li>
          </ul>
          <Link className="text-link" to={`/creator/${heroCampaign.organizer.slug}`}>
            Lihat profil dan riwayat kreator <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <section className="vision-loop section-shell page-gutter">
        <div className="vision-loop__title">
          <Sparkle size={28} weight="fill" />
          <h2>Bukan satu gerakan yang viral. Ribuan pekerjaan baik yang bertahan.</h2>
        </div>
        <div className="vision-loop__flow" aria-label="Efek domino Ulurin">
          {[
            "Imbalan jujur",
            "Penolong bertahan",
            "Hasil selesai",
            "Bukti terlihat",
            "Kepercayaan tumbuh",
            "Donasi berulang",
          ].map((item, index) => (
            <div key={item}>
              <span>0{index + 1}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
        <p>
          Penghasilan Kreator tumbuh karena rekam jejak bantuannya semakin kuat, bukan karena penderitaan
          di dalam kontennya dibuat semakin dramatis.
        </p>
      </section>

      <section className="landing-final section-shell page-gutter">
        <span>Ulurin berasal dari ulurkan tangan.</span>
        <h2>Bantuannya sampai. Kerjanya dibayar. Tidak ada yang perlu menebak ke mana uang pergi.</h2>
        <div>
          <Link className="button button--mint" to="/cerita">Lihat cerita <ArrowRight size={18} /></Link>
          <Link className="button button--outline-light" to="/dashboard">Mulai sebagai kreator</Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
