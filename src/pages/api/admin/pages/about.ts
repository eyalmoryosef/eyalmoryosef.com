import type { APIRoute } from "astro";
import { loadAboutContent, saveAboutContent, type AboutContent } from "@/lib/page-content";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const content = await loadAboutContent();
    return new Response(JSON.stringify({ content }), {
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
  let body: { content?: AboutContent };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "בקשה לא תקינה" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.content?.en || !body.content?.he) {
    return new Response(JSON.stringify({ error: "חסרים נתוני שפה" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await saveAboutContent(body.content);
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
