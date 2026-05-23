import type { APIRoute } from "astro";
import { loadSiteCopy, saveSiteCopy, type SiteCopyData } from "@/lib/site-copy";
import { SITE_COPY_SECTIONS } from "@/lib/site-copy/fields";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const copy = await loadSiteCopy();
    return new Response(JSON.stringify({ copy, sections: SITE_COPY_SECTIONS }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "שגיאת קריאה";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  let body: { copy?: SiteCopyData };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "בקשה לא תקינה" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.copy?.en || !body.copy?.he) {
    return new Response(JSON.stringify({ error: "חסרים נתוני שפה" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await saveSiteCopy(body.copy);
    return new Response(JSON.stringify({ ok: true }), {
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
