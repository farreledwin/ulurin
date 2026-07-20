import {
  ArrowLeft,
  ArrowLineDown,
  ArrowLineUp,
  ArrowSquareOut,
  CaretRight,
  Check,
  CircleNotch,
  Copy,
  DeviceMobile,
  ShieldCheck,
  X,
} from "@phosphor-icons/react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { formatRupiah } from "../lib/finance.js";
import { accountUrl } from "../lib/stellar.js";
import { useUsdcRate } from "../lib/useUsdcRate.js";
import { CardBrands, PayLogo, detectCardBrand } from "./PayLogo.jsx";

const shortAddr = (address) => `${address.slice(0, 6)}…${address.slice(-4)}`;
// The signed-in account's real on-chain USDC (a decimal string) converted to
// Rupiah at the given USDC/IDR rate. Never crypto on screen — the number is Rupiah.
const usdcToRupiah = (usdc, rate) => Math.round(Number(usdc ?? 0) * rate);

// A session token is b64url(payload).sig; read its exp client-side to tell a
// stale/expired login apart BEFORE starting a payment — so a deposit never gets
// to "paid" and then rejected by /api/settle with "sesi tidak valid".
const tokenValid = (token) => {
  if (typeof token !== "string" || !token.includes(".")) return false;
  try {
    let b = token.split(".")[0].replace(/-/g, "+").replace(/_/g, "/");
    b += "===".slice((b.length + 3) % 4);
    const { exp } = JSON.parse(atob(b));
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
};

// The dashboard wallet: a balance in the hero, with Deposit/Withdraw opening a
// checkout-grade bottom-sheet/modal step machine. Every money action is a real
// Xendit TEST-MODE call (/api/xendit): create_va (+expiry) / simulate, create_qr
// / simulate_qr (in-app QRIS), create_ewallet / ewallet_status (channel-specific
// OVO/DANA/GoPay/ShopeePay), card_charge (in-app Xendit.js tokenization + 3DS),
// validate_account (verified name), payout. Balance is local state.

const PRESETS = [50000, 100000, 250000, 500000];
const MIN = 10000;
const MAX = 100_000_000;
const WD_FEE = 2500;
// Mirror of api/settle.js MAX_WALLET_USDC — checked client-side too, so an
// over-cap deposit is blocked BEFORE the Xendit step rather than "paid" then
// rejected on-chain.
const MAX_WALLET_USDC = 500;
const PAYOUT_FAILED = new Set(["FAILED", "REJECTED", "CANCELLED", "REVERSED", "REFUNDED"]);

const METHODS = [
  {
    group: "E-Wallet",
    items: [
      { key: "GOPAY", label: "GoPay", sub: "Redirect ke GoPay", rail: "ewallet" },
      { key: "OVO", label: "OVO", sub: "Notifikasi ke aplikasi OVO", rail: "ewallet" },
      { key: "DANA", label: "DANA", sub: "Redirect ke DANA", rail: "ewallet" },
      { key: "SHOPEEPAY", label: "ShopeePay", sub: "Scan QR ShopeePay", rail: "ewallet" },
    ],
  },
  {
    group: "Transfer Bank · Virtual Account",
    items: [
      { key: "BCA", label: "BCA Virtual Account", sub: "Verifikasi otomatis", rail: "va", bank: "BCA" },
      { key: "BNI", label: "BNI Virtual Account", sub: "Verifikasi otomatis", rail: "va", bank: "BNI" },
      { key: "BRI", label: "BRI Virtual Account", sub: "Verifikasi otomatis", rail: "va", bank: "BRI" },
      { key: "MANDIRI", label: "Mandiri Virtual Account", sub: "Verifikasi otomatis", rail: "va", bank: "MANDIRI" },
      { key: "PERMATA", label: "Permata Virtual Account", sub: "Verifikasi otomatis", rail: "va", bank: "PERMATA" },
    ],
  },
  { group: "Scan QR", items: [{ key: "QRIS", label: "QRIS", sub: "Scan pakai aplikasi apa pun", rail: "qr" }] },
  { group: "Kartu", items: [{ key: "CARD", label: "Kartu Debit / Kredit", sub: "Isi kartu di app · Visa/Mastercard", rail: "card" }] },
];

const WD_BANKS = [
  { code: "ID_BCA", logo: "BCA", label: "BCA" },
  { code: "ID_BRI", logo: "BRI", label: "BRI" },
  { code: "ID_BNI", logo: "BNI", label: "BNI" },
  { code: "ID_MANDIRI", logo: "MANDIRI", label: "Mandiri" },
  { code: "ID_PERMATA", logo: "PERMATA", label: "Permata" },
];

async function xendit(body) {
  let response;
  try {
    response = await fetch("/api/xendit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Server Xendit tidak terjangkau dari build ini.");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Permintaan Xendit gagal.");
  return data;
}

function countdown(msLeft) {
  const s = Math.max(0, Math.floor(msLeft / 1000));
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}
const group4 = (n) => String(n).replace(/(.{4})(?=.)/g, "$1 ");
// Indonesian mobile -> E.164: 0812… / 62812… / 812… all become +62812…
const toE164 = (raw) => {
  const d = String(raw).replace(/\D/g, "");
  if (d.startsWith("0")) return "+62" + d.slice(1);
  if (d.startsWith("62")) return "+" + d;
  return "+62" + d;
};

// Load Xendit.js once, lazily — only when a card is actually paid. It tokenizes
// the PAN in the browser (straight to api.xendit.co), so the card number never
// reaches our server. No CSP on this site, so the external script isn't blocked.
let xenditJsPromise = null;
function ensureXenditJs() {
  if (window.Xendit) return Promise.resolve(window.Xendit);
  if (!xenditJsPromise) {
    xenditJsPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://js.xendit.co/v1/xendit.min.js";
      script.async = true;
      script.onload = () => (window.Xendit ? resolve(window.Xendit) : reject(new Error("Xendit.js gagal dimuat.")));
      script.onerror = () => { xenditJsPromise = null; reject(new Error("Xendit.js gagal dimuat.")); };
      document.head.appendChild(script);
    });
  }
  return xenditJsPromise;
}
// The PUBLISHABLE key lives in a server env; fetch it once at first card use.
let cachedPublicKey = null;
async function getPublicKey() {
  if (cachedPublicKey) return cachedPublicKey;
  const config = await xendit({ action: "public_config" });
  cachedPublicKey = config.publicKey || null;
  return cachedPublicKey;
}

export function WalletBalanceCard({ session }) {
  // The Stellar wallet is the signed-in Google account's own address, and the
  // balance is its REAL on-chain USDC (from api/wallet.js) shown in Rupiah. The
  // Xendit deposit/withdraw sandbox simulates the fiat rails on top of it. This
  // card renders for ANY signed-in account (owner or not) — the dashboard's
  // `if (!session) return` guarantees `session` is always present here.
  const addr = session.publicKey;
  const { settle, setToast, signOut } = useApp();
  const { rate, source, live } = useUsdcRate();
  // A persisted session from before the token feature (or older than 24h) has no
  // usable token — deposit/withdraw would fail server-side. Detect it up front.
  const sessionStale = !tokenValid(session.token);
  // The balance is the account's REAL on-chain USDC shown in Rupiah at the live
  // rate. Deposit/withdraw call settle() which moves USDC on-chain and updates
  // session.usdc, so this figure always matches what's on Stellar Expert.
  const balance = usdcToRupiah(session.usdc, rate);
  const [flow, setFlow] = useState(null); // "deposit" | "withdraw"
  const [phase, setPhase] = useState("method"); // method|amount|va|qr|ovophone|ewallet|card|card3ds|wsetup|wreview|success

  const [selected, setSelected] = useState(null); // deposit method item
  const [amount, setAmount] = useState("");
  const [va, setVa] = useState(null);
  const [qr, setQr] = useState(null);
  const [ewallet, setEwallet] = useState(null);
  const [ovoPhone, setOvoPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvn, setCardCvn] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardEmail, setCardEmail] = useState("");
  const [threeDsUrl, setThreeDsUrl] = useState(null);
  const [threeDsReveal, setThreeDsReveal] = useState(false); // hide the 3DS iframe behind a "verifying" overlay until a challenge actually needs the user
  const [openInstr, setOpenInstr] = useState(false);

  const [wdBank, setWdBank] = useState("ID_BCA");
  const [wdAccount, setWdAccount] = useState("");
  const [verified, setVerified] = useState(null);

  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null);
  const [copied, setCopied] = useState("");
  const [now, setNow] = useState(Date.now());
  const [successText, setSuccessText] = useState("");

  const value = Number(amount) || 0;
  const amountDisplay = amount ? Number(amount).toLocaleString("id-ID") : "";
  const validAmount = value >= MIN && value <= MAX;
  const validAccount = /^\d{6,20}$/.test(wdAccount);
  const validOvoPhone = /^0?\d{9,13}$/.test(ovoPhone.replace(/\D/g, ""));
  const cardDigits = cardNumber.replace(/\D/g, "");
  const cardBrand = detectCardBrand(cardDigits);
  const cardExpDigits = cardExp.replace(/\D/g, "");
  const cardNameParts = cardName.trim().split(/\s+/).filter(Boolean);
  const validCardEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cardEmail);
  const validCard =
    cardDigits.length >= 13 && cardDigits.length <= 19 &&
    /^(0[1-9]|1[0-2])$/.test(cardExpDigits.slice(0, 2)) &&
    cardExpDigits.length >= 4 &&
    /^\d{3,4}$/.test(cardCvn) &&
    cardNameParts.length >= 2 && validCardEmail;
  const wd = WD_BANKS.find((item) => item.code === wdBank) ?? WD_BANKS[0];
  const expiresAt = va?.expiresAt ?? qr?.expiresAt ?? null;

  useEffect(() => {
    if (!expiresAt) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  // On the 3DS step, keep the iframe behind a "Memverifikasi…" overlay. A
  // frictionless card clears in ~4s and jumps to success without ever showing
  // the (blank) frame; only if it's still pending after 5s — i.e. a real
  // challenge needs input — do we reveal the iframe.
  useEffect(() => {
    if (phase !== "card3ds") { setThreeDsReveal(false); return undefined; }
    const id = setTimeout(() => setThreeDsReveal(true), 5000);
    return () => clearTimeout(id);
  }, [phase]);

  const close = () => {
    setFlow(null);
    setPhase("method");
    setSelected(null);
    setAmount("");
    setVa(null);
    setQr(null);
    setEwallet(null);
    setOvoPhone("");
    setCardNumber("");
    setCardExp("");
    setCardCvn("");
    setCardName("");
    setCardEmail("");
    setThreeDsUrl(null);
    setVerified(null);
    setWdAccount("");
    setNote(null);
    setBusy(false);
    setOpenInstr(false);
    setSuccessText("");
  };
  // Gate both flows on a live session so we never let the user fill a card / pick
  // a rail only to be rejected at settle time. Fails LOUD and early with a re-login
  // hint instead.
  const requireSession = () => {
    if (sessionStale) {
      setToast("Sesi login kamu sudah kadaluarsa. Keluar lalu masuk lagi dengan Google untuk transaksi.");
      return false;
    }
    return true;
  };
  const openDeposit = () => { if (!requireSession()) return; close(); setFlow("deposit"); setPhase("method"); };
  const openWithdraw = () => { if (!requireSession()) return; close(); setFlow("withdraw"); setPhase("wsetup"); };

  const back = () => {
    setNote(null);
    if (phase === "amount") setPhase("method");
    else if (phase === "ovophone" || phase === "card") setPhase("amount");
    else if (phase === "card3ds") { setThreeDsUrl(null); setBusy(false); setPhase("card"); }
    else if (phase === "va" || phase === "qr" || phase === "ewallet") { setVa(null); setQr(null); setEwallet(null); setPhase("amount"); }
    else if (phase === "wreview") { setVerified(null); setPhase("wsetup"); }
    else close();
  };

  const copy = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((current) => (current === key ? "" : current)), 1800);
    } catch { /* clipboard unavailable */ }
  };
  const run = async (work) => {
    setBusy(true);
    setNote(null);
    try { await work(); } catch (error) { setNote({ tone: "err", text: error.message }); }
    setBusy(false);
  };
  const succeed = (text) => { setSuccessText(text); setPhase("success"); };

  // deposit
  const startDeposit = () =>
    run(async () => {
      // Block over-cap deposits before any Xendit step, so a user is never "paid"
      // then left with no on-chain credit (the settle endpoint would reject it).
      if (Number(session.usdc) + value / rate > MAX_WALLET_USDC) {
        setNote({ tone: "err", text: `Wallet demo dibatasi ${MAX_WALLET_USDC} USDC. Kurangi nominal deposit.` });
        return;
      }
      const ext = `ulurin-${selected.rail}-${Date.now()}`;
      if (selected.rail === "va") { setVa(await xendit({ action: "create_va", externalId: ext, amount: value, bankCode: selected.bank })); setPhase("va"); }
      else if (selected.rail === "qr") { setQr(await xendit({ action: "create_qr", referenceId: ext, amount: value })); setPhase("qr"); }
      else if (selected.rail === "ewallet") {
        // OVO is push-based — collect the phone first, then charge on that screen.
        if (selected.key === "OVO") { setPhase("ovophone"); return; }
        setEwallet(await xendit({ action: "create_ewallet", referenceId: ext, amount: value, channel: selected.key, returnUrl: window.location.href }));
        setPhase("ewallet");
      }
      else if (selected.rail === "card") { setPhase("card"); } // in-app form; tokenize on submit
    });
  const startOvoCharge = () =>
    run(async () => {
      setEwallet(await xendit({ action: "create_ewallet", referenceId: `ulurin-ewallet-${Date.now()}`, amount: value, channel: "OVO", mobileNumber: toE164(ovoPhone) }));
      setPhase("ewallet");
    });
  const checkEwallet = () =>
    run(async () => {
      const status = await xendit({ action: "ewallet_status", chargeId: ewallet.id });
      if (status.status === "SUCCEEDED") { await settle("deposit", ewallet.amount); succeed(`USDC masuk wallet · +${formatRupiah(ewallet.amount)} lewat ${selected?.label}.`); }
      else setNote({ tone: "warn", text: `Status masih ${status.status} — selesaikan pembayaran di ${selected?.label} dulu.` });
    });
  const payVa = () =>
    run(async () => {
      await xendit({ action: "simulate", externalId: va.externalId, amount: va.expectedAmount });
      await settle("deposit", va.expectedAmount);
      succeed(`USDC masuk wallet · +${formatRupiah(va.expectedAmount)} lewat VA ${va.bankCode}.`);
    });
  const payQr = () =>
    run(async () => {
      await xendit({ action: "simulate_qr", qrId: qr.id, amount: qr.amount });
      await settle("deposit", qr.amount);
      succeed(`USDC masuk wallet · +${formatRupiah(qr.amount)} lewat QRIS.`);
    });
  // Card (in-app Xendit.js): tokenize the PAN in the browser, then charge the
  // token server-side. createToken's callback can fire twice (IN_REVIEW -> 3DS
  // -> VERIFIED), so busy is managed by hand here rather than via run().
  const chargeCard = async (tokenId, ext, authenticationId) => {
    try {
      const charge = await xendit({ action: "card_charge", tokenId, externalId: ext, amount: value, authenticationId });
      if (charge.status === "CAPTURED" || charge.status === "AUTHORISED") {
        await settle("deposit", value);
        succeed(`USDC masuk wallet · +${formatRupiah(value)} lewat kartu ${charge.maskedCard ?? ""}.`);
      } else {
        setPhase("card");
        setNote({ tone: "err", text: charge.failureReason || `Pembayaran ditolak (${charge.status}).` });
      }
    } catch (error) {
      setPhase("card");
      setNote({ tone: "err", text: error.message });
    } finally {
      setBusy(false);
    }
  };
  const onCardToken = (err, token, ext) => {
    if (err) { setNote({ tone: "err", text: err.message || "Tokenisasi kartu gagal." }); setBusy(false); return; }
    if (token.status === "VERIFIED") chargeCard(token.id, ext, token.authentication_id);
    else if (token.status === "IN_REVIEW" && token.payer_authentication_url) { setThreeDsUrl(token.payer_authentication_url); setPhase("card3ds"); }
    else { setPhase("card"); setNote({ tone: "err", text: token.failure_reason || `Kartu ditolak (${token.status ?? "?"}).` }); setBusy(false); }
  };
  const payCard = async () => {
    setBusy(true);
    setNote(null);
    try {
      const Xendit = await ensureXenditJs();
      const publicKey = await getPublicKey();
      if (!publicKey) throw new Error("Kartu belum dikonfigurasi di server (set XENDIT_PUBLIC_KEY).");
      Xendit.setPublishableKey(publicKey);
      const ext = `ulurin-card-${Date.now()}`;
      Xendit.card.createToken(
        {
          amount: value,
          currency: "IDR",
          card_number: cardDigits,
          card_exp_month: cardExpDigits.slice(0, 2),
          card_exp_year: "20" + cardExpDigits.slice(2, 4),
          card_cvn: cardCvn,
          // This account requires cardholder details + mandatory 3DS on every
          // token (should_authenticate:false is refused), so every token comes
          // back IN_REVIEW -> the 3DS iframe re-fires the callback as VERIFIED.
          card_holder_first_name: cardNameParts[0],
          card_holder_last_name: cardNameParts.slice(1).join(" "),
          card_holder_email: cardEmail,
          is_multiple_use: false,
          should_authenticate: true,
        },
        (err, token) => onCardToken(err, token, ext),
      );
    } catch (error) {
      setNote({ tone: "err", text: error.message });
      setBusy(false);
    }
  };

  // withdraw
  const verifyAndReview = () =>
    run(async () => {
      const result = await xendit({ action: "validate_account", accountNumber: wdAccount, bankCode: wdBank });
      if (result.status !== "COMPLETED" || !result.accountHolderName) { setNote({ tone: "err", text: "Rekening tidak dapat diverifikasi. Cek nomor dan bank." }); return; }
      setVerified({ name: result.accountHolderName, simulated: result.simulated });
      setPhase("wreview");
    });
  const confirmWithdraw = () =>
    run(async () => {
      // Payout (Xendit sandbox) FIRST, and confirm it didn't fail, BEFORE debiting
      // real on-chain USDC — a failed payout must never cost the user their balance.
      const payout = await xendit({ action: "payout", referenceId: `ulurin-wd-${Date.now()}`, amount: value, channelCode: wdBank, accountNumber: wdAccount, accountHolderName: verified.name });
      if (payout.status && PAYOUT_FAILED.has(String(payout.status).toUpperCase())) {
        setNote({ tone: "err", text: `Payout ${payout.status} — saldo USDC-mu tidak dipotong.` });
        return;
      }
      await settle("withdraw", value);
      succeed(`USDC keluar wallet · ${formatRupiah(value)} ke ${wd.label} ····${wdAccount.slice(-4)}.`);
    });

  const bigAmount = (
    <label className="wsheet-amount">
      <span>Rp</span>
      <input inputMode="numeric" value={amountDisplay} onChange={(event) => setAmount(event.target.value.replace(/\D/g, "").slice(0, 9))} placeholder="0" autoFocus />
    </label>
  );
  const presetRow = (withMax) => (
    <div className="wsheet-presets">
      {PRESETS.map((preset) => (
        <button key={preset} type="button" className={value === preset ? "is-active" : ""} onClick={() => setAmount(String(preset))}>{formatRupiah(preset)}</button>
      ))}
      {withMax ? <button type="button" className={value === balance ? "is-active" : ""} onClick={() => setAmount(String(balance))}>Semua</button> : null}
    </div>
  );

  const title = {
    method: "Pilih metode", amount: "Isi nominal", va: "Transfer Virtual Account", qr: "Scan QRIS",
    ovophone: "Nomor OVO", ewallet: "Selesaikan pembayaran", card: "Kartu Debit / Kredit", card3ds: "Verifikasi kartu",
    wsetup: "Tarik saldo", wreview: "Tinjau penarikan", success: "Berhasil",
  }[phase] ?? "Wallet";

  return (
    <>
      <div className="hero-wallet">
        <span className="hero-wallet__label">Saldo wallet · testnet</span>
        <strong className="hero-wallet__balance">{formatRupiah(balance)}</strong>
        <span className="hero-wallet__sub">
          USDC di wallet Stellar-mu · dalam Rupiah · kurs {live ? source : "demo"} Rp {rate.toLocaleString("id-ID")}/USDC
        </span>
        <div className="hero-wallet__actions">
          <button type="button" onClick={openDeposit}><ArrowLineDown size={15} weight="bold" /> Deposit</button>
          <button type="button" onClick={openWithdraw}><ArrowLineUp size={15} weight="bold" /> Withdraw</button>
        </div>
        {sessionStale ? (
          <p className="hero-wallet__stale">
            Sesi login kadaluarsa. <button type="button" onClick={signOut}>Keluar</button> lalu masuk lagi dengan Google untuk deposit/withdraw.
          </p>
        ) : null}
        <div className="hero-wallet__addr">
          <span className="hero-wallet__addrlabel">Wallet Stellar testnet kamu</span>
          <div className="hero-wallet__addrchip">
            <code title={addr}>{shortAddr(addr)}</code>
            <button type="button" onClick={() => copy("addr", addr)} aria-label="Salin alamat wallet">
              {copied === "addr" ? <Check size={14} weight="bold" /> : <Copy size={14} />}
            </button>
            <a href={accountUrl(addr)} target="_blank" rel="noopener noreferrer" aria-label="Lihat alamat di Stellar Expert"><ArrowSquareOut size={14} /></a>
          </div>
        </div>
      </div>

      {flow ? (
        <div className="wsheet-overlay" role="dialog" aria-modal="true" onClick={close}>
          <div className="wsheet" onClick={(event) => event.stopPropagation()}>
            <header className="wsheet__head">
              {phase !== "method" && phase !== "wsetup" && phase !== "success" ? (
                <button className="wsheet__icon" type="button" aria-label="Kembali" onClick={back}><ArrowLeft size={18} /></button>
              ) : <span className="wsheet__icon" aria-hidden="true" />}
              <span className="wsheet__title">{title}</span>
              <button className="wsheet__icon" type="button" aria-label="Tutup" onClick={close}><X size={18} /></button>
            </header>
            {phase !== "success" ? <span className="wsheet__testnet"><ShieldCheck size={13} weight="fill" /> Xendit sandbox · bukan uang sungguhan</span> : null}

            <div className="wsheet__body">
              {/* DEPOSIT · method list */}
              {flow === "deposit" && phase === "method" ? (
                <div className="wsheet-methods">
                  {METHODS.map((section) => (
                    <div className="wsheet-group" key={section.group}>
                      <span className="wsheet-group__label">{section.group}</span>
                      {section.items.map((item) => (
                        <button key={item.key} type="button" className="wsheet-row" onClick={() => { setSelected(item); setPhase("amount"); }}>
                          {item.key === "CARD" ? <CardBrands /> : <PayLogo brand={item.key} />}
                          <span className="wsheet-row__text"><strong>{item.label}</strong><small>{item.sub}</small></span>
                          <CaretRight size={17} className="wsheet-row__chev" />
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              ) : null}

              {/* DEPOSIT · amount */}
              {flow === "deposit" && phase === "amount" && selected ? (
                <>
                  <div className="wsheet-chosen"><PayLogo brand={selected.key} /><span>{selected.label}</span></div>
                  {bigAmount}
                  {presetRow(false)}
                  <button className="wsheet-cta" type="button" disabled={!validAmount || busy} onClick={startDeposit}>
                    {busy ? <CircleNotch size={17} className="wsheet-spin" /> : `Lanjut${value ? ` · ${formatRupiah(value)}` : ""}`}
                  </button>
                  <p className="wsheet-fine">Maksimal {formatRupiah(MAX)}. Bebas biaya admin.</p>
                </>
              ) : null}

              {/* DEPOSIT · VA */}
              {flow === "deposit" && phase === "va" && va ? (
                <div className="wsheet-result">
                  <div className="wsheet-result__head"><PayLogo brand={va.bankCode} /><span>{va.bankCode} Virtual Account</span></div>
                  {va.expiresAt ? <span className="wsheet-pill">Selesaikan dalam {countdown(new Date(va.expiresAt).getTime() - now)}</span> : null}
                  <div className="wsheet-vanum">
                    <small>Nomor Virtual Account</small>
                    <div><code>{group4(va.accountNumber)}</code><button type="button" onClick={() => copy("va", va.accountNumber)}>{copied === "va" ? <Check size={15} weight="bold" /> : <Copy size={15} />}{copied === "va" ? "Tersalin" : "Salin"}</button></div>
                  </div>
                  <div className="wsheet-total"><span>Jumlah transfer <b>(harus tepat)</b></span><strong>{formatRupiah(va.expectedAmount)}</strong><button type="button" onClick={() => copy("amt", String(va.expectedAmount))}>{copied === "amt" ? <Check size={14} weight="bold" /> : <Copy size={14} />}</button></div>
                  <button className="wsheet-accordion" type="button" onClick={() => setOpenInstr((c) => !c)}>Cara bayar {openInstr ? "▲" : "▼"}</button>
                  {openInstr ? <ol className="wsheet-steps"><li>Buka m-banking / ATM {va.bankCode}.</li><li>Pilih Transfer → Virtual Account.</li><li>Masukkan nomor VA di atas.</li><li>Pastikan nominal tepat, lalu konfirmasi.</li></ol> : null}
                  <button className="wsheet-cta" type="button" disabled={busy} onClick={payVa}>{busy ? <CircleNotch size={17} className="wsheet-spin" /> : "Saya sudah bayar (simulasi sandbox)"}</button>
                </div>
              ) : null}

              {/* DEPOSIT · QRIS */}
              {flow === "deposit" && phase === "qr" && qr ? (
                <div className="wsheet-result wsheet-result--center">
                  <strong className="wsheet-qr__amt">{formatRupiah(qr.amount)}</strong>
                  <div className="wsheet-qr__plate"><QRCodeSVG value={qr.qrString} size={208} level="M" marginSize={2} bgColor="#ffffff" fgColor="#0b1713" /><span className="wsheet-qr__badge">QRIS</span></div>
                  {qr.expiresAt ? <span className="wsheet-pill">Berlaku {countdown(new Date(qr.expiresAt).getTime() - now)}</span> : null}
                  <p className="wsheet-fine">Scan dengan GoPay, DANA, OVO, ShopeePay, atau m-banking apa pun.</p>
                  <button className="wsheet-cta" type="button" disabled={busy} onClick={payQr}>{busy ? <CircleNotch size={17} className="wsheet-spin" /> : "Saya sudah bayar (simulasi sandbox)"}</button>
                </div>
              ) : null}

              {/* DEPOSIT · OVO phone (push channel needs a number first) */}
              {flow === "deposit" && phase === "ovophone" ? (
                <>
                  <div className="wsheet-chosen"><PayLogo brand="OVO" /><span>OVO · {formatRupiah(value)}</span></div>
                  <label className="wsheet-fieldlabel" htmlFor="ovo-phone">Nomor HP terdaftar di OVO</label>
                  <input id="ovo-phone" className="wsheet-field" inputMode="tel" value={ovoPhone} onChange={(event) => setOvoPhone(event.target.value.replace(/[^\d]/g, "").slice(0, 14))} placeholder="0812 3456 7890" autoFocus />
                  <button className="wsheet-cta" type="button" disabled={!validOvoPhone || busy} onClick={startOvoCharge}>{busy ? <CircleNotch size={17} className="wsheet-spin" /> : "Kirim permintaan ke OVO"}</button>
                  <p className="wsheet-fine">OVO mengirim notifikasi pembayaran ke aplikasimu. Di sandbox, pembayaran otomatis lunas.</p>
                </>
              ) : null}

              {/* DEPOSIT · e-wallet (channel-specific: OVO push / DANA·GoPay redirect / ShopeePay QR) */}
              {flow === "deposit" && phase === "ewallet" && ewallet ? (
                <div className={`wsheet-result${ewallet.actions.qrString ? " wsheet-result--center" : ""}`}>
                  <div className="wsheet-result__head"><PayLogo brand={selected?.key} /><span>{selected?.label}</span></div>
                  {ewallet.actions.qrString ? (
                    <>
                      <strong className="wsheet-qr__amt">{formatRupiah(ewallet.amount)}</strong>
                      <div className="wsheet-qr__plate"><QRCodeSVG value={ewallet.actions.qrString} size={208} level="M" marginSize={2} bgColor="#ffffff" fgColor="#0b1713" /><span className="wsheet-qr__badge">{selected?.label}</span></div>
                      <p className="wsheet-fine">Scan dengan aplikasi {selected?.label} untuk membayar {formatRupiah(ewallet.amount)}.</p>
                    </>
                  ) : ewallet.actions.checkoutUrl || ewallet.actions.deeplinkUrl ? (
                    <>
                      <p className="wsheet-fine">Buka {selected?.label} untuk menyetujui pembayaran {formatRupiah(ewallet.amount)}, lalu kembali ke sini.</p>
                      <a className="wsheet-link" href={ewallet.actions.checkoutUrl || ewallet.actions.deeplinkUrl} target="_blank" rel="noopener noreferrer">Buka {selected?.label} <ArrowSquareOut size={14} /></a>
                    </>
                  ) : (
                    <div className="wsheet-push">
                      <span className="wsheet-push__ping"><DeviceMobile size={26} weight="fill" /></span>
                      <p className="wsheet-fine">Permintaan <b>{formatRupiah(ewallet.amount)}</b> dikirim ke aplikasi OVO di <b>{ovoPhone}</b>. Buka OVO dan setujui pembayaran.</p>
                    </div>
                  )}
                  <button className="wsheet-cta" type="button" disabled={busy} onClick={checkEwallet}>{busy ? <CircleNotch size={17} className="wsheet-spin" /> : "Saya sudah bayar — cek status"}</button>
                </div>
              ) : null}

              {/* DEPOSIT · card (in-app Xendit.js tokenization — PAN never hits our server) */}
              {flow === "deposit" && phase === "card" ? (
                <>
                  <div className="wsheet-chosen">{cardBrand ? <PayLogo brand={cardBrand} /> : <CardBrands />}<span>Kartu · {formatRupiah(value)}</span></div>
                  <label className="wsheet-fieldlabel" htmlFor="cc-number">Nomor kartu</label>
                  <input id="cc-number" className="wsheet-field" inputMode="numeric" autoComplete="cc-number" value={cardNumber}
                    onChange={(event) => setCardNumber(event.target.value.replace(/\D/g, "").slice(0, 19).replace(/(.{4})(?=.)/g, "$1 "))}
                    placeholder="4000 0000 0000 1000" autoFocus />
                  <div className="wsheet-card__row">
                    <label className="wsheet-cardfield">
                      <span className="wsheet-fieldlabel">Berlaku (MM/YY)</span>
                      <input className="wsheet-field" inputMode="numeric" autoComplete="cc-exp" value={cardExp}
                        onChange={(event) => { const d = event.target.value.replace(/\D/g, "").slice(0, 4); setCardExp(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d); }}
                        placeholder="12/30" />
                    </label>
                    <label className="wsheet-cardfield">
                      <span className="wsheet-fieldlabel">CVN</span>
                      <input className="wsheet-field" inputMode="numeric" autoComplete="cc-csc" value={cardCvn}
                        onChange={(event) => setCardCvn(event.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" />
                    </label>
                  </div>
                  <label className="wsheet-fieldlabel" htmlFor="cc-name">Nama pemegang kartu</label>
                  <input id="cc-name" className="wsheet-field" autoComplete="cc-name" value={cardName}
                    onChange={(event) => setCardName(event.target.value)} placeholder="Budi Santoso" />
                  <label className="wsheet-fieldlabel" htmlFor="cc-email">Email</label>
                  <input id="cc-email" className="wsheet-field" type="email" inputMode="email" autoComplete="email" value={cardEmail}
                    onChange={(event) => setCardEmail(event.target.value)} placeholder="budi@email.com" />
                  <button className="wsheet-cta" type="button" disabled={!validCard || busy} onClick={payCard}>
                    {busy ? <><CircleNotch size={17} className="wsheet-spin" /> Memproses…</> : `Bayar ${formatRupiah(value)}`}
                  </button>
                  <p className="wsheet-fine"><ShieldCheck size={12} weight="fill" /> Nomor kartu di-tokenisasi langsung oleh Xendit — tidak melewati server Ulurin. Sandbox: kartu 4000 0000 0000 1000, CVN 123, exp 12/30.</p>
                </>
              ) : null}

              {/* DEPOSIT · card 3-D Secure — iframe runs behind a "verifying" overlay;
                  revealed only if a real challenge needs the user (sandbox: AUTHENTICATED) */}
              {flow === "deposit" && phase === "card3ds" && threeDsUrl ? (
                <div className="wsheet-3ds">
                  {threeDsReveal ? <p className="wsheet-fine">Selesaikan verifikasi 3-D Secure di bawah. <b>(Sandbox: pilih AUTHENTICATED)</b></p> : null}
                  <div className="wsheet-3ds__stage">
                    <iframe title="Verifikasi 3-D Secure" src={threeDsUrl} className={`wsheet-3ds__frame${threeDsReveal ? "" : " is-hidden"}`} />
                    {threeDsReveal ? null : (
                      <div className="wsheet-3ds__overlay">
                        <CircleNotch size={30} weight="bold" className="wsheet-spin" />
                        <strong>Memverifikasi pembayaran…</strong>
                        <small>Verifikasi 3-D Secure aman dari bank kamu.</small>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {/* WITHDRAW · setup */}
              {flow === "withdraw" && phase === "wsetup" ? (
                <>
                  {bigAmount}
                  {presetRow(true)}
                  {value > balance ? <p className="wsheet-err">Saldo tidak cukup (maks {formatRupiah(balance)}).</p> : null}
                  <span className="wsheet-group__label">Bank tujuan</span>
                  <div className="wsheet-bankgrid">
                    {WD_BANKS.map((item) => (
                      <button key={item.code} type="button" className={`wsheet-bankchip ${wdBank === item.code ? "is-active" : ""}`} onClick={() => setWdBank(item.code)}><PayLogo brand={item.logo} /></button>
                    ))}
                  </div>
                  <input className="wsheet-field" inputMode="numeric" value={wdAccount} onChange={(event) => setWdAccount(event.target.value.replace(/\D/g, ""))} placeholder={`Nomor rekening ${wd.label}`} />
                  <button className="wsheet-cta" type="button" disabled={!validAmount || value > balance || !validAccount || busy} onClick={verifyAndReview}>{busy ? <><CircleNotch size={17} className="wsheet-spin" /> Memverifikasi…</> : "Lanjut"}</button>
                  <p className="wsheet-fine">Nomor rekening diverifikasi ke bank sebelum lanjut.</p>
                </>
              ) : null}

              {/* WITHDRAW · review */}
              {flow === "withdraw" && phase === "wreview" && verified ? (
                <div className="wsheet-review">
                  <div className="wsheet-verified"><ShieldCheck size={20} weight="fill" /><div><small>Rekening atas nama</small><strong>{verified.name}{verified.simulated ? " (demo)" : ""}</strong></div><Check size={20} weight="bold" /></div>
                  <dl className="wsheet-summary">
                    <div><dt>Jumlah tarik</dt><dd>{formatRupiah(value)}</dd></div>
                    <div><dt>Biaya transfer (estimasi)</dt><dd>{formatRupiah(WD_FEE)}</dd></div>
                    <div className="wsheet-summary__net"><dt>Kamu terima</dt><dd>{formatRupiah(Math.max(0, value - WD_FEE))}</dd></div>
                    <div><dt>Tujuan</dt><dd>{wd.label} ····{wdAccount.slice(-4)}</dd></div>
                    <div><dt>Estimasi tiba</dt><dd>s/d 1 hari kerja</dd></div>
                  </dl>
                  <button className="wsheet-cta" type="button" disabled={busy} onClick={confirmWithdraw}>{busy ? <CircleNotch size={17} className="wsheet-spin" /> : "Konfirmasi penarikan"}</button>
                </div>
              ) : null}

              {/* SUCCESS */}
              {phase === "success" ? (
                <div className="wsheet-success">
                  <span className="wsheet-check"><Check size={40} weight="bold" /></span>
                  <strong>Berhasil</strong>
                  <p>{successText}</p>
                  <button className="wsheet-cta" type="button" onClick={close}>Selesai</button>
                </div>
              ) : null}

              {note ? <p className={`wsheet-note wsheet-note--${note.tone}`}>{note.text}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
