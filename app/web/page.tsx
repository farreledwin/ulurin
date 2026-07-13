import Link from "next/link";
import { SEED_CIRCLES } from "@/lib/circles/seed";
import { progressPct, type Circle } from "@/lib/circles/types";
import { formatParts } from "@/lib/ui/currency";

export const metadata = {
  title: "Ulurin Web",
  description: "Versi web desktop Ulurin untuk marketplace donasi Indonesia.",
};

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
  const p = formatParts(value, "id");
  return `${p.symbol}${p.int}`;
}

function CampaignCard({ circle, featured = false }: { circle: Circle; featured?: boolean }) {
  const pct = progressPct(circle);
  const allowance = circle.allowance?.percentage ?? 0;
  const photo = photoFor[circle.category];
  return (
    <Link
      href={`/circles/${circle.id}`}
      className={featured ? "web-card web-featured-card" : "web-card"}
    >
      <div
        className="web-cover"
        style={{
          background: photo
            ? `linear-gradient(180deg, rgba(11,18,32,.08), rgba(11,18,32,.62)), url(${photo}) center/cover`
            : `linear-gradient(140deg, ${circle.coverGradient[0]}, ${circle.coverGradient[1]})`,
        }}
      >
        <span>{categoryLabel[circle.category]}</span>
      </div>
      <div className="web-card-body">
        <div className="web-card-top">
          <p>{circle.organizerLocation}</p>
          <strong>{circle.daysRemaining} hari</strong>
        </div>
        <h3>{circle.title}</h3>
        <p className="web-organizer">oleh {circle.organizer}</p>
        <div className="web-progress">
          <span style={{ width: `${pct}%` }} />
        </div>
        <div className="web-money-row">
          <strong>{money(circle.raisedAmount)}</strong>
          <span>dari {money(circle.targetAmount)}</span>
        </div>
        <div className="web-meta-row">
          <span>{circle.donorCount} donatur</span>
          <span>{pct}% terkumpul</span>
          <span>{allowance}% operasional</span>
        </div>
      </div>
    </Link>
  );
}

export default function WebPage() {
  const [featured, ...others] = SEED_CIRCLES;
  const totalRaised = SEED_CIRCLES.reduce((sum, c) => sum + c.raisedAmount, 0);
  const totalTarget = SEED_CIRCLES.reduce((sum, c) => sum + c.targetAmount, 0);
  const donors = SEED_CIRCLES.reduce((sum, c) => sum + c.donorCount, 0);

  return (
    <div className="web-page">
      <header className="web-nav">
        <Link href="/web" className="web-brand">
          <span>Ulurin</span>
          <small>Indonesia</small>
        </Link>
        <nav>
          <a href="#campaigns">Campaign</a>
          <a href="#transparency">Transparansi</a>
          <Link href="/circles/create">Mulai campaign</Link>
        </nav>
      </header>

      <main>
        <section className="web-hero">
          <div className="web-hero-copy">
            <p className="web-kicker">Marketplace donasi transparan</p>
            <h1>Setiap rupiah terlihat sebelum dan sesudah donasi.</h1>
            <p className="web-lead">
              Ulurin menampilkan pembagian penerima, allowance operasional,
              bukti penyaluran, dan jejak testnet Stellar dalam satu web app
              yang nyaman dipakai di desktop.
            </p>
            <div className="web-actions">
              <Link href="#campaigns">Lihat campaign</Link>
              <Link href="/circles/create">Buat campaign</Link>
            </div>
          </div>
          <div className="web-hero-panel">
            <CampaignCard circle={featured} featured />
          </div>
        </section>

        <section className="web-stats" aria-label="Ringkasan marketplace">
          <div>
            <span>Total pratinjau</span>
            <strong>{money(totalRaised)}</strong>
            <small>dari {money(totalTarget)}</small>
          </div>
          <div>
            <span>Donatur seed</span>
            <strong>{donors.toLocaleString("id-ID")}</strong>
            <small>data pratinjau</small>
          </div>
          <div>
            <span>Batas allowance</span>
            <strong>0%-10%</strong>
            <small>berdasarkan tier KYC</small>
          </div>
          <div>
            <span>Status</span>
            <strong>Testnet</strong>
            <small>belum uang mainnet</small>
          </div>
        </section>

        <section id="campaigns" className="web-section">
          <div className="web-section-head">
            <div>
              <p className="web-kicker">Campaign aktif</p>
              <h2>Pilih tujuan yang ingin kamu bantu</h2>
            </div>
            <Link href="/circles">Buka versi mobile</Link>
          </div>
          <div className="web-grid">
            {others.map((circle) => (
              <CampaignCard key={circle.id} circle={circle} />
            ))}
          </div>
        </section>

        <section id="transparency" className="web-transparency">
          <div>
            <p className="web-kicker">Model transparansi</p>
            <h2>Donatur melihat split sebelum pledge.</h2>
            <p>
              Di public launch, setiap kontribusi, pencairan penerima, upload
              bukti, dan release allowance organizer diarahkan menjadi jejak
              audit publik. Untuk sekarang, halaman ini adalah web preview
              Indonesia-first.
            </p>
          </div>
          <div className="web-trust-list">
            <span>0%-10% allowance terbuka</span>
            <span>Proof-gated release</span>
            <span>QRIS dan e-wallet sebagai arah rail fiat</span>
            <span>Stellar testnet primitive</span>
          </div>
        </section>
      </main>

      <style>{`
        .web-page {
          position: fixed;
          inset: 0;
          z-index: 50;
          overflow-y: auto;
          background: #f4f6fb;
          color: #0b1220;
          font-family: var(--font-geist-sans), system-ui, sans-serif;
        }
        .web-nav {
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px clamp(22px, 5vw, 72px);
          background: rgba(244, 246, 251, .86);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid #e6e8ee;
        }
        .web-brand {
          color: inherit;
          text-decoration: none;
          display: inline-flex;
          align-items: baseline;
          gap: 10px;
        }
        .web-brand span {
          font-weight: 800;
          font-size: 22px;
          letter-spacing: -.02em;
        }
        .web-brand small {
          color: #5b6472;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: .12em;
        }
        .web-nav nav {
          display: flex;
          align-items: center;
          gap: 18px;
          font-size: 14px;
          font-weight: 700;
        }
        .web-nav a {
          color: inherit;
          text-decoration: none;
        }
        .web-nav nav a:last-child {
          background: #2563eb;
          color: white;
          padding: 10px 14px;
          border-radius: 10px;
        }
        .web-page main {
          width: min(1180px, calc(100% - 44px));
          margin: 0 auto;
          padding: 48px 0 64px;
        }
        .web-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(360px, .75fr);
          gap: 34px;
          align-items: center;
        }
        .web-kicker {
          margin: 0 0 10px;
          color: #b45309;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        .web-hero h1 {
          margin: 0;
          max-width: 760px;
          font-size: clamp(42px, 6vw, 76px);
          line-height: .95;
          letter-spacing: -.055em;
        }
        .web-lead {
          max-width: 680px;
          margin: 22px 0 0;
          color: #5b6472;
          font-size: 18px;
          line-height: 1.65;
        }
        .web-actions {
          display: flex;
          gap: 12px;
          margin-top: 30px;
        }
        .web-actions a {
          text-decoration: none;
          font-weight: 800;
          border-radius: 12px;
          padding: 14px 18px;
          background: #0b1220;
          color: #fff;
        }
        .web-actions a + a {
          background: #fff;
          color: #0b1220;
          box-shadow: inset 0 0 0 1px #e6e8ee;
        }
        .web-hero-panel {
          min-width: 0;
        }
        .web-stats {
          margin-top: 36px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .web-stats div,
        .web-transparency,
        .web-card {
          background: #fff;
          border: 1px solid #e6e8ee;
          border-radius: 16px;
          box-shadow: 0 18px 40px -30px rgba(11,18,32,.45);
        }
        .web-stats div {
          padding: 18px;
        }
        .web-stats span,
        .web-stats small,
        .web-card-top,
        .web-meta-row,
        .web-organizer {
          color: #5b6472;
        }
        .web-stats span,
        .web-stats small {
          display: block;
          font-size: 12px;
        }
        .web-stats strong {
          display: block;
          margin: 6px 0 2px;
          font-size: 24px;
          letter-spacing: -.03em;
        }
        .web-section {
          margin-top: 58px;
        }
        .web-section-head {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 18px;
          margin-bottom: 18px;
        }
        .web-section-head h2,
        .web-transparency h2 {
          margin: 0;
          font-size: 34px;
          letter-spacing: -.035em;
        }
        .web-section-head a {
          color: #2563eb;
          font-weight: 800;
          text-decoration: none;
        }
        .web-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
        .web-card {
          overflow: hidden;
          color: inherit;
          text-decoration: none;
          transition: transform .16s ease, box-shadow .16s ease;
        }
        .web-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 22px 52px -30px rgba(11,18,32,.6);
        }
        .web-featured-card {
          border-radius: 22px;
        }
        .web-cover {
          min-height: 172px;
          display: flex;
          align-items: flex-start;
          padding: 14px;
        }
        .web-featured-card .web-cover {
          min-height: 240px;
        }
        .web-cover span {
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(11,18,32,.68);
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .08em;
        }
        .web-card-body {
          padding: 16px;
        }
        .web-card-top,
        .web-money-row,
        .web-meta-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: baseline;
        }
        .web-card-top p,
        .web-organizer {
          margin: 0;
          font-size: 13px;
        }
        .web-card-top strong {
          color: #059669;
          font-size: 12px;
        }
        .web-card h3 {
          min-height: 54px;
          margin: 10px 0 6px;
          font-size: 18px;
          line-height: 1.25;
          letter-spacing: -.02em;
        }
        .web-progress {
          height: 8px;
          margin: 16px 0 10px;
          border-radius: 999px;
          overflow: hidden;
          background: #e6e8ee;
        }
        .web-progress span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: #059669;
        }
        .web-money-row strong {
          font-size: 16px;
        }
        .web-money-row span,
        .web-meta-row {
          font-size: 12px;
        }
        .web-transparency {
          margin-top: 58px;
          padding: 28px;
          display: grid;
          grid-template-columns: 1fr .85fr;
          gap: 28px;
          align-items: center;
        }
        .web-transparency p {
          color: #5b6472;
          font-size: 16px;
          line-height: 1.7;
        }
        .web-trust-list {
          display: grid;
          gap: 10px;
        }
        .web-trust-list span {
          padding: 14px 16px;
          border-radius: 12px;
          background: #f4f6fb;
          font-weight: 800;
          color: #0b1220;
        }
        @media (max-width: 900px) {
          .web-nav {
            align-items: flex-start;
            gap: 14px;
            flex-direction: column;
          }
          .web-nav nav {
            flex-wrap: wrap;
          }
          .web-hero,
          .web-transparency {
            grid-template-columns: 1fr;
          }
          .web-stats,
          .web-grid {
            grid-template-columns: 1fr;
          }
          .web-page main {
            padding-top: 28px;
          }
        }
      `}</style>
    </div>
  );
}
