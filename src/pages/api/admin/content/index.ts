import type { APIRoute } from "astro";
import {
  listContentItems,
  readContentFile,
  writeContentFile,
  deleteContentFile,
  contentFileExists,
  parseRepoPath,
  toRepoPath,
  slugifyTitle,
  type ContentKind,
} from "@/lib/admin/content-paths";
import { parseMarkdown, serializeMarkdown, normalizeFrontmatter } from "@/lib/admin/frontmatter";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const path = url.searchParams.get("path");
  const kind = url.searchParams.get("kind") as ContentKind | null;

  if (path) {
    if (!parseRepoPath(path)) {
      return new Response(JSON.stringify({ error: "נתיב לא חוקי" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const raw = await readContentFile(path);
      const parsed = parseMarkdown(raw);
      const meta = parseRepoPath(path)!;
      return new Response(
        JSON.stringify({
          path,
          kind: meta.kind,
          locale: meta.locale,
          slug: meta.slug,
          data: parsed.data,
          body: parsed.body,
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "שגיאת קריאה";
      return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const items = await listContentItems(kind ?? undefined);
  return new Response(JSON.stringify({ items }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  let body: {
    kind?: ContentKind;
    locale?: string;
    slug?: string;
    title?: string;
    data?: Record<string, unknown>;
    body?: string;
  };

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "בקשה לא תקינה" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const kind = body.kind ?? "blog";
  const locale = body.locale?.trim();
  const slug = (body.slug?.trim() || slugifyTitle(body.title ?? "")).replace(/\.md$/, "");

  if (!locale || !["en", "he"].includes(locale)) {
    return new Response(JSON.stringify({ error: "שפה לא חוקית" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!slug) {
    return new Response(JSON.stringify({ error: "נדרש slug או כותרת" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const repoPath = toRepoPath(kind, locale, slug);

  if (await contentFileExists(repoPath)) {
    return new Response(JSON.stringify({ error: "פוסט עם slug זה כבר קיים" }), {
      status: 409,
      headers: { "Content-Type": "application/json" },
    });
  }

  const defaultData =
    kind === "blog"
      ? {
          title: body.title ?? "פוסט חדש",
          description: "",
          date: new Date().toISOString().slice(0, 10),
          category: "tech",
          tags: [],
          draft: true,
          ...body.data,
        }
      : {
          title: body.title ?? "פרויקט חדש",
          description: "",
          category: "ai",
          status: "in-progress",
          techStack: [],
          order: 0,
          ...body.data,
        };

  const data = normalizeFrontmatter(kind, defaultData);
  const markdown = serializeMarkdown(data, body.body ?? "תוכן הפוסט כאן.\n");

  try {
    await writeContentFile(repoPath, markdown);
    return new Response(JSON.stringify({ ok: true, path: repoPath }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "שגיאת יצירה";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  let body: { path?: string; data?: Record<string, unknown>; body?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "בקשה לא תקינה" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const repoPath = body.path;
  if (!repoPath || !parseRepoPath(repoPath)) {
    return new Response(JSON.stringify({ error: "נתיב לא חוקי" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const meta = parseRepoPath(repoPath)!;
  const data = normalizeFrontmatter(meta.kind, body.data ?? {});
  const markdown = serializeMarkdown(data, body.body ?? "");

  try {
    await writeContentFile(repoPath, markdown);
    return new Response(JSON.stringify({ ok: true, path: repoPath }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "שגיאת שמירה";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const DELETE: APIRoute = async ({ url }) => {
  const path = url.searchParams.get("path");
  if (!path || !parseRepoPath(path)) {
    return new Response(JSON.stringify({ error: "נתיב לא חוקי" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await deleteContentFile(path);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "שגיאת מחיקה";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
