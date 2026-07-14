import Link from "next/link";
import { notFound } from "next/navigation";
import { getCircle } from "@/lib/circles/seed";
import { progressPct, type Circle } from "@/lib/circles/types";
import { donationBreakdown, PLATFORM_FEE_PCT } from "@/lib/circles/allowance";
import { formatParts } from "@/lib/ui/currency";

const categoryLabel: Record<Circle["category"], string> = {
  disaster: "Bencana",
  medical: "Medis",
  education: "Pendidikan",
  community: "Komunitas",
  family: "Keluarga",
  creator: "Kreator",
};

const photoFor: Partial<Record<Circle["category"], string>> = {
  disaster: "/circles/disaster.jpg",
  medical: "/circles/medical.jpg",
  education: "/circles/education.jpg",
  community: "/circles/livelihood.jpg",
  family: "/circles/livelihood.jpg",
};

function money(value: number) {
  const parts = formatParts(value, "id");
  return `${parts.symbol}${parts.int}`;
}

export default async function WebCampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const circle = getCircle(id);
  if (!circle) notFound();

  const pct = progressPct(circle);
  const allowance = circle.allowance?.percentage ?? 0;
  const beneficiary = 100 - allowance;
  const sample = donationBreakdown(100_000, allowance);
  const photo = photoFor[circle.category];
  const cover = photo
    ? `linear-gradient(180deg, rgba(11,18,32,.08), rgba(11,18,32,.78)), url(${photo}) center/cover`
    : `linear-gradient(140deg, ${circle.coverGradient[0]}, ${circle.coverGradient[1]})`;

  return (
    <div className="web-detail-page">
      <header className="web-detail-nav">
        <Link href="/web" className="web-detail-brand">
          <span>Ulurin</span>
          <small>Indonesia</small>
        </Link>
        <nav>
          <Link href="/web/feed">Cerita Kebaikan</Link>
          <Link href="/web#campaigns">Campaign</Link>
          <Link href="/web/transparency">Transparansi</Link>
          <Link href="/web/circles/create">Mulai campaign</Link>
        </nav>
      </header>

      <main className="web-detail-main">
        <Link href="/web#campaigns" className="web-detail-back">
          &larr; Kembali ke semua campaign
        </Link>

        <section className="web-detail-hero" style={{ background: cover }}>
          <div className="web-detail-hero-copy">
            <span className="web-detail-category">{categoryLabel[circle.category]}</span>
            <h1>{circle.title}</h1>
            <p>
              oleh <strong>{circle.organizer}</strong> &middot; {circle.organizerLocation}
            </p>
          </div>
        </section>

        <div className="web-detail-layout">
          <div className="web-detail-content">
            <section className="web-detail-section">
              <p className="web-detail-kicker">Cerita campaign</p>
              <h2>Kenapa bantuan ini dibutuhkan</h2>
              <div className="web-detail-story">
                {circle.story.split("\n\n").map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="web-detail-section">
              <p className="web-detail-kicker">Transparansi</p>
              <h2>Pembagian donasi terlihat sejak awal</h2>
              <div className="web-detail-split" aria-label="Pembagian donasi">
                <span style={{ width: `${beneficiary}%` }} />
                {allowance > 0 && <span style={{ width: `${allowance}%` }} />}
              </div>
              <div className="web-detail-split-labels">
                <span>{beneficiary}% untuk penerima</span>
                <span>{allowance}% Imbalan Kreator</span>
              </div>
              <div className="web-fee-list">
                <div className="web-fee-row beneficiary">
                  <div>
                    <strong>Untuk penerima</strong>
                    <small>Dana utama untuk kebutuhan campaign.</small>
                  </div>
                  <strong>{money(sample.beneficiary)}</strong>
                </div>
                <div className="web-fee-row creator">
                  <div>
                    <strong>Imbalan Kreator ({allowance}%)</strong>
                    <small>Transport, verifikasi, produksi cerita, koordinasi penyaluran, dan laporan.</small>
                  </div>
                  <strong>{money(sample.creator)}</strong>
                </div>
                <div className="web-fee-row platform">
                  <div>
                    <strong>Fee platform ({PLATFORM_FEE_PCT}%)</strong>
                    <small>Infrastruktur pembayaran, moderasi, keamanan, dan receipt publik.</small>
                  </div>
                  <strong>+{money(sample.platformFee)}</strong>
                </div>
              </div>
              <p className="web-detail-note">
                Contoh di atas memakai donasi Rp100.000. Fee platform ditambahkan
                pada checkout produksi dan belum dipungut oleh kontrak testnet saat ini.
                Imbalan Kreator tetap ditahan sampai bukti penyaluran tersedia.
              </p>
            </section>

            <section className="web-detail-section">
              <p className="web-detail-kicker">Donasi terbaru</p>
              <h2>Dukungan untuk campaign ini</h2>
              <div className="web-detail-donations">
                {circle.recentDonations.map((donation) => (
                  <div key={donation.id}>
                    <span className="web-detail-avatar" aria-hidden>
                      {donation.donorLabel.charAt(0).toUpperCase()}
                    </span>
                    <p>
                      <strong>{donation.donorLabel}</strong>
                      <small>{donation.whenLabel}</small>
                      {donation.note && <em>&ldquo;{donation.note}&rdquo;</em>}
                    </p>
                    <strong>{money(donation.amount)}</strong>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="web-detail-summary">
            <p className="web-detail-kicker">Dana terkumpul</p>
            <strong className="web-detail-raised">{money(circle.raisedAmount)}</strong>
            <p className="web-detail-target">dari target {money(circle.targetAmount)}</p>
            <div className="web-detail-progress" aria-label={`${pct}% terkumpul`}>
              <span style={{ width: `${pct}%` }} />
            </div>
            <div className="web-detail-metrics">
              <span>
                <strong>{pct}%</strong>
                terkumpul
              </span>
              <span>
                <strong>{circle.donorCount}</strong>
                donatur
              </span>
              <span>
                <strong>{circle.daysRemaining}</strong>
                hari lagi
              </span>
            </div>
            <Link href={`/web/circles/${circle.id}/donate`} className="web-detail-donate">
              Donasi sekarang
            </Link>
            <Link href={`/web/circles/${circle.id}/manage`} className="web-detail-manage">
              Organizer dashboard
            </Link>
            <Link href="/web/transparency" className="web-detail-text-link">
              Pelajari model transparansi
            </Link>
            <p className="web-detail-preview">Transaksi demo menggunakan Stellar testnet.</p>
          </aside>
        </div>
      </main>

      <style>{`
        .web-detail-page {
          position: fixed;
          inset: 0;
          z-index: 50;
          overflow-y: auto;
          background: #f4f6fb;
          color: #0b1220;
          font-family: var(--font-geist-sans), system-ui, sans-serif;
        }
        .web-detail-nav {
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px clamp(22px, 5vw, 72px);
          background: rgba(244, 246, 251, .9);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid #e6e8ee;
        }
        .web-detail-brand {
          display: inline-flex;
          align-items: baseline;
          gap: 10px;
          color: inherit;
          text-decoration: none;
        }
        .web-detail-brand span {
          font-size: 22px;
          font-weight: 800;
        }
        .web-detail-brand small {
          color: #5b6472;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        .web-detail-nav nav {
          display: flex;
          align-items: center;
          gap: 18px;
          font-size: 14px;
          font-weight: 700;
        }
        .web-detail-nav a {
          color: inherit;
          text-decoration: none;
        }
        .web-detail-nav nav a:last-child {
          padding: 10px 14px;
          border-radius: 8px;
          background: #2563eb;
          color: #fff;
        }
        .web-detail-main {
          width: min(1180px, calc(100% - 44px));
          margin: 0 auto;
          padding: 28px 0 72px;
        }
        .web-detail-back {
          display: inline-block;
          margin-bottom: 18px;
          color: #2563eb;
          font-size: 14px;
          font-weight: 800;
          text-decoration: none;
        }
        .web-detail-hero {
          position: relative;
          min-height: 440px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          border-radius: 8px;
        }
        .web-detail-hero-copy {
          width: min(760px, 100%);
          padding: clamp(24px, 5vw, 56px);
          color: #fff;
        }
        .web-detail-category {
          display: inline-block;
          padding: 6px 9px;
          border-radius: 6px;
          background: rgba(11,18,32,.7);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .web-detail-hero h1 {
          margin: 14px 0 12px;
          font-size: clamp(36px, 5vw, 64px);
          line-height: 1.02;
          letter-spacing: 0;
        }
        .web-detail-hero p {
          margin: 0;
          font-size: 16px;
        }
        .web-detail-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          gap: 28px;
          align-items: start;
          margin-top: 28px;
        }
        .web-detail-content {
          display: grid;
          gap: 18px;
        }
        .web-detail-section,
        .web-detail-summary {
          border: 1px solid #e6e8ee;
          border-radius: 8px;
          background: #fff;
          box-shadow: 0 18px 40px -34px rgba(11,18,32,.48);
        }
        .web-detail-section {
          padding: clamp(22px, 4vw, 36px);
        }
        .web-detail-kicker {
          margin: 0 0 8px;
          color: #b45309;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        .web-detail-section h2 {
          margin: 0 0 20px;
          font-size: 28px;
          letter-spacing: 0;
        }
        .web-detail-story p,
        .web-detail-note {
          color: #4b5563;
          font-size: 16px;
          line-height: 1.75;
        }
        .web-detail-story p:last-child {
          margin-bottom: 0;
        }
        .web-detail-split {
          display: flex;
          height: 14px;
          overflow: hidden;
          border-radius: 7px;
          background: #e6e8ee;
        }
        .web-detail-split span:first-child {
          background: #059669;
        }
        .web-detail-split span:last-child:not(:first-child) {
          background: #b45309;
        }
        .web-detail-split-labels {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          margin-top: 10px;
          color: #5b6472;
          font-size: 13px;
          font-weight: 700;
        }
        .web-detail-note {
          margin: 22px 0 0;
        }
        .web-detail-donations > div {
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
          padding: 15px 0;
          border-top: 1px solid #e6e8ee;
        }
        .web-detail-avatar {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #e8eefc;
          color: #1d4ed8;
          font-weight: 800;
        }
        .web-detail-donations p {
          display: grid;
          gap: 3px;
          margin: 0;
        }
        .web-detail-donations small,
        .web-detail-donations em {
          color: #5b6472;
          font-size: 12px;
        }
        .web-detail-donations em {
          font-style: normal;
        }
        .web-detail-donations > div > strong {
          color: #047857;
          white-space: nowrap;
        }
        .web-detail-summary {
          position: sticky;
          top: 96px;
          padding: 26px;
        }
        .web-detail-raised {
          display: block;
          margin-top: 5px;
          font-size: 32px;
        }
        .web-detail-target {
          margin: 3px 0 18px;
          color: #5b6472;
          font-size: 13px;
        }
        .web-detail-progress {
          height: 10px;
          overflow: hidden;
          border-radius: 5px;
          background: #e6e8ee;
        }
        .web-detail-progress span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: #059669;
        }
        .web-detail-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin: 18px 0 22px;
        }
        .web-detail-metrics span {
          color: #5b6472;
          font-size: 11px;
        }
        .web-detail-metrics strong {
          display: block;
          margin-bottom: 3px;
          color: #0b1220;
          font-size: 17px;
        }
        .web-detail-donate {
          display: block;
          padding: 14px 18px;
          border-radius: 8px;
          background: #2563eb;
          color: #fff;
          font-weight: 800;
          text-align: center;
          text-decoration: none;
        }
        .web-detail-donate:hover {
          background: #1d4ed8;
        }
        .web-detail-manage {
          display: block;
          margin-top: 9px;
          padding: 13px 18px;
          border: 1px solid #d6dae3;
          border-radius: 8px;
          background: #fff;
          color: #0b1220;
          font-weight: 800;
          text-align: center;
          text-decoration: none;
        }
        .web-detail-text-link {
          display: block;
          margin-top: 14px;
          color: #2563eb;
          font-size: 13px;
          font-weight: 800;
          text-align: center;
          text-decoration: none;
        }
        .web-detail-preview {
          margin: 10px 0 0;
          color: #5b6472;
          font-size: 11px;
          line-height: 1.45;
          text-align: center;
        }
        @media (max-width: 900px) {
          .web-detail-nav {
            align-items: flex-start;
            gap: 14px;
            flex-direction: column;
          }
          .web-detail-nav nav {
            flex-wrap: wrap;
          }
          .web-detail-main {
            width: min(100% - 28px, 720px);
          }
          .web-detail-hero {
            min-height: 360px;
          }
          .web-detail-layout {
            grid-template-columns: 1fr;
          }
          .web-detail-summary {
            position: static;
            grid-row: 1;
          }
        }
        @media (max-width: 560px) {
          .web-detail-nav nav a:not(:last-child) {
            display: none;
          }
          .web-detail-hero {
            min-height: 320px;
          }
          .web-detail-hero h1 {
            font-size: 34px;
          }
          .web-detail-donations > div {
            grid-template-columns: 40px minmax(0, 1fr);
          }
          .web-detail-donations > div > strong {
            grid-column: 2;
          }
        }
      `}</style>
    </div>
  );
}
