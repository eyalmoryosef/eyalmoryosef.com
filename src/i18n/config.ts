export const locales = ["en", "he"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeConfig: Record<Locale, { label: string; dir: "ltr" | "rtl"; hreflang: string }> = {
  en: { label: "EN", dir: "ltr", hreflang: "en" },
  he: { label: "HE", dir: "rtl", hreflang: "he" },
};
