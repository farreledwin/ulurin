"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  joinCirclesWaitlist,
  ulurinCreateCampaign,
  ulurinDonate,
  ulurinFundDemoAccounts,
  ulurinGetCampaign,
  ulurinReleaseAllowance,
  ulurinUploadProof,
  ulurinWithdrawBeneficiary,
} from "@/app/actions";
import type { Circle, CircleCategory } from "@/lib/circles/types";
import { progressPct } from "@/lib/circles/types";
import {
  donationBreakdown,
  KYC_TIER_CEILING,
  KYC_TIER_NAME,
  PLATFORM_FEE_PCT,
  type KycTier,
} from "@/lib/circles/allowance";
import { formatParts } from "@/lib/ui/currency";
import WebShell from "./WebShell";

type OnchainState = {
  raisedStroops: string;
  beneficiaryAvailableStroops: string;
  allowanceEscrowStroops: string;
  allowancePct: number;
  proofUploaded: boolean;
};

const categoryLabel: Record<CircleCategory, string> = {
  disaster: "Bencana",
  medical: "Medis",
  education: "Pendidikan",
  community: "Komunitas",
  family: "Keluarga",
  creator: "Kreator sosial",
};

const photoFor: Partial<Record<CircleCategory, string>> = {
  disaster: "/circles/disaster.jpg",
  medical: "/circles/medical.jpg",
  education: "/circles/education.jpg",
  community: "/circles/livelihood.jpg",
  family: "/circles/livelihood.jpg",
};

const quickAmounts = [25_000, 50_000, 100_000, 250_000, 500_000];

function money(value: number) {
  const parts = formatParts(value, "id");
  return `${parts.symbol}${parts.int}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "campaign-baru";
}

function Status({ message, link, success = false }: { message: string; link?: string; success?: boolean }) {
  if (!message) return null;
  return (
    <div className={`web-flow-status ${success ? "success" : "warn"}`} role="status">
      {message}{" "}
      {link && (
        <a href={link} target="_blank" rel="noreferrer" className="web-flow-link">
          Lihat transaksi
        </a>
      )}
    </div>
  );
}

export function WebCreateCampaign() {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [category, setCategory] = useState<CircleCategory>("community");
  const [target, setTarget] = useState(50_000_000);
  const [days, setDays] = useState(30);
  const [allowance, setAllowance] = useState(0);
  const [acknowledged, setAcknowledged] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const tier: KycTier = allowance > 5 ? 2 : allowance > 0 ? 1 : 0;
  const beneficiary = 100 - allowance;
  const sample = donationBreakdown(100_000, allowance);

  function validate() {
    if (title.trim().length < 6) return "Judul campaign minimal 6 karakter.";
    if (story.trim().length < 40) return "Cerita campaign minimal 40 karakter.";
    if (!(target > 0)) return "Target dana harus lebih dari Rp0.";
    if (allowance > 0 && !acknowledged) return "Konfirmasi aturan allowance terlebih dahulu.";
    return "";
  }

  function saveDraft() {
    const invalid = validate();
    if (invalid) {
      setSuccess(false);
      setMessage(invalid);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setSuccess(false);
      setMessage("Masukkan alamat email yang valid.");
      return;
    }
    setMessage("");
    setLink("");
    startTransition(async () => {
      const result = await joinCirclesWaitlist({
        email: email.trim(),
        circleId: `draft:${slugify(title)}`,
        locale: "id",
        rupiahPledge: target,
        anonymous: false,
        marketingOk: true,
      });
      setSuccess(result.ok);
      setMessage(result.ok ? "Draft tersimpan. Kami akan mengabari saat rail produksi siap." : result.error);
    });
  }

  function createOnTestnet() {
    const invalid = validate();
    if (invalid) {
      setSuccess(false);
      setMessage(invalid);
      return;
    }
    setMessage("");
    setLink("");
    startTransition(async () => {
      const result = await ulurinCreateCampaign({ allowancePct: allowance, tier });
      setSuccess(result.ok);
      setMessage(
        result.ok
          ? `Campaign testnet #${String(result.value ?? "")} berhasil dibuat.`
          : result.error,
      );
      setLink(result.ok ? result.link : "");
    });
  }

  return (
    <WebShell
      eyebrow="Buat campaign"
      title="Jelaskan kebutuhan dan pembagian dana sejak awal."
      description="Form desktop ini memakai alur dan testnet action yang sama dengan versi mobile, dengan semua detail penting terlihat dalam satu layar."
    >
      <div className="web-flow-grid">
        <section className="web-flow-card">
          <h2>Informasi campaign</h2>
          <form className="web-flow-form" onSubmit={(event) => event.preventDefault()}>
            <label className="web-flow-field">
              <span>Judul campaign</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Contoh: Bangun perpustakaan desa"
                maxLength={120}
              />
            </label>

            <label className="web-flow-field">
              <span>Cerita dan kebutuhan</span>
              <textarea
                value={story}
                onChange={(event) => setStory(event.target.value)}
                placeholder="Ceritakan siapa penerima manfaat, kebutuhan utama, dan rencana pelaporannya."
              />
            </label>

            <div className="web-flow-form-row">
              <label className="web-flow-field">
                <span>Kategori</span>
                <select value={category} onChange={(event) => setCategory(event.target.value as CircleCategory)}>
                  {Object.entries(categoryLabel).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              <label className="web-flow-field">
                <span>Durasi</span>
                <select value={days} onChange={(event) => setDays(Number(event.target.value))}>
                  <option value={14}>14 hari</option>
                  <option value={30}>30 hari</option>
                  <option value={60}>60 hari</option>
                  <option value={90}>90 hari</option>
                </select>
              </label>
            </div>

            <label className="web-flow-field">
              <span>Target dana (Rupiah)</span>
              <input
                type="number"
                min={1}
                step={100_000}
                value={target}
                onChange={(event) => setTarget(Number(event.target.value))}
              />
            </label>

            <label className="web-flow-field">
              <span>Allowance operasional: {allowance}%</span>
              <input
                type="range"
                min={0}
                max={10}
                value={allowance}
                onChange={(event) => setAllowance(Number(event.target.value))}
              />
            </label>

            {allowance > 0 && (
              <label className="web-flow-check">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(event) => setAcknowledged(event.target.checked)}
                />
                <span>
                  Saya memahami allowance ditahan di escrow sampai bukti penyaluran tersedia.
                  Tier yang dibutuhkan: <Link href="/web/you/kyc-tier" className="web-flow-link">Tier {tier}</Link>.
                </span>
              </label>
            )}

            <label className="web-flow-field">
              <span>Email organizer</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nama@email.com"
                autoComplete="email"
              />
            </label>
          </form>

          <Status message={message} link={link} success={success} />
          <div className="web-flow-actions">
            <button type="button" className="web-flow-button" disabled={pending} onClick={saveDraft}>
              {pending ? "Memproses..." : "Simpan draft"}
            </button>
            <button type="button" className="web-flow-button secondary" disabled={pending} onClick={createOnTestnet}>
              Buat di testnet
            </button>
            <Link href="/web" className="web-flow-link-button secondary">Batal</Link>
          </div>
        </section>

        <aside className="web-flow-card web-flow-summary">
          <p className="web-flow-kicker">Pratinjau</p>
          <h2>{title.trim() || "Judul campaign kamu"}</h2>
          <p>{categoryLabel[category]} &middot; {days} hari</p>
          <strong className="web-flow-money">{money(target || 0)}</strong>
          <div className="web-flow-split" aria-label="Pratinjau pembagian dana">
            <span style={{ width: `${beneficiary}%` }} />
            {allowance > 0 && <span style={{ width: `${allowance}%` }} />}
          </div>
          <div className="web-flow-split-labels">
            <span>{beneficiary}% penerima</span>
            <span>{allowance}% Imbalan Kreator</span>
          </div>
          <p className="web-fee-disclaimer">Contoh breakdown untuk setiap donasi Rp100.000.</p>
          <div className="web-fee-list">
            <div className="web-fee-row beneficiary">
              <div><strong>Penerima</strong><small>Kebutuhan utama campaign.</small></div>
              <strong>{money(sample.beneficiary)}</strong>
            </div>
            <div className="web-fee-row creator">
              <div><strong>Imbalan Kreator</strong><small>Kerja lapangan, verifikasi, cerita, penyaluran, dan laporan.</small></div>
              <strong>{money(sample.creator)}</strong>
            </div>
            <div className="web-fee-row platform">
              <div><strong>Platform ({PLATFORM_FEE_PCT}%)</strong><small>Ditambahkan di checkout produksi untuk infrastruktur dan keamanan; belum dipungut di testnet.</small></div>
              <strong>+{money(sample.platformFee)}</strong>
            </div>
          </div>
          <div className="web-flow-mini-grid">
            <div className="web-flow-mini"><span>KYC minimum</span><strong>Tier {tier}</strong></div>
            <div className="web-flow-mini"><span>URL</span><strong>{slugify(title)}</strong></div>
          </div>
          <p className="web-flow-copy">Campaign belum dipublikasikan ke mainnet. Tombol testnet menjalankan kontrak demo yang sudah tersedia.</p>
        </aside>
      </div>
    </WebShell>
  );
}

export function WebDonate({ circle }: { circle: Circle }) {
  const [amount, setAmount] = useState(100_000);
  const [method, setMethod] = useState("qris");
  const [anonymous, setAnonymous] = useState(false);
  const [updates, setUpdates] = useState(true);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [success, setSuccess] = useState(false);
  const [chainState, setChainState] = useState<OnchainState | null>(null);
  const [pending, startTransition] = useTransition();

  const allowance = circle.allowance?.percentage ?? 0;
  const breakdown = donationBreakdown(amount, allowance);
  const photo = photoFor[circle.category];

  async function refresh() {
    const result = await ulurinGetCampaign();
    if (result.ok) {
      setChainState(result.state);
      setSuccess(true);
      setMessage("State campaign testnet diperbarui.");
    } else {
      setSuccess(false);
      setMessage(result.error);
    }
  }

  function run(action: "fund" | "refresh" | "donate") {
    setMessage("");
    setLink("");
    startTransition(async () => {
      if (action === "refresh") {
        await refresh();
        return;
      }
      if (action === "fund") {
        const result = await ulurinFundDemoAccounts();
        setSuccess(result.ok);
        setMessage(result.ok ? "Akun demo testnet berhasil didanai." : result.error);
        return;
      }
      const result = await ulurinDonate({ campaignId: 1, displayAmount: amount });
      setSuccess(result.ok);
      setMessage(result.ok ? `Donasi testnet terkirim: ${result.hash.slice(0, 10)}...` : result.error);
      setLink(result.ok ? result.link : "");
      if (result.ok) await refresh();
    });
  }

  function saveInterest() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setSuccess(false);
      setMessage("Masukkan alamat email yang valid.");
      return;
    }
    startTransition(async () => {
      const result = await joinCirclesWaitlist({
        email: email.trim(),
        circleId: circle.id,
        locale: "id",
        rupiahPledge: amount,
        anonymous,
        marketingOk: updates,
      });
      setSuccess(result.ok);
      setMessage(result.ok ? "Minat donasi tersimpan. Kami akan mengabari saat rail produksi siap." : result.error);
    });
  }

  return (
    <WebShell
      eyebrow="Donasi"
      title="Tentukan jumlah dukunganmu."
      description="Lihat pembagian setiap rupiah sebelum menyimpan pledge atau mencoba transaksi Stellar testnet."
    >
      <div className="web-flow-grid">
        <div className="web-flow-stack">
          <section className="web-flow-card web-campaign-context">
            <div
              className="web-campaign-context-image"
              style={{ background: photo ? `url(${photo}) center/cover` : `linear-gradient(140deg, ${circle.coverGradient[0]}, ${circle.coverGradient[1]})` }}
            />
            <div>
              <p className="web-flow-kicker">{categoryLabel[circle.category]}</p>
              <h2>{circle.title}</h2>
              <p>oleh {circle.organizer} &middot; {circle.organizerLocation}</p>
              <Link href={`/web/circles/${circle.id}`} className="web-flow-link">Kembali ke detail campaign</Link>
            </div>
          </section>

          <section className="web-flow-card">
            <h2>Jumlah donasi</h2>
            <div className="web-amount">
              <span>Rp</span>
              <input
                aria-label="Jumlah donasi dalam Rupiah"
                inputMode="numeric"
                value={amount}
                onChange={(event) => setAmount(Math.max(0, Number(event.target.value.replace(/\D/g, ""))))}
              />
            </div>
            <div className="web-quick-picks" aria-label="Pilihan jumlah cepat">
              {quickAmounts.map((value) => (
                <button key={value} type="button" aria-pressed={amount === value} onClick={() => setAmount(value)}>
                  {money(value)}
                </button>
              ))}
            </div>

            <p className="web-flow-label" style={{ marginTop: 24 }}>Metode pembayaran</p>
            <div className="web-choice-grid">
              {[
                ["qris", "QRIS"],
                ["wallet", "E-wallet"],
                ["balance", "Saldo Ulurin"],
              ].map(([value, label]) => (
                <button key={value} type="button" aria-pressed={method === value} onClick={() => setMethod(value)}>{label}</button>
              ))}
            </div>

            <div className="web-flow-form-row" style={{ marginTop: 20 }}>
              <label className="web-flow-check">
                <input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} />
                <span>Tampilkan sebagai donatur anonim</span>
              </label>
              <label className="web-flow-check">
                <input type="checkbox" checked={updates} onChange={(event) => setUpdates(event.target.checked)} />
                <span>Kirim update campaign ke email</span>
              </label>
            </div>

            <label className="web-flow-field" style={{ marginTop: 20 }}>
              <span>Email</span>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" />
            </label>

            <Status message={message} link={link} success={success} />
            <div className="web-flow-actions">
              <button type="button" className="web-flow-button" disabled={pending || amount <= 0} onClick={saveInterest}>
                {pending ? "Memproses..." : "Simpan minat donasi"}
              </button>
              <button type="button" className="web-flow-button success" disabled={pending || amount <= 0} onClick={() => run("donate")}>
                Donasi di testnet
              </button>
            </div>
          </section>
        </div>

        <aside className="web-flow-stack web-flow-summary">
          <section className="web-flow-card">
            <p className="web-flow-kicker">Rincian transparan</p>
            <strong className="web-flow-money">Donasi {money(amount)}</strong>
            <div className="web-fee-list">
              <div className="web-fee-row beneficiary">
                <div><strong>Untuk penerima</strong><small>Dana kebutuhan campaign.</small></div>
                <strong>{money(breakdown.beneficiary)}</strong>
              </div>
              <div className="web-fee-row creator">
                <div><strong>Imbalan Kreator ({allowance}%)</strong><small>Transport, verifikasi, produksi cerita, koordinasi, dan laporan.</small></div>
                <strong>{money(breakdown.creator)}</strong>
              </div>
              <div className="web-fee-row platform">
                <div><strong>Fee platform ({PLATFORM_FEE_PCT}%)</strong><small>Payment rail, moderasi, keamanan, dan receipt publik.</small></div>
                <strong>+{money(breakdown.platformFee)}</strong>
              </div>
            </div>
            <div className="web-flow-split" aria-label="Pembagian donasi">
              <span style={{ width: `${100 - allowance}%` }} />
              {allowance > 0 && <span style={{ width: `${allowance}%` }} />}
            </div>
            <div className="web-flow-split-labels">
              <span>{100 - allowance}% penerima</span>
              <span>{allowance}% Imbalan Kreator</span>
            </div>
            <div className="web-checkout-total">
              <span>Total checkout produksi</span>
              <strong>{money(breakdown.checkoutTotal)}</strong>
            </div>
            <p className="web-fee-disclaimer">Fee platform ditambahkan di atas donasi dan belum dipungut pada transaksi testnet saat ini.</p>
          </section>

          <section className="web-flow-card">
            <h3>Stellar testnet</h3>
            <p>Kampanye kontrak #1 memakai akun demo yang dikelola server.</p>
            {chainState && (
              <div className="web-flow-mini-grid">
                <div className="web-flow-mini"><span>Raised</span><strong>{chainState.raisedStroops}</strong></div>
                <div className="web-flow-mini"><span>Escrow</span><strong>{chainState.allowanceEscrowStroops}</strong></div>
                <div className="web-flow-mini"><span>Beneficiary</span><strong>{chainState.beneficiaryAvailableStroops}</strong></div>
                <div className="web-flow-mini"><span>Allowance</span><strong>{chainState.allowancePct}%</strong></div>
              </div>
            )}
            <div className="web-chain-actions">
              <button type="button" className="web-flow-button secondary" disabled={pending} onClick={() => run("fund")}>Fund demo</button>
              <button type="button" className="web-flow-button secondary" disabled={pending} onClick={() => run("refresh")}>Refresh</button>
            </div>
          </section>
        </aside>
      </div>
    </WebShell>
  );
}

export function WebManageCampaign({ circle }: { circle: Circle }) {
  const [state, setState] = useState<OnchainState | null>(null);
  const [proof, setProof] = useState(`Bukti penyaluran untuk ${circle.id}`);
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const pct = progressPct(circle);
  const allowance = circle.allowance;
  const allowancePct = allowance?.percentage ?? 0;

  async function refresh() {
    const result = await ulurinGetCampaign();
    if (result.ok) {
      setState(result.state);
      setSuccess(true);
      setMessage("State campaign testnet diperbarui.");
    } else {
      setSuccess(false);
      setMessage(result.error);
    }
  }

  function run(action: "refresh" | "withdraw" | "proof" | "release") {
    setMessage("");
    setLink("");
    startTransition(async () => {
      if (action === "refresh") {
        await refresh();
        return;
      }
      const result = action === "withdraw"
        ? await ulurinWithdrawBeneficiary()
        : action === "proof"
          ? await ulurinUploadProof({ campaignId: 1, proofText: proof })
          : await ulurinReleaseAllowance();
      setSuccess(result.ok);
      setMessage(result.ok ? `${action} tx: ${result.hash.slice(0, 10)}...` : result.error);
      setLink(result.ok ? result.link : "");
      if (result.ok) await refresh();
    });
  }

  return (
    <WebShell
      eyebrow="Organizer dashboard"
      title="Kelola campaign dan bukti penyaluran."
      description="Pantau progres, periksa escrow, dan jalankan action kontrak testnet dari workspace desktop."
    >
      <div className="web-manage-grid">
        <div className="web-flow-stack">
          <section className="web-flow-card">
            <p className="web-flow-kicker">Campaign aktif</p>
            <h2>{circle.title}</h2>
            <p>oleh {circle.organizer} &middot; {circle.organizerLocation}</p>
            <div className="web-flow-stat-grid">
              <div className="web-flow-stat"><span>Terkumpul</span><strong>{money(circle.raisedAmount)}</strong></div>
              <div className="web-flow-stat"><span>Progress</span><strong>{pct}%</strong></div>
              <div className="web-flow-stat"><span>Donatur</span><strong>{circle.donorCount}</strong></div>
            </div>
            <div className="web-flow-progress"><span style={{ width: `${pct}%` }} /></div>
            <div className="web-flow-actions">
              <Link href={`/web/circles/${circle.id}`} className="web-flow-link-button secondary">Lihat campaign</Link>
              <Link href="/web/you/kyc-tier" className="web-flow-link-button secondary">Lihat KYC tier</Link>
            </div>
          </section>

          <section className="web-flow-card">
            <h2>Upload bukti penyaluran</h2>
            <p>Bukti di-hash sebelum dikirim ke kontrak. Jangan masukkan data pribadi penerima pada demo.</p>
            <label className="web-flow-field">
              <span>Deskripsi bukti</span>
              <textarea value={proof} onChange={(event) => setProof(event.target.value)} />
            </label>
            <div className="web-flow-actions">
              <button type="button" className="web-flow-button" disabled={pending || !proof.trim()} onClick={() => run("proof")}>Upload proof</button>
              <button type="button" className="web-flow-button secondary" disabled={pending} onClick={() => run("release")}>Release allowance</button>
            </div>
          </section>

          <section className="web-flow-card">
            <h2>Reputasi organizer</h2>
            <div className="web-flow-stat-grid">
              <div className="web-flow-stat"><span>Tier</span><strong>{allowance?.tier ?? 0}</strong></div>
              <div className="web-flow-stat"><span>Allowance</span><strong>{allowancePct}%</strong></div>
              <div className="web-flow-stat"><span>Dispute</span><strong>0</strong></div>
            </div>
            <p className="web-flow-copy">Tier 2 membutuhkan enhanced KYC dan tiga campaign selesai dengan bukti terverifikasi.</p>
          </section>
        </div>

        <aside className="web-flow-stack web-flow-summary">
          <section className="web-flow-card">
            <p className="web-flow-kicker">Allowance escrow</p>
            <strong className="web-flow-money">{money(allowance?.accruedAmount ?? 0)}</strong>
            <p>{allowancePct > 0 ? "Terkunci sampai proof dan dispute window terpenuhi." : "Campaign ini tidak memakai allowance operasional."}</p>
          </section>

          <section className="web-flow-card">
            <h3>Testnet contract #1</h3>
            <p>State dan settlement action menggunakan kontrak Ulurin yang telah dideploy.</p>
            {state && (
              <div className="web-flow-mini-grid">
                <div className="web-flow-mini"><span>Raised</span><strong>{state.raisedStroops}</strong></div>
                <div className="web-flow-mini"><span>Beneficiary</span><strong>{state.beneficiaryAvailableStroops}</strong></div>
                <div className="web-flow-mini"><span>Escrow</span><strong>{state.allowanceEscrowStroops}</strong></div>
                <div className="web-flow-mini"><span>Proof</span><strong>{state.proofUploaded ? "Uploaded" : "Missing"}</strong></div>
              </div>
            )}
            <Status message={message} link={link} success={success} />
            <div className="web-chain-actions">
              <button type="button" className="web-flow-button secondary" disabled={pending} onClick={() => run("refresh")}>Refresh</button>
              <button type="button" className="web-flow-button secondary" disabled={pending} onClick={() => run("withdraw")}>Withdraw</button>
            </div>
          </section>
        </aside>
      </div>
    </WebShell>
  );
}

export function WebKycTier() {
  const [message, setMessage] = useState("");
  const tiers: KycTier[] = [0, 1, 2];

  return (
    <WebShell
      eyebrow="Identity & trust"
      title="KYC tier menentukan batas allowance."
      description="Semakin tinggi verifikasi dan rekam jejak organizer, semakin besar allowance operasional yang bisa ditampilkan secara terbuka."
    >
      <div className="web-tier-grid">
        {tiers.map((tier) => (
          <section key={tier} className={`web-flow-card web-tier-card ${tier === 0 ? "current" : ""}`}>
            <span className="web-tier-number">{tier}</span>
            <p className="web-flow-kicker">Maksimum {KYC_TIER_CEILING[tier]}%</p>
            <h2>Tier {tier}</h2>
            <p>{KYC_TIER_NAME[tier]}</p>
            <ul>
              <li>{tier === 0 ? "Tidak perlu verifikasi identitas" : tier === 1 ? "Verifikasi identitas dasar" : "Enhanced KYC dan rekam jejak"}</li>
              <li>Allowance campaign sampai {KYC_TIER_CEILING[tier]}%</li>
              <li>{tier === 2 ? "Minimal 3 campaign selesai" : "Pembagian selalu terlihat oleh donatur"}</li>
            </ul>
            {tier === 0 ? (
              <button type="button" className="web-flow-button secondary" disabled>Tier saat ini</button>
            ) : (
              <button type="button" className="web-flow-button" onClick={() => setMessage("Verifikasi KYC belum mengumpulkan dokumen pada versi preview ini.")}>Verifikasi identitas</button>
            )}
          </section>
        ))}
      </div>
      <Status message={message} />
      <div className="web-flow-actions">
        <Link href="/web/circles/create" className="web-flow-link-button">Buat campaign</Link>
        <Link href="/web/transparency" className="web-flow-link-button secondary">Pelajari transparansi</Link>
      </div>
    </WebShell>
  );
}
