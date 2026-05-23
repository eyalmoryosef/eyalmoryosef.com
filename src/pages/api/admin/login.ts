import type { APIRoute } from "astro";
import { verifyCredentials, createSessionToken, COOKIE_NAME, SESSION_TTL_MS } from "@/lib/admin/auth";
import { getAdminConfig } from "@/lib/admin/env";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const config = getAdminConfig();

  if (!config.isAuthConfigured) {
    return new Response(
      JSON.stringify({ error: "ממשק הניהול לא הוגדר. הוסף משתנים ב-.env" }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "בקשה לא תקינה" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  if (!verifyCredentials(username, password)) {
    return new Response(JSON.stringify({ error: "שם משתמש או סיסמה שגויים" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = createSessionToken();
  if (!token) {
    return new Response(JSON.stringify({ error: "שגיאת שרת" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
