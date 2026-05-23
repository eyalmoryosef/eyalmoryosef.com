import type { Locale } from "@/i18n/config";
import { translations, type TranslationKey } from "@/i18n/translations";
import { readRepoFile, writeRepoFile } from "@/lib/admin/file-storage";
import { ALL_SITE_COPY_KEYS } from "./fields";
import siteCopyJson from "@/data/site-copy.json";

export const SITE_COPY_REPO_PATH = "src/data/site-copy.json";

export type SiteCopyData = Record<Locale, Record<string, string>>;

function buildDefaults(): SiteCopyData {
  const en = translations.en as Record<string, string>;
  const he = translations.he as Record<string, string>;

  return {
    en: {
      ...pickKeys(en, ALL_SITE_COPY_KEYS),
      "home.hero.eyebrow": "Student · Trader · Builder",
      "home.hero.subdescription":
        "CS & Physics student, algorithmic trader, handcycle rider, and digital tool builder.",
      "home.hero.tagline": "Work hard. Build smart.",
      "home.hero.aboutCta": "About Me",
      "site.tagline": "Builder, Trader, Writer",
      "home.pageDescription":
        "Eyal MorYosef — Builder, Trader, Writer. Building AI systems, trading algorithms, and writing about what I learn.",
      "home.now.strip": "Algorithmic Trading, SmartPhysio, Handcycle Riding",
    },
    he: {
      ...pickKeys(he, ALL_SITE_COPY_KEYS),
      "home.hero.eyebrow": "סטודנט · סוחר · בונה",
      "home.hero.subdescription":
        'סטודנט למדמ"ח ופיזיקה, סוחר אלגוריתמי, רוכב אופני ידיים, ובונה כלים דיגיטליים.',
      "home.hero.tagline": "עובד קשה. בונה חכם.",
      "home.hero.aboutCta": "אודותיי",
      "site.tagline": "בונה, סוחר, כותב",
      "home.pageDescription":
        "אייל מוריוסף — בונה, סוחר, כותב. בונה מערכות AI, אלגוריתמי מסחר, וכותב על מה שאני לומד.",
      "home.now.strip": "מסחר אלגוריתמי, SmartPhysio, רכיבת אופני יד",
    },
  };
}

function pickKeys(source: Record<string, string>, keys: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of keys) {
    if (source[key] != null) out[key] = source[key];
  }
  return out;
}

function mergeWithDefaults(data: Partial<SiteCopyData>): SiteCopyData {
  const defaults = buildDefaults();
  return {
    en: { ...defaults.en, ...data.en },
    he: { ...defaults.he, ...data.he },
  };
}

let runtimeCache: SiteCopyData | null = null;

export function loadSiteCopySync(): SiteCopyData {
  if (runtimeCache) return runtimeCache;
  runtimeCache = mergeWithDefaults(siteCopyJson as SiteCopyData);
  return runtimeCache;
}

export async function loadSiteCopy(): Promise<SiteCopyData> {
  if (runtimeCache) return runtimeCache;

  try {
    const raw = await readRepoFile(SITE_COPY_REPO_PATH);
    runtimeCache = mergeWithDefaults(JSON.parse(raw) as SiteCopyData);
    return runtimeCache;
  } catch {
    runtimeCache = mergeWithDefaults(siteCopyJson as SiteCopyData);
    return runtimeCache;
  }
}

export async function saveSiteCopy(data: SiteCopyData): Promise<void> {
  const merged = mergeWithDefaults(data);
  await writeRepoFile(SITE_COPY_REPO_PATH, `${JSON.stringify(merged, null, 2)}\n`, "admin: update site copy");
  runtimeCache = merged;
}

export function getSiteString(locale: Locale, key: string): string {
  const copy = loadSiteCopySync();
  return (
    copy[locale]?.[key] ??
    copy.en[key] ??
    (translations[locale] as Record<string, string>)[key] ??
    key
  );
}

export function getSiteStringTyped(locale: Locale, key: TranslationKey): string {
  return getSiteString(locale, key);
}
