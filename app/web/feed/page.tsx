import Link from "next/link";
import { PLATFORM_FEE_PCT } from "@/lib/circles/allowance";
import { SEED_CIRCLES } from "@/lib/circles/seed";
import { progressPct, type Circle } from "@/lib/circles/types";
import { formatParts } from "@/lib/ui/currency";

export const metadata = {
  title: "Cerita Kebaikan · Ulurin Web",
  description: "Feed campaign vertikal Ulurin untuk menemukan dan mendukung cerita kebaikan.",
};

const categoryLabel: Record<Circle["category"], string> = {
  disaster: "Bencana",
  medical: "Medis",
  education: "Pendidikan",
  community: "Komunitas",
  family: "Keluarga",
  creator: "Kreator kebaikan",
};

const photoFor: Record<Circle["category"], string> = {
  disaster: "/circles/disaster.jpg",
  medical: "/circles/medical.jpg",
  education: "/circles/education.jpg",
  community: "/circles/livelihood.jpg",
  family: "/circles/livelihood.jpg",
  creator: "/circles/education.jpg",
};

function money(value: number) {
  const parts = formatParts(value, "id");
  return `${parts.symbol}${parts.int}`;
}

export default function WebFeedPage() {
  return (
    <div className="web-feed-page">
      <header className="web-feed-nav">
        <Link href="/web" className="web-feed-brand">
          <span>Ulurin</span>
          <small>Cerita Kebaikan</small>
        </Link>
        <nav aria-label="Navigasi feed">
          <Link href="/web#campaigns">Semua campaign</Link>
          <Link href="/web/transparency">Transparansi</Link>
          <Link href="/web/circles/create">Mulai campaign</Link>
        </nav>
      </header>

      <main className="web-feed" aria-label="Feed Cerita Kebaikan">
        <h1 className="web-feed-sr-only">Cerita Kebaikan Ulurin</h1>
        {SEED_CIRCLES.map((circle, index) => {
          const pct = progressPct(circle);
          const creatorPct = circle.allowance?.percentage ?? 0;
          const story = circle.story.split("\n\n")[0];
          return (
            <article
              id={`story-${circle.id}`}
              key={circle.id}
              className="web-feed-slide"
              style={{ backgroundImage: `url(${photoFor[circle.category]})` }}
            >
              <div className="web-feed-shade" aria-hidden />
              <div className="web-feed-position" aria-label={`Cerita ${index + 1} dari ${SEED_CIRCLES.length}`}>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                <span>/ {String(SEED_CIRCLES.length).padStart(2, "0")}</span>
              </div>

              <div className="web-feed-content">
                <div className="web-feed-copy">
                  <div className="web-feed-chips">
                    <span>{categoryLabel[circle.category]}</span>
                    <span>{circle.organizerLocation}</span>
                  </div>
                  <h2>{circle.title}</h2>
                  <div className="web-feed-organizer">
                    <span aria-hidden>{circle.organizer.charAt(0).toUpperCase()}</span>
                    <p>
                      <strong>{circle.organizer}</strong>
                      <small>Kreator Kebaikan · {circle.daysRemaining} hari lagi</small>
                    </p>
                  </div>
                  <p className="web-feed-story">{story}</p>
                  <div className="web-feed-actions">
                    <Link href={`/web/circles/${circle.id}/donate`}>Donasi sekarang</Link>
                    <Link href={`/web/circles/${circle.id}`}>Lihat detail</Link>
                  </div>
                </div>

                <aside className="web-feed-funding" aria-label="Ringkasan pendanaan">
                  <p className="web-feed-label">Dana terkumpul</p>
                  <strong className="web-feed-raised">{money(circle.raisedAmount)}</strong>
                  <p className="web-feed-goal">dari {money(circle.targetAmount)}</p>
                  <div
                    className="web-feed-progress"
                    role="progressbar"
                    aria-label="Progress campaign"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={pct}
                  >
                    <span style={{ width: `${pct}%` }} />
                  </div>
                  <div className="web-feed-stats">
                    <span><strong>{pct}%</strong> terkumpul</span>
                    <span><strong>{circle.donorCount}</strong> donatur</span>
                  </div>
                  <div className="web-feed-fees">
                    <span><strong>{100 - creatorPct}%</strong> penerima</span>
                    <span><strong>{creatorPct}%</strong> Imbalan Kreator</span>
                    <span><strong>{PLATFORM_FEE_PCT}%</strong> fee platform</span>
                  </div>
                </aside>
              </div>
            </article>
          );
        })}
      </main>
    </div>
  );
}
