import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { readRepoFile, writeRepoFile, deleteRepoFile, repoFileExists } from "./file-storage";

export type ContentKind = "blog" | "projects";

export interface ContentItem {
  kind: ContentKind;
  locale: string;
  slug: string;
  path: string;
  title: string;
}

const CONTENT_ROOT = path.join(process.cwd(), "src/content");

export function toRepoPath(kind: ContentKind, locale: string, slug: string): string {
  return `src/content/${kind}/${locale}/${slug}.md`;
}

export function parseRepoPath(repoPath: string): { kind: ContentKind; locale: string; slug: string } | null {
  const match = /^src\/content\/(blog|projects)\/([^/]+)\/([^/]+)\.md$/.exec(repoPath);
  if (!match) return null;
  return { kind: match[1] as ContentKind, locale: match[2], slug: match[3] };
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function localPath(repoPath: string): string {
  return path.join(process.cwd(), repoPath);
}

async function readTitleFromPath(repoPath: string): Promise<string> {
  try {
    const raw = await readRepoFile(repoPath);
    const match = /^---[\s\S]*?title:\s*["']?([^"'\n]+)["']?/m.exec(raw);
    return match?.[1]?.trim() ?? path.basename(repoPath, ".md");
  } catch {
    return path.basename(repoPath, ".md");
  }
}

export async function listContentItems(kind?: ContentKind): Promise<ContentItem[]> {
  const items: ContentItem[] = [];
  const kinds: ContentKind[] = kind ? [kind] : ["blog", "projects"];

  for (const k of kinds) {
    for (const locale of ["en", "he"] as const) {
      const dir = path.join(CONTENT_ROOT, k, locale);
      let files: string[];
      try {
        files = (await readdir(dir)).filter((f) => f.endsWith(".md"));
      } catch {
        continue;
      }

      for (const file of files) {
        const slug = file.replace(/\.md$/, "");
        const repoPath = toRepoPath(k, locale, slug);
        const title = await readTitleFromPath(repoPath);
        items.push({ kind: k, locale, slug, path: repoPath, title });
      }
    }
  }

  return items.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind.localeCompare(b.kind);
    if (a.locale !== b.locale) return a.locale.localeCompare(b.locale);
    return a.slug.localeCompare(b.slug);
  });
}

export async function readContentFile(repoPath: string): Promise<string> {
  if (!parseRepoPath(repoPath)) throw new Error("Invalid content path");
  return readRepoFile(repoPath);
}

export async function writeContentFile(repoPath: string, content: string): Promise<void> {
  if (!parseRepoPath(repoPath)) throw new Error("Invalid content path");
  await writeRepoFile(repoPath, content, `admin: update ${repoPath}`);
}

export async function deleteContentFile(repoPath: string): Promise<void> {
  if (!parseRepoPath(repoPath)) throw new Error("Invalid content path");
  await deleteRepoFile(repoPath);
}

export async function contentFileExists(repoPath: string): Promise<boolean> {
  if (!parseRepoPath(repoPath)) return false;
  return repoFileExists(repoPath);
}

/** Local-only fast title read during dev listing */
export async function listBlogItemsLocal(): Promise<ContentItem[]> {
  return listContentItems("blog");
}
