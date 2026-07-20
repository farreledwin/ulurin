import {
  CookingPot,
  GraduationCap,
  HandHeart,
  Leaf,
  Lifebuoy,
  MagnifyingGlass,
  PawPrint,
  SlidersHorizontal,
  SquaresFour,
  Tag,
  Wrench,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { ActivityTicker } from "../components/ActivityTicker.jsx";
import { CampaignCard } from "../components/CampaignCard.jsx";
import { campaigns, categories } from "../data/campaigns.js";

// One icon per seed category; Tag is the fallback so a category added to the
// seed later never ships an empty tile. The tiles stay the SAME filter buttons
// they always were — only the clothes changed, not the mechanism.
const CATEGORY_ICONS = {
  Semua: SquaresFour,
  Lingkungan: Leaf,
  Pangan: CookingPot,
  Infrastruktur: Wrench,
  Lansia: HandHeart,
  Pendidikan: GraduationCap,
  Hewan: PawPrint,
  Bencana: Lifebuoy,
};

export function ExplorePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [recurringOnly, setRecurringOnly] = useState(false);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return campaigns.filter((campaign) => {
      const matchesQuery = !normalized
        || `${campaign.title} ${campaign.location} ${campaign.organizer.name} ${campaign.category} ${campaign.excerpt}`.toLowerCase().includes(normalized);
      const matchesCategory = category === "Semua" || campaign.category === category;
      const matchesRecurring = !recurringOnly || campaign.recurring;
      return matchesQuery && matchesCategory && matchesRecurring;
    });
  }, [category, query, recurringOnly]);

  const isFiltered = query.trim() !== "" || category !== "Semua" || recurringOnly;

  return (
    <div className="explore-page page-gutter">
      <header className="explore-hero">
        <div>
          <h1>Temukan pekerjaan baik yang ingin Anda lanjutkan.</h1>
          <p>
            Bandingkan tujuan, lokasi, rekam jejak kreator, pembagian dana, dan bukti dari satu tempat.
          </p>
        </div>
        <div className="explore-search">
          <MagnifyingGlass size={21} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari campaign, kota, atau kreator"
            aria-label="Cari campaign"
          />
        </div>
      </header>

      <ActivityTicker />

      <section className="explore-controls" aria-label="Filter campaign">
        <div className="category-tabs" role="tablist" aria-label="Kategori">
          {categories.map((item) => {
            const Icon = CATEGORY_ICONS[item] ?? Tag;
            return (
              <button
                type="button"
                key={item}
                className={category === item ? "active" : ""}
                onClick={() => setCategory(item)}
                role="tab"
                aria-selected={category === item}
              >
                <span className="category-tabs__tile" aria-hidden="true">
                  <Icon size={26} />
                </span>
                <span className="category-tabs__name">{item}</span>
              </button>
            );
          })}
        </div>
        <label className="filter-toggle">
          <SlidersHorizontal size={18} />
          <input
            type="checkbox"
            checked={recurringOnly}
            onChange={(event) => setRecurringOnly(event.target.checked)}
          />
          Hanya dukungan bulanan
        </label>
      </section>

      <section className="explore-results">
        <div className="explore-results__heading">
          <h2>{isFiltered ? `Menampilkan ${results.length} dari ${campaigns.length} campaign` : `${campaigns.length} campaign`}</h2>
          <span>Semua data adalah contoh untuk prototype lokal.</span>
        </div>
        {results.length ? (
          <div className="campaign-grid">
            {results.map((campaign) => (
              <CampaignCard key={campaign.slug} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Belum ada campaign yang cocok.</h2>
            <p>Coba ganti kata pencarian atau matikan filter dukungan bulanan.</p>
            <button type="button" className="button button--outline-dark" onClick={() => {
              setQuery("");
              setCategory("Semua");
              setRecurringOnly(false);
            }}>
              Bersihkan filter
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
