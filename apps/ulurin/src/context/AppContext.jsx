import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { campaigns, getCampaign, seededActivity } from "../data/campaigns.js";
import { calculateSplit, createDemoHash } from "../lib/finance.js";

const AppContext = createContext(null);

// Small slug lists that persist in localStorage so they survive a reload (and the
// Android WebView restart): bookmarks (`saved`) and the campaigns you have
// supported (`supported`). A first-time visitor gets the seeded default; once a
// list is written — even empty — their own list wins. Guarded so a storage-less
// or blocked context just falls back to the seed and keeps working in memory.
const SAVED_KEY = "ulurin:saved";
const DEFAULT_SAVED = ["dapur-berbagi"];
const SUPPORTED_KEY = "ulurin:supported";
const DEFAULT_SUPPORTED = ["dapur-berbagi", "teman-lansia", "rumah-aman-hewan"];

function loadPersistedSlugs(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback; // null (never set) -> seed; "[]" (emptied) -> [] below
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((slug) => typeof slug === "string") : fallback;
  } catch {
    return fallback;
  }
}

function savePersistedSlugs(key, list) {
  try {
    window.localStorage.setItem(key, JSON.stringify(list));
  } catch {
    /* storage unavailable or full — keep working in memory */
  }
}

// The signed-in wallet session: verified Google email + the Stellar address the
// server derived for it + the owner flag that gates the demo dashboard. Persisted
// so a reload / WebView restart keeps you in.
//
// ponytail: this is a SOFT client-side gate for a TESTNET demo. `owner` lives
// here for UX and a devtools edit could flip it — but nothing sensitive sits
// behind the gate, and `publicKey` is server-derived from a Google-verified
// token, which cannot be forged. Do not reuse this trust model for anything real.
const SESSION_KEY = "ulurin:session";

function loadSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.publicKey === "string" ? parsed : null;
  } catch {
    return null;
  }
}

function persistSession(session) {
  try {
    if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable — session still lives in memory this run */
  }
}

// Theme preference: "system" | "light" | "dark". "system" stores NO key (falls
// through to prefers-color-scheme); an explicit "light"/"dark" is persisted so it
// survives a reload / WebView restart. An inline script in index.html already
// stamped data-theme on <html> before first paint (no flash) — this just keeps it
// in sync when the user changes it, and follows the OS live while on "system".
const THEME_KEY = "ulurin-theme";

function loadThemePref() {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

// Resolve the preference to a concrete theme and stamp it on <html>. Same logic
// as the pre-paint script in index.html, so the two never disagree.
function applyResolvedTheme(pref) {
  if (typeof document === "undefined") return;
  const prefersDark =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false;
  const dark = pref === "dark" || (pref === "system" && prefersDark);
  const root = document.documentElement;
  root.dataset.theme = dark ? "dark" : "light";
  root.style.colorScheme = dark ? "dark" : "light";
}

const copy = {
  id: {
    story: "Cerita",
    explore: "Jelajahi",
    transparency: "Transparansi",
    dashboard: "Dashboard Kreator",
    login: "Masuk",
    donate: "Donasi",
    localPrototype: "Prototipe lokal",
  },
  en: {
    story: "Stories",
    explore: "Explore",
    transparency: "Transparency",
    dashboard: "Creator dashboard",
    login: "Sign in",
    donate: "Donate",
    localPrototype: "Local prototype",
  },
};

export function AppProvider({ children }) {
  const [language, setLanguage] = useState("id");
  const [saved, setSaved] = useState(() => loadPersistedSlugs(SAVED_KEY, DEFAULT_SAVED));
  const [supported, setSupported] = useState(() => loadPersistedSlugs(SUPPORTED_KEY, DEFAULT_SUPPORTED));
  const [session, setSession] = useState(loadSession);
  const [themePref, setThemePrefState] = useState(loadThemePref);
  const [receipts, setReceipts] = useState({});
  const [ratings, setRatings] = useState([]);
  const [campaignComments, setCampaignComments] = useState(() =>
    Object.fromEntries(campaigns.map((campaign) => [campaign.slug, campaign.comments || []])),
  );
  const [activity, setActivity] = useState(seededActivity);
  const [toast, setToast] = useState("");

  // Persist bookmarks and supported campaigns on every change. Guarded inside the
  // helper, so both still work in-session even if the store can't be written.
  useEffect(() => savePersistedSlugs(SAVED_KEY, saved), [saved]);
  useEffect(() => savePersistedSlugs(SUPPORTED_KEY, supported), [supported]);
  useEffect(() => persistSession(session), [session]);

  // Apply the resolved theme when the preference changes, and — only while
  // following the OS ("system") — re-apply live if the OS scheme flips.
  useEffect(() => {
    applyResolvedTheme(themePref);
    if (themePref !== "system" || typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyResolvedTheme("system");
    // Old Android WebView builds expose only the legacy addListener/removeListener.
    if (mq.addEventListener) {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, [themePref]);

  const setThemePref = (pref) => {
    setThemePrefState(pref);
    try {
      if (pref === "system") window.localStorage.removeItem(THEME_KEY);
      else window.localStorage.setItem(THEME_KEY, pref);
    } catch {
      /* storage unavailable — theme still applies this run via the effect */
    }
  };

  const toggleSaved = (slug) => {
    setSaved((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
  };

  // Exchange a Google credential for a wallet session. The server verifies the
  // token and derives the Stellar address; we only store what it returns. Throws
  // on failure so the caller can surface the reason.
  const signIn = async (credential) => {
    const response = await fetch("/api/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Login gagal. Coba lagi.");
    const next = {
      email: data.email ?? null,
      publicKey: data.publicKey,
      owner: Boolean(data.owner),
      funded: Boolean(data.funded),
      // The account's real on-chain USDC balance (decimal string). Shown to the
      // user as Rupiah — never as crypto.
      usdc: data.usdc ?? "0",
      // Session token authorizing later deposit/withdraw for this wallet.
      token: data.token ?? null,
      explorer: data.explorer ?? null,
    };
    setSession(next);
    return next;
  };

  const signOut = () => setSession(null);

  // Move real testnet USDC for the signed-in wallet: deposit = funder->you,
  // withdraw = you->funder, at the live rate. Returns the on-chain result and
  // updates the session's usdc so the wallet reflects the new balance.
  const settle = async (action, amount) => {
    if (!session?.token) throw new Error("Sesi habis. Masuk lagi dengan Google.");
    const response = await fetch("/api/settle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, token: session.token, amount }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Transaksi on-chain gagal.");
    setSession((current) => (current ? { ...current, usdc: data.balance ?? current.usdc } : current));
    return data;
  };

  const createDonation = ({
    slug,
    amount,
    recurring,
    anonymous,
    message,
    paymentMethod,
    // Set when the same donation was also settled on testnet. The receipt then
    // carries a hash anyone can check, instead of one this app invented.
    onchain,
    // The USDC/IDR rate (+ its source) at the moment of this donation. Recorded on
    // the receipt as a historical fact — a receipt must not be re-priced later at
    // today's rate, and it must match the USDC that actually settled on chain.
    rate,
    rateSource,
  }) => {
    const campaign = getCampaign(slug);
    if (!campaign) return null;

    const id = `ULR-${Date.now().toString().slice(-8)}`;
    const receipt = {
      id,
      slug,
      amount,
      recurring,
      anonymous,
      message,
      paymentMethod,
      createdAt: new Date().toISOString(),
      split: calculateSplit(amount, campaign.split),
      hash: onchain?.hash ?? createDemoHash(),
      onchain: onchain ?? null,
      status: onchain ? "confirmed-testnet" : "confirmed-demo",
      rate: rate ?? null,
      rateSource: rateSource ?? null,
    };

    setReceipts((current) => ({ ...current, [id]: receipt }));
    // Remember which campaigns this donor supported so "Kabar dari yang kamu
    // dukung" survives a reload. Newest first; a slug is only added once.
    setSupported((current) => (current.includes(slug) ? current : [slug, ...current]));
    setActivity((current) => [
      {
        id,
        anonymous,
        user: anonymous ? undefined : "Anda",
        amount,
        campaign: campaign.shortTitle,
        kind: "donation",
      },
      ...current,
    ]);
    if (message?.trim()) {
      setCampaignComments((current) => ({
        ...current,
        [slug]: [
          {
            id: `${id}-comment`,
            name: anonymous ? "Donatur anonim" : "Anda",
            amount,
            createdAt: "Baru saja",
            body: message.trim(),
            verified: true,
          },
          ...(current[slug] || []),
        ],
      }));
    }
    return receipt;
  };

  const addCampaignComment = ({ slug, body, anonymous = false }) => {
    const cleanBody = body.trim();
    if (!cleanBody) return;
    setCampaignComments((current) => ({
      ...current,
      [slug]: [
        {
          id: `comment-${Date.now()}`,
          name: anonymous ? "Donatur anonim" : "Anda",
          amount: null,
          createdAt: "Baru saja",
          body: cleanBody,
          verified: true,
        },
        ...(current[slug] || []),
      ],
    }));
    setToast("Komentar simulasi Anda ditambahkan ke campaign prototype ini.");
  };

  const submitRating = ({ slug, organizerSlug, stars, review, proofReviewId }) => {
    setRatings((current) => [
      ...current.filter((item) => item.slug !== slug),
      { slug, organizerSlug, stars, review, proofReviewId, createdAt: new Date().toISOString() },
    ]);
    setToast("Rating untuk Kreator Kebaikan tersimpan di prototype ini.");
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: copy[language],
      saved,
      toggleSaved,
      supported,
      session,
      signIn,
      signOut,
      settle,
      themePref,
      setThemePref,
      receipts,
      createDonation,
      ratings,
      submitRating,
      campaignComments,
      addCampaignComment,
      activity,
      toast,
      setToast,
    }),
    [activity, campaignComments, language, ratings, receipts, saved, session, supported, themePref, toast],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used inside AppProvider");
  return value;
}
