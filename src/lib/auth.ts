/**
 * Sessão do painel: cookie assinado com HMAC-SHA256 (Web Crypto, roda no
 * proxy/edge e no servidor). Senha única definida em ADMIN_PASSWORD.
 */
export const SESSION_COOKIE = "meulink_admin";
const SESSION_DAYS = 30;

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET não definido no .env.local");
  return s;
}

function toHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)));
}

export async function createSessionToken() {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `admin.${exp}`;
  return `${payload}.${await hmac(payload)}`;
}

export async function verifySessionToken(token: string | undefined | null) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [who, exp, sig] = parts;
  if (who !== "admin" || Number(exp) < Date.now()) return false;
  const expected = await hmac(`${who}.${exp}`);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected || input.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ input.charCodeAt(i);
  return diff === 0;
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_DAYS * 24 * 60 * 60,
};
