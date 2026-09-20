export const SOCIAL_KEYS = ["instagram", "whatsapp", "facebook", "x", "linkedin", "youtube", "tiktok", "site", "email"] as const;
export type SocialKey = (typeof SOCIAL_KEYS)[number];
export type Socials = Partial<Record<SocialKey, string>>;

export const SOCIAL_LABELS: Record<SocialKey, string> = {
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  facebook: "Facebook",
  x: "X (Twitter)",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  tiktok: "TikTok",
  site: "Site",
  email: "E-mail",
};

export const SOCIAL_PLACEHOLDERS: Record<SocialKey, string> = {
  instagram: "@usuario ou URL",
  whatsapp: "5511999999999 ou link wa.me",
  facebook: "URL da página",
  x: "@usuario ou URL",
  linkedin: "URL do perfil ou empresa",
  youtube: "URL do canal",
  tiktok: "@usuario ou URL",
  site: "https://…",
  email: "contato@empresa.com",
};

/** Normaliza o que a pessoa digitou para uma URL clicável. */
export function socialHref(key: SocialKey, raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  const handle = v.replace(/^@/, "");
  switch (key) {
    case "instagram": return `https://instagram.com/${handle}`;
    case "x": return `https://x.com/${handle}`;
    case "tiktok": return `https://tiktok.com/@${handle}`;
    case "whatsapp": {
      const digits = v.replace(/\D/g, "");
      return digits ? `https://wa.me/${digits}` : `https://${v}`;
    }
    case "email": return v.startsWith("mailto:") ? v : `mailto:${v}`;
    default: return `https://${v}`;
  }
}

export function parseSocials(json: string | null | undefined): Socials {
  if (!json) return {};
  try {
    const o = JSON.parse(json) as Record<string, unknown>;
    const out: Socials = {};
    for (const k of SOCIAL_KEYS) if (typeof o[k] === "string" && o[k]) out[k] = o[k] as string;
    return out;
  } catch {
    return {};
  }
}

export function socialsToJson(values: Record<string, string>): string | null {
  const out: Socials = {};
  for (const k of SOCIAL_KEYS) {
    const v = (values[k] ?? "").trim();
    if (v) out[k] = v;
  }
  return Object.keys(out).length ? JSON.stringify(out) : null;
}
