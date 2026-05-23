import { createHmac, timingSafeEqual } from "node:crypto";
import { getAdminConfig } from "./env";

const COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export { COOKIE_NAME, SESSION_TTL_MS };

export function verifyCredentials(username: string, password: string): boolean {
  const config = getAdminConfig();
  if (!config.isAuthConfigured || !config.username || !config.password) {
    return false;
  }

  const usernameOk = timingSafeEqualStr(username, config.username);
  const passwordOk = timingSafeEqualStr(password, config.password);
  return usernameOk && passwordOk;
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function createSessionToken(): string | null {
  const { sessionSecret } = getAdminConfig();
  if (!sessionSecret) return null;

  const exp = Date.now() + SESSION_TTL_MS;
  const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  const sig = createHmac("sha256", sessionSecret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;

  const { sessionSecret } = getAdminConfig();
  if (!sessionSecret) return false;

  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = createHmac("sha256", sessionSecret).update(payload).digest("base64url");
  if (!timingSafeEqualStr(sig, expected)) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp?: number;
    };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}
