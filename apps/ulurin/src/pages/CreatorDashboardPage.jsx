import { ArrowRight, ArrowSquareOut, BookmarkSimple, CaretRight, Clock, Plus, SealCheck, SignOut, Star } from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardDenied, DashboardLogin } from "../components/DashboardGate.jsx";
import { ReleaseStatus } from "../components/ReleaseStatus.jsx";
import { WalletBalanceCard } from "../components/WalletBalanceCard.jsx";
import { useApp } from "../context/AppContext.jsx";
import { campaigns, creatorHistory, getCampaign } from "../data/campaigns.js";
import { compactRupiah, creatorCeilingPct, formatRupiah, progressPercent } from "../lib/finance.js";
import { WALLET_ADDRESS, accountUrl, contractUrl, txUrl } from "../lib/stellar.js";

// Real settlement transactions of the live vault on Stellar testnet. These
// hashes are REAL — each resolves on Stellar Expert — so "cek di explorer" is an
// honest promise, not a fabricated link. The campaign/amount around each is this
// prototype's demo face on the one live vault (see lib/stellar.js); the rate is
// the disclosed demo rate. We attach them to the creator's own campaigns.
const SETTLEMENT_TX = [
  { hash: "0814821ac7f80598102c2297569b34f8aa7af5a23a21ca753c815db15705df87", date: "18 Jul 2026", amount: 250000, campaignIndex: 0 },
  { hash: "87c2017b63352b3b5d00fad8caec1feebaf62d446326a0cb4c8cf6df18b11179", date: "18 Jul 2026", amount: 100000, campaignIndex: 0 },
  { hash: "4e8f7453d2e6aa0e0fb76df07b59e11d5966bb669fbc4ea0f1727da8527e61ea", date: "16 Jul 2026", amount: 500000, historyIndex: 0 },
  { hash: "1b5f2ad3df0dac1f4cabde52aa4004d2a278f2e21a09de9b542c0f7a65a58730", date: "16 Jul 2026", amount: 175000, historyIndex: 1 },
  { hash: "c1aa9f176654c4b2fdb11bc5427faae65e50d5186eef3790e63a8d1b0d28cbd0", date: "16 Jul 2026", amount: 90000, campaignIndex: 0 },
  { hash: "29c66a22a93371fb079e481030bde48bbd53d333048c4162951220c0a4f562d4", date: "16 Jul 2026", amount: 300000, historyIndex: 2 },
  { hash: "3195197d1ce06f0898dc48f96da438cf6050a51caa1f35f16945c944a0ef1543", date: "16 Jul 2026", amount: 60000, campaignIndex: 0 },
  { hash: "697e086b90c765c767ca750ebf80aa6d165a88a6209e765d293642e33f416b2d", date: "16 Jul 2026", amount: 125000, historyIndex: 0 },
];

// The creator's latest news for a supported campaign, read from its real proof
// pipeline — no fabricated updates. A campaign donated to THIS session is fresh:
// nothing has been posted since, so it honestly reads "belum ada kabar". That
// accountable empty state is the point of the section, not a gap.
function kabarFor(campaign, isFresh) {
  const proof = campaign.proof || [];
  const total = proof.length;
  const verified = proof.filter((item) => item.status === "verified").length;
  const inReview = proof.filter((item) => item.status === "review").length;
  const pending = proof.filter((item) => item.status === "pending").length;
  if (isFresh) {
    return { tone: "wait", chip: "Baru kamu dukung", line: "Belum ada kabar baru sejak kamu dukung" };
  }
  if (verified > 0) {
    // Verified proof exists — say so, then disclose the remainder honestly. Never
    // fold a not-yet-submitted (pending) proof into "direview": name each status.
    const parts = [];
    if (inReview > 0) parts.push(`${inReview} direview`);
    if (pending > 0) parts.push(`${pending} menunggu bukti`);
    const line =
      verified === total
        ? `Semua ${total} bukti terverifikasi`
        : `${verified}/${total} bukti terverifikasi${parts.length ? ` · ${parts.join(" · ")}` : ""}`;
    return { tone: "verified", chip: "Terverifikasi", line };
  }
  // Reached only if nothing is verified yet. Every current campaign has >=1
  // verified proof, so this branch is dormant; if a 0-verified campaign is ever
  // seeded, name any `pending` here too so the remainder stays fully honest.
  if (inReview > 0) {
    return { tone: "review", chip: "Sedang direview", line: `${inReview} bukti sedang direview` };
  }
  return { tone: "wait", chip: "Menunggu kabar", line: "Belum ada kabar dari kreator" };
}

// Profile-first dashboard: the creator is the hero, their active campaign is the
// unit right under them, and their finished work is the track record below. Every
// control here goes to a real route (App.jsx) — no dead ends.
export function CreatorDashboardPage() {
  const campaign = campaigns[0];
  const { organizer } = campaign;
  const progress = progressPercent(campaign.raised, campaign.target);
  const reviewed = campaign.proof.filter((item) => item.status === "verified").length;
  const history = creatorHistory.slice(0, 3);
  const ledger = SETTLEMENT_TX.map((tx) => {
    const source = (tx.historyIndex !== undefined ? creatorHistory[tx.historyIndex] : campaigns[tx.campaignIndex]) ?? campaign;
    return { ...tx, name: source.shortTitle ?? source.title, category: source.category, image: source.image };
  });

  const { saved, supported, receipts, session, signIn, signOut } = useApp();
  const savedCampaigns = saved.map(getCampaign).filter(Boolean);
  const freshSlugs = new Set(Object.values(receipts).map((item) => item.slug));
  const kabar = supported
    .map((slug) => getCampaign(slug))
    .filter(Boolean)
    .map((campaignItem) => ({ campaign: campaignItem, news: kabarFor(campaignItem, freshSlugs.has(campaignItem.slug)) }));
  const [showAllTx, setShowAllTx] = useState(false);
  const visibleTx = showAllTx ? ledger : ledger.slice(0, 5);

  // The dashboard is gated behind a real Google login tied to one allowlisted
  // email (server-checked). No session -> sign in; wrong email -> honest denial.
  if (!session) return <DashboardLogin onSignIn={signIn} />;
  if (!session.owner) return <DashboardDenied email={session.email} onSignOut={signOut} />;

  return (
    <div className="dash2">
      {/* HERO — profile, centred, avatar dominant */}
      <header className="dash2-hero">
        <span
          className="dash2-hero__avatar"
          style={{ backgroundImage: `url(${organizer.avatar})` }}
          aria-hidden="true"
        />
        <span className="dash2-hero__eyebrow">Selamat datang</span>
        <h1>{organizer.name}</h1>
        <div className="dash2-hero__chips">
          {/* Read the tier and cap from the data, never assert them. */}
          <Link className="dash2-chip" to="/tier">
            Tier {organizer.tier} <span className="dash2-chip__dim">· maks {creatorCeilingPct(organizer.tier)}%</span>
          </Link>
          <Link className="dash2-chip" to={`/creator/${organizer.slug}#ulasan-donatur`}>
            <Star size={13} weight="fill" /> {organizer.rating}
          </Link>
          <Link className="dash2-chip" to={`/creator/${organizer.slug}`}>
            Profil 92%
          </Link>
        </div>
        <div className="dash2-hero__account">
          <span>Masuk sebagai {session.email || "akun Google"}</span>
          <button type="button" onClick={signOut}><SignOut size={13} weight="bold" /> Keluar</button>
        </div>
        {/* The wallet melts into the hero: same surface, same serif, buttons in
            the chips' language. The balance is this Google account's own real
            on-chain USDC shown in Rupiah; Deposit/Withdraw hit the Xendit sandbox. */}
        <WalletBalanceCard key={session.publicKey} session={session} />
      </header>

      {/* ACTIVE CAMPAIGN — overlaps the hero, real photo */}
      <section className="dash2-campaign">
        <Link className="dash2-campaign__photo" to={`/campaign/${campaign.slug}`}>
          <img src={campaign.image} alt={campaign.shortTitle} />
          <div className="dash2-campaign__caption">
            <span>Campaign aktif</span>
            <strong>{campaign.title}</strong>
          </div>
        </Link>
        <div className="dash2-campaign__body">
          <div className="dash2-campaign__figures">
            <strong>{compactRupiah(campaign.raised)} / {compactRupiah(campaign.target)}</strong>
            <span>{campaign.daysLeft} hari lagi</span>
          </div>
          <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
          <div className="dash2-campaign__meta">
            <span>{campaign.donors} donatur</span>
            <span>{reviewed}/{campaign.proof.length} bukti direview</span>
            <span>Imbalan {campaign.split.creator}%</span>
          </div>
          <Link className="button button--outline-dark dash2-campaign__proof" to={`/dashboard/bukti/${campaign.slug}`}>
            Unggah bukti penyaluran
          </Link>
        </div>
      </section>

      <Link className="button button--mint dash2-create" to="/dashboard/buat">
        <Plus size={18} /> Buat campaign baru
      </Link>

      {/* STATUS PENCAIRAN — read from the vault */}
      <section className="dash2-section">
        <div className="dash2-section__head">
          <span className="dash2-eyebrow">Status pencairan · 2% platform</span>
          <a className="dash2-link" href={contractUrl} target="_blank" rel="noreferrer">
            Kontrak <ArrowSquareOut size={13} />
          </a>
        </div>
        <ReleaseStatus slug={campaign.slug} />
      </section>

      {/* TRANSAKSI VAULT — the vault's real on-chain settlements (NOT the user's
          own wallet above); every hash opens a real tx on Stellar Expert. */}
      <section className="dash2-section">
        <div className="dash2-section__head">
          <span className="dash2-eyebrow">Transaksi vault · Stellar testnet</span>
          <span className="dash2-count">{visibleTx.length} dari {ledger.length}</span>
        </div>
        <ul className="dash2-ledger">
          {visibleTx.map((tx) => (
            <li key={tx.hash}>
              <img src={tx.image} alt="" loading="lazy" />
              <span className="dash2-ledger__main">
                <b>{tx.name}</b>
                <small>{tx.category} · {tx.date}</small>
              </span>
              <span className="dash2-ledger__amt">
                <b>{formatRupiah(tx.amount)}</b>
                <a className="dash2-ledger__tx" href={txUrl(tx.hash)} target="_blank" rel="noopener noreferrer" title="Lihat transaksi di Stellar Expert">
                  {tx.hash.slice(0, 6)}…{tx.hash.slice(-4)} <ArrowSquareOut size={11} />
                </a>
              </span>
            </li>
          ))}
        </ul>
        {!showAllTx && ledger.length > visibleTx.length ? (
          <button className="dash2-link dash2-showall" type="button" onClick={() => setShowAllTx(true)}>
            Lihat semua {ledger.length} transaksi <ArrowRight size={14} />
          </button>
        ) : null}
        <p className="dash2-ledger__note">
          Ini transaksi <strong>vault Ulurin</strong> di Stellar testnet — bukti split 93/5/2 jalan on-chain, <strong>bukan wallet pribadimu di atas</strong>.{" "}
          Tiap hash bisa diverifikasi publik; buka akun vault-nya di{" "}
          <a href={accountUrl(WALLET_ADDRESS)} target="_blank" rel="noopener noreferrer">Stellar Expert</a>. Nominal pakai kurs demo; nilainya token uji, bukan uang sungguhan.
        </p>
      </section>

      {/* RIWAYAT — the creator's finished work, each a door to its receipt */}
      <section className="dash2-section">
        <div className="dash2-section__head">
          <span className="dash2-eyebrow">Riwayat campaign selesai</span>
          <span className="dash2-count">{history.length} terbaru dari {organizer.completed}</span>
        </div>
        <ul className="dash2-history">
          {history.map((item) => (
            <li key={item.slug}>
              <Link to={`/completed/${item.slug}`}>
                <img src={item.image} alt="" loading="lazy" />
                <span className="dash2-history__main">
                  <b>{item.title}</b>
                  <small>
                    {item.completedAt} · <span className="dash2-history__star"><Star size={11} weight="fill" /> {item.rating}</span> · bukti lengkap
                  </small>
                </span>
                <span className="dash2-history__amt">
                  <b>{compactRupiah(item.amount)}</b>
                  <small>terkumpul</small>
                </span>
                <CaretRight size={16} className="dash2-history__chev" />
              </Link>
            </li>
          ))}
        </ul>
        <Link className="dash2-link dash2-history__all" to={`/creator/${organizer.slug}`}>
          Lihat semua {organizer.completed} campaign selesai <ArrowRight size={14} />
        </Link>
      </section>

      {/* KABAR — updates from campaigns the donor supported; the empty state is honest */}
      <section className="dash2-section">
        <div className="dash2-section__head">
          <span className="dash2-eyebrow">Kabar dari yang kamu dukung</span>
          <span className="dash2-count">{kabar.length} campaign</span>
        </div>
        {kabar.length ? (
          <ul className="dash2-kabar">
            {kabar.map(({ campaign: supportedCampaign, news }) => (
              <li key={supportedCampaign.slug}>
                <Link to={`/campaign/${supportedCampaign.slug}`}>
                  <img src={supportedCampaign.image} alt="" loading="lazy" />
                  <span className="dash2-kabar__main">
                    <b>{supportedCampaign.shortTitle}</b>
                    <small>{supportedCampaign.organizer.name} · {news.line}</small>
                  </span>
                  <span className={`dash2-kabar__chip dash2-kabar__chip--${news.tone}`}>
                    {news.tone === "verified" ? <SealCheck size={13} weight="fill" /> : <Clock size={13} />} {news.chip}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="dash2-empty">
            <Clock size={22} />
            <p>Belum ada campaign yang kamu dukung. Kabar dari kreator muncul di sini setelah kamu berdonasi.</p>
          </div>
        )}
      </section>

      {/* TERSIMPAN — the user's bookmarked campaigns */}
      <section className="dash2-section">
        <div className="dash2-section__head">
          <span className="dash2-eyebrow">Campaign tersimpan</span>
          <span className="dash2-count">{savedCampaigns.length} disimpan</span>
        </div>
        {savedCampaigns.length ? (
          <ul className="dash2-history">
            {savedCampaigns.map((item) => (
              <li key={item.slug}>
                <Link to={`/campaign/${item.slug}`}>
                  <img src={item.image} alt="" loading="lazy" />
                  <span className="dash2-history__main">
                    <b>{item.shortTitle}</b>
                    <small>{item.category} · {progressPercent(item.raised, item.target)}% terkumpul</small>
                  </span>
                  <span className="dash2-history__amt">
                    <b>{compactRupiah(item.raised)}</b>
                    <small>dari {compactRupiah(item.target)}</small>
                  </span>
                  <CaretRight size={16} className="dash2-history__chev" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="dash2-empty">
            <BookmarkSimple size={22} />
            <p>Belum ada campaign tersimpan. Ketuk ikon simpan di kartu campaign untuk menaruhnya di sini.</p>
          </div>
        )}
        <Link className="dash2-link dash2-history__all" to="/jelajahi">Jelajahi campaign <ArrowRight size={14} /></Link>
      </section>
    </div>
  );
}
