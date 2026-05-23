import { defineMiddleware } from "astro:middleware";
import { verifySessionToken, COOKIE_NAME } from "@/lib/admin/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (pathname.startsWith("/api/admin") && pathname !== "/api/admin/login") {
    const token = context.cookies.get(COOKIE_NAME)?.value;
    if (!verifySessionToken(token)) {
      return new Response(JSON.stringify({ error: "לא מורשה" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return next();
});
