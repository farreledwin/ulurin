import {
  ArrowLeft,
  Bank,
  Check,
  CreditCard,
  Info,
  LockKey,
  QrCode,
  ShieldCheck,
  WarningCircle,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { MoneySplit } from "../components/MoneySplit.jsx";
import { useApp } from "../context/AppContext.jsx";
import { getCampaign } from "../data/campaigns.js";
import { formatRupiah } from "../lib/finance.js";
import { useUsdcRate } from "../lib/useUsdcRate.js";
import "./donate-chain.css";
import {
  CHAIN_CAMPAIGN_ID,
  formatUsdc,
  rupiahToUsdcUnits,
  settleOnTestnet,
} from "../lib/stellar.js";

const presets = [10000, 25000, 50000, 100000, 250000];
const methods = [
  { id: "qris", label: "QRIS", icon: QrCode },
  { id: "va", label: "Virtual account", icon: Bank },
  { id: "card", label: "Kartu", icon: CreditCard },
];

export function DonatePage() {
  const { slug } = useParams();
  const campaign = getCampaign(slug);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createDonation } = useApp();
  const { rate, source, live } = useUsdcRate();
  const requestedAmount = Number(searchParams.get("amount"));
  const initialAmount = requestedAmount >= 10000 ? requestedAmount : campaign?.suggestedDonation || 50000;
  const initialPreset = presets.includes(initialAmount);
  const [amount, setAmount] = useState(initialPreset ? initialAmount : 0);
  const [customAmount, setCustomAmount] = useState(initialPreset ? "" : String(initialAmount));
  const [recurring, setRecurring] = useState(Boolean(campaign?.recurring));
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [processing, setProcessing] = useState(false);
  const [chainError, setChainError] = useState(null);

  if (!campaign) return <Navigate to="/jelajahi" replace />;

  const finalAmount = customAmount ? Number(customAmount) : amount;
  const amountValid = Number.isFinite(finalAmount) && finalAmount >= 10000;

  const finish = (onchain) => {
    const receipt = createDonation({
      slug,
      amount: finalAmount,
      recurring,
      anonymous,
      message,
      paymentMethod,
      onchain,
      // Snapshot the rate this donation used, so the receipt records it as a fact.
      rate,
      rateSource: live ? source : "demo",
    });
    if (receipt) navigate(`/receipt/${receipt.id}`);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!amountValid || processing) return;
    setProcessing(true);
    window.setTimeout(() => finish(null), 850);
  };

  // The same donation, settled for real. Rupiah is converted at the stated demo
  // rate and the vault splits it on chain, so the receipt carries a hash that
  // can be checked rather than one this app made up. It sits beside the Xendit
  // flow rather than replacing it: Xendit is the payment story and stays
  // simulated, this is the proof that the rule is enforced somewhere real.
  const submitOnchain = async () => {
    if (!amountValid || processing) return;
    setProcessing(true);
    setChainError(null);
    try {
      finish(await settleOnTestnet({ campaignId: CHAIN_CAMPAIGN_ID, rupiah: finalAmount, rate }));
    } catch (error) {
      setChainError(error.message);
      setProcessing(false);
    }
  };

  return (
    <div className="donate-page page-gutter">
      <Link className="back-link" to={`/campaign/${campaign.slug}`}><ArrowLeft size={18} /> Kembali ke campaign</Link>
      <div className="donate-layout">
        <form className="donate-form" onSubmit={submit}>
          <header>
            <span>Donasi untuk</span>
            <h1>{campaign.shortTitle}</h1>
            <p>Anda akan melihat seluruh pembagian sebelum konfirmasi.</p>
          </header>

          <section className="form-section">
            <h2>1. Pilih nominal</h2>
            <div className="amount-grid">
              {presets.map((value) => (
                <button
                  type="button"
                  key={value}
                  className={!customAmount && amount === value ? "active" : ""}
                  onClick={() => {
                    setAmount(value);
                    setCustomAmount("");
                  }}
                >
                  {formatRupiah(value)}
                </button>
              ))}
            </div>
            <label className="field">
              <span>Nominal lain</span>
              <div className="currency-input"><span>Rp</span><input type="number" min="10000" step="1000" value={customAmount} onChange={(event) => setCustomAmount(event.target.value)} placeholder="Minimum 10.000" /></div>
            </label>
            {!amountValid ? <p className="field-error">Nominal minimum adalah Rp10.000.</p> : null}
          </section>

          <section className="donate-mobile-breakdown" aria-label="Pembagian dana sebelum pembayaran" aria-live="polite">
            <header>
              <span>Pembagian sebelum bayar</span>
              <strong>{formatRupiah(finalAmount || 0)}</strong>
            </header>
            <MoneySplit split={campaign.split} amount={finalAmount || 0} tier={campaign.organizer.tier} compact />
            <p><ShieldCheck size={17} /> Penerima dibayar lebih dulu. Imbalan kreator menunggu bukti direview.</p>
          </section>

          <section className="form-section">
            <h2>2. Atur dukungan</h2>
            <label className="choice-row">
              <span><strong>Dukung setiap bulan</strong><small>Setiap siklus menghasilkan receipt dan bukti baru.</small></span>
              <input type="checkbox" checked={recurring} onChange={(event) => setRecurring(event.target.checked)} />
            </label>
            <label className="choice-row">
              <span><strong>Tampilkan sebagai anonim</strong><small>Nominal tetap tercatat, nama Anda tidak tampil di aktivitas.</small></span>
              <input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} />
            </label>
            <label className="field">
              <span>Pesan untuk kreator, opsional</span>
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength="180" placeholder="Terima kasih sudah menjaga kerja ini tetap berjalan." />
              <small>{message.length}/180</small>
            </label>
          </section>

          <section className="form-section">
            <h2>3. Pilih pembayaran</h2>
            <div className="payment-methods">
              {methods.map(({ id, label, icon: Icon }) => (
                <button type="button" key={id} className={paymentMethod === id ? "active" : ""} onClick={() => setPaymentMethod(id)}>
                  <Icon size={23} />
                  <span><strong>{label}</strong><small>Xendit Sandbox simulasi</small></span>
                  {paymentMethod === id ? <Check size={18} weight="bold" /> : null}
                </button>
              ))}
            </div>
            <p className="provider-note"><Info size={17} /> Xendit Sandbox di layar ini adalah simulator pembayaran IDR, bukan Stellar anchor dan bukan transaksi sungguhan.</p>
          </section>

          <button className="button button--coral button--full donate-submit" type="submit" disabled={!amountValid || processing}>
            {processing ? "Memproses simulasi..." : `Kirim kebaikan · ${formatRupiah(finalAmount || 0)}`}
          </button>

          <section className="donate-chain">
            <div className="donate-chain__head">
              <span>ATAU KIRIM SUNGGUHAN</span>
              <h2>Jalankan donasi ini di Stellar Testnet.</h2>
              <p>
                Donasi yang sama, tapi dijalankan kontrak: dana terbagi on-chain dan imbalan kreator
                terkunci sampai bukti diunggah. Anda dapat hash transaksi yang bisa diperiksa siapa pun.
              </p>
            </div>
            <dl className="donate-chain__rate">
              <div><dt>Kurs {live ? source : "demo"}</dt><dd>Rp {rate.toLocaleString("id-ID")} / USDC</dd></div>
              <div><dt>Yang dikirim</dt><dd>{formatUsdc(rupiahToUsdcUnits(finalAmount || 0, rate))}</dd></div>
            </dl>
            <button
              type="button"
              className="button button--outline-dark button--full"
              onClick={submitOnchain}
              disabled={!amountValid || processing}
            >
              {processing ? "Mengirim ke testnet..." : "Kirim ke Stellar Testnet"}
            </button>
            {chainError ? (
              <p className="donate-chain__error"><WarningCircle size={17} /> {chainError}</p>
            ) : null}
            <p className="donate-chain__note">
              <Info size={17} /> Kurs di atas {live ? `dibaca live dari ${source}` : "memakai kurs demo (fallback)"} dan
              dicatat di receipt sebagai kurs saat donasi. Yang menandatangani adalah akun demo Ulurin di server, bukan
              wallet Anda. Testnet USDC bukan uang sungguhan.
            </p>
          </section>
        </form>

        <aside className="donate-summary">
          <img src={campaign.image} alt={`Campaign ${campaign.shortTitle}`} />
          <div>
            <span>{campaign.category}</span>
            <h2>{campaign.title}</h2>
            <p>oleh {campaign.organizer.name}</p>
          </div>
          <div className="donate-summary__amount">
            <small>Total donasi</small>
            <strong>{formatRupiah(finalAmount || 0)}</strong>
            <span>{recurring ? "Setiap bulan" : "Satu kali"}</span>
          </div>
          <MoneySplit split={campaign.split} amount={finalAmount || 0} tier={campaign.organizer.tier} />
          <div className="donate-summary__security">
            <LockKey size={19} />
            <span><strong>Prototype aman untuk dicoba</strong><small>Tidak meminta data kartu atau memindahkan uang.</small></span>
          </div>
          <p><ShieldCheck size={17} /> Penerima dibayar lebih dulu. Imbalan kreator menunggu bukti direview.</p>
        </aside>
      </div>
    </div>
  );
}
