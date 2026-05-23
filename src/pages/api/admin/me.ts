import type { APIRoute } from "astro";
import { verifySessionToken, COOKIE_NAME } from "@/lib/admin/auth";
import { getAdminConfig } from "@/lib/admin/env";

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const config = getAdminConfig();
  const token = cookies.get(COOKIE_NAME)?.value;
  const authenticated = verifySessionToken(token);

  return new Response(
    JSON.stringify({
      authenticated,
      authConfigured: config.isAuthConfigured,
      storageMode: config.isGitHubConfigured && import.meta.env.PROD ? "github" : "local",
    }),
    { headers: { "Content-Type": "application/json" } },
  );
};
