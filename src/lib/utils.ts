export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function newId() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
}

export function normalizeUrl(raw: string) {
  const v = raw.trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  if (/^(mailto:|tel:|whatsapp:)/i.test(v)) return v;
  return `https://${v}`;
}

export function isValidUrl(v: string) {
  try {
    const u = new URL(v);
    return ["http:", "https:", "mailto:", "tel:"].includes(u.protocol);
  } catch {
    return false;
  }
}

export function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
