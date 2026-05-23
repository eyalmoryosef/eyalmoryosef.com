import { locales, defaultLocale, type Locale } from "./config";
import type { TranslationKey } from "./translations";
import { getSiteStringTyped } from "@/lib/site-copy";

/** Extract locale from a URL pathname */
export function getLocaleFromPath(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  return locales.includes(segment as Locale) ? (segment as Locale) : defaultLocale;
}

/** Get a translated UI string */
export function t(locale: Locale, key: TranslationKey): string {
  return getSiteStringTyped(locale, key);
}

/** Convert a path from one locale to another */
export function getLocalizedPath(pathname: string, targetLocale: Locale): string {
  const currentLocale = getLocaleFromPath(pathname);
  if (currentLocale === targetLocale) return pathname;
  return pathname.replace(`/${currentLocale}/`, `/${targetLocale}/`).replace(`/${currentLocale}`, `/${targetLocale}`);
}

/** Get all nav items for a locale */
export function getNavItems(locale: Locale) {
  const base = `/${locale}`;
  return [
    { label: t(locale, "nav.home"), href: `${base}/` },
    { label: t(locale, "nav.projects"), href: `${base}/projects/` },
    { label: t(locale, "nav.blog"), href: `${base}/blog/` },
    { label: t(locale, "nav.now"), href: `${base}/now/` },
    { label: t(locale, "nav.about"), href: `${base}/about/` },
  ];
}
