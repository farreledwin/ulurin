import { useState } from "react";

// Payment-method brand marks. With a logo.dev publishable token
// (VITE_LOGODEV_TOKEN) we render the REAL official logo by domain — logo.dev is
// a licensed logo service (referrer-safe public token), so this is nominative
// use of each mark as a payment indicator, not us reproducing the art. Without
// a token (or if a logo 404s / the service is down), we fall back to a
// brand-coloured wordmark chip, so the picker never breaks.
const BRAND = {
  BCA: { label: "BCA", color: "#0060af", domain: "bca.co.id" },
  BNI: { label: "BNI", color: "#ec6726", domain: "bni.co.id" },
  BRI: { label: "BRI", color: "#00529c", domain: "bri.co.id" },
  MANDIRI: { label: "mandiri", color: "#003d79", domain: "bankmandiri.co.id" },
  PERMATA: { label: "Permata", color: "#00857c", domain: "permatabank.com" },
  GOPAY: { label: "gopay", color: "#00aa13", domain: "gopay.co.id" },
  OVO: { label: "OVO", color: "#4c2a86", domain: "ovo.id" },
  DANA: { label: "DANA", color: "#118eea", domain: "dana.id" },
  SHOPEEPAY: { label: "SPay", color: "#ee4d2d", domain: "shopee.co.id" },
  LINKAJA: { label: "LinkAja", color: "#e82127", domain: "linkaja.id" },
  QRIS: { label: "QRIS", color: "#e2231a", domain: "qris.id" },
  CARD: { label: "Kartu", color: "#1a1f71" },
};

const TOKEN = import.meta.env.VITE_LOGODEV_TOKEN;

// Card-network marks are drawn inline (no external dependency): the Visa wordmark
// and the Mastercard interlocking circles are the recognisable indicators, used
// nominatively to show which cards the form accepts.
const CARD_MARKS = {
  VISA: (
    <svg viewBox="0 0 40 14" className="pay-logo__vec">
      <text x="20" y="12" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontStyle="italic" fontSize="13" fill="#1a1f71" letterSpacing="0.3">VISA</text>
    </svg>
  ),
  MASTERCARD: (
    <svg viewBox="0 0 40 24" className="pay-logo__vec">
      <circle cx="16" cy="12" r="9" fill="#eb001b" />
      <circle cx="24" cy="12" r="9" fill="#f79e1b" />
      <path d="M20 4.8a9 9 0 000 14.4 9 9 0 000-14.4z" fill="#ff5f00" />
    </svg>
  ),
};

export function PayLogo({ brand, size = "md" }) {
  const [failed, setFailed] = useState(false);

  const mark = CARD_MARKS[brand];
  if (mark) {
    return (
      <span className={`pay-logo pay-logo--${size} pay-logo--vec`} aria-hidden="true">
        {mark}
      </span>
    );
  }

  const meta = BRAND[brand] ?? { label: brand, color: "#334" };
  const useImage = Boolean(TOKEN) && Boolean(meta.domain) && !failed;

  return (
    <span className={`pay-logo pay-logo--${size}${useImage ? " pay-logo--img" : ""}`} style={useImage ? undefined : { color: meta.color }} aria-hidden="true">
      {useImage ? (
        <img
          src={`https://img.logo.dev/${meta.domain}?token=${TOKEN}&size=72&format=png&retina=true`}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        meta.label
      )}
    </span>
  );
}

// Both accepted networks side by side — used on the card method row and the card
// form header so the user sees Visa/Mastercard, not a generic "Kartu" chip.
export function CardBrands() {
  return (
    <span className="pay-cardpair">
      <PayLogo brand="VISA" />
      <PayLogo brand="MASTERCARD" />
    </span>
  );
}

// Which network a typed PAN belongs to (Visa 4…, Mastercard 51-55 / 2221-2720).
export function detectCardBrand(digits) {
  if (/^4/.test(digits)) return "VISA";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "MASTERCARD";
  return null;
}
