// Bagibagi, display currency. The transaction rail is USDC, but the app is
// crypto-invisible: the user only ever sees their local currency plus a small
// PLAIN-DOLLAR anchor ("≈ $10.60"), never the token name "USDC". The literal
// "USDC" + tx hash live only in the on-chain receipt / "View on Stellar" layer.
// Rates are ILLUSTRATIVE (testnet), one dollar anchor, matching the V4 brief
// example (≈ $200 · Rp 3,200,000 · ₫5,100,000).
//
// App numeric values are IDR-first preview units:
// usd = appAmount / IDR_PER_USD, then local = usd * perUsd.

import type { Locale } from "@/lib/i18n/config";

export const IDR_PER_USD = 16000;

export type CurrencyMeta = {
  code: string;
  symbol: string; // includes trailing space where the symbol needs one
  perUsdc: number; // units of this currency per 1 USD/USDC (illustrative)
  dp: number; // decimal places shown
  intl: string; // Intl.NumberFormat locale for grouping
};

export const CURRENCY: Record<Locale, CurrencyMeta> = {
  id: { code: "IDR", symbol: "Rp ", perUsdc: 16000, dp: 0, intl: "id-ID" },
  en: { code: "USD", symbol: "$", perUsdc: 1, dp: 2, intl: "en-US" },
  vi: { code: "VND", symbol: "₫", perUsdc: 25500, dp: 0, intl: "vi-VN" },
};

// "CODE · Name" label per display currency, for the settings UI.
export const CURRENCY_LABEL: Record<Locale, string> = {
  id: "IDR · Rupiah",
  en: "USD · US Dollar",
  vi: "VND · Đồng",
};

export function appAmountToUsd(appAmount: number): number {
  return (appAmount || 0) / IDR_PER_USD;
}

// Convert an IDR-first app value into the active locale's display currency.
export function localAmount(appAmount: number, locale: Locale): number {
  return appAmountToUsd(appAmount) * CURRENCY[locale].perUsdc;
}

// Split the localized amount into the parts the Money/Rupiah UI renders.
export function formatParts(
  appAmount: number,
  locale: Locale
): { symbol: string; int: string; dec: string; dp: number } {
  const m = CURRENCY[locale];
  const v = Math.abs(localAmount(appAmount, locale));
  const s = v.toLocaleString(m.intl, {
    minimumFractionDigits: m.dp,
    maximumFractionDigits: m.dp,
  });
  if (m.dp === 0) return { symbol: m.symbol, int: s, dec: "", dp: 0 };
  // Split on the locale's decimal separator (last non-digit group).
  const match = s.match(/^(.*)[.,](\d+)$/);
  if (!match) return { symbol: m.symbol, int: s, dec: "", dp: m.dp };
  return { symbol: m.symbol, int: match[1], dec: match[2], dp: m.dp };
}

// The stable dollar-value anchor shown beside the local amount. Crypto-
// invisible: the rail is USDC (≈ US$1) but the user sees a plain "$" figure,
// never the token name. (Name kept as formatUsdc to avoid churn across call
// sites; output is the USD anchor.)
export function formatUsdc(appAmount: number): string {
  const u = appAmountToUsd(appAmount);
  return (
    "$" +
    u.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

// Reverse of localAmount: a value in the display currency back into IDR-first
// app units.
export function appAmountFromLocal(localValue: number, currency: Locale): number {
  const usdc = (localValue || 0) / CURRENCY[currency].perUsdc;
  return usdc * IDR_PER_USD;
}

// Format a value already expressed in the display currency (symbol + grouping,
// no forced decimals) — for quick-chip presets and the amount the user typed.
export function formatLocalAmount(
  localValue: number,
  currency: Locale
): string {
  const m = CURRENCY[currency];
  return (
    m.symbol +
    Math.abs(localValue || 0).toLocaleString(m.intl, {
      minimumFractionDigits: 0,
      maximumFractionDigits: m.dp,
    })
  );
}

// Format an IDR-first app value as a display-currency string (with the currency's
// decimal places) — for balances and result figures shown inline in text.
export function formatLocal(php: number, currency: Locale): string {
  const { symbol, int, dec, dp } = formatParts(php, currency);
  return symbol + int + (dp > 0 ? "." + (dec || "".padEnd(dp, "0")) : "");
}
