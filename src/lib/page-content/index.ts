import type { Locale } from "@/i18n/config";
import { readRepoFile, writeRepoFile } from "@/lib/admin/file-storage";
import aboutJson from "@/data/about-content.json";
import nowJson from "@/data/now-content.json";

export interface AboutLocaleContent {
  metaDescription: string;
  paragraphs: string[];
}

export interface NowListItem {
  title: string;
  text: string;
}

export interface NowLocaleContent {
  metaDescription: string;
  lastUpdated: string;
  building: NowListItem[];
  studying: NowListItem[];
  thinking: string[];
}

export type AboutContent = Record<Locale, AboutLocaleContent>;
export type NowContent = Record<Locale, NowLocaleContent>;

export const ABOUT_REPO_PATH = "src/data/about-content.json";
export const NOW_REPO_PATH = "src/data/now-content.json";

let aboutCache: AboutContent | null = null;
let nowCache: NowContent | null = null;

export function getAboutContent(locale: Locale): AboutLocaleContent {
  const data = aboutCache ?? (aboutJson as AboutContent);
  return data[locale] ?? data.en;
}

export function getNowContent(locale: Locale): NowLocaleContent {
  const data = nowCache ?? (nowJson as NowContent);
  return data[locale] ?? data.en;
}

export async function loadAboutContent(): Promise<AboutContent> {
  try {
    const raw = await readRepoFile(ABOUT_REPO_PATH);
    aboutCache = JSON.parse(raw) as AboutContent;
    return aboutCache;
  } catch {
    aboutCache = aboutJson as AboutContent;
    return aboutCache;
  }
}

export async function loadNowContent(): Promise<NowContent> {
  try {
    const raw = await readRepoFile(NOW_REPO_PATH);
    nowCache = JSON.parse(raw) as NowContent;
    return nowCache;
  } catch {
    nowCache = nowJson as NowContent;
    return nowCache;
  }
}

export async function saveAboutContent(data: AboutContent): Promise<void> {
  await writeRepoFile(ABOUT_REPO_PATH, `${JSON.stringify(data, null, 2)}\n`, "admin: update about page");
  aboutCache = data;
}

export async function saveNowContent(data: NowContent): Promise<void> {
  await writeRepoFile(NOW_REPO_PATH, `${JSON.stringify(data, null, 2)}\n`, "admin: update now page");
  nowCache = data;
}
