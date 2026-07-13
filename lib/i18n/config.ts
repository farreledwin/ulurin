export const LOCALES = ["id", "en", "vi"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "id";
export const LOCALE_COOKIE = "bagibagi_locale";

export const LOCALE_META: Record<
  Locale,
  { native: string; english: string; flag: string }
> = {
  id: { native: "Bahasa Indonesia", english: "Indonesian", flag: "🇮🇩" },
  en: { native: "English", english: "English", flag: "🇬🇧" },
  vi: { native: "Tiếng Việt", english: "Vietnamese", flag: "🇻🇳" },
};

export function isLocale(v: string | undefined | null): v is Locale {
  return !!v && (LOCALES as readonly string[]).includes(v);
}
