import type { Locale } from "./types";

/** Parse content collection ID into locale and slug */
export function parseContentId(id: string): { locale: string; slug: string } {
  const [locale, ...rest] = id.split("/");
  return { locale, slug: rest.join("/").replace(/\.md$/, "") };
}

/** Format a date for display */
export function formatDate(date: Date, locale: Locale): string {
  return date.toLocaleDateString(locale === "he" ? "he-IL" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Calculate reading time in minutes */
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/** Create a URL-safe slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}
