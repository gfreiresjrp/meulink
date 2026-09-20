import { asc, eq } from "drizzle-orm";
import { db, clients, sections, links, type Link } from "@/db";

export type LinkGroup = { id: string | null; title: string | null; links: Link[] };

export async function getClientPage(slug: string) {
  const client = await db.query.clients.findFirst({ where: eq(clients.slug, slug) });
  if (!client) return null;
  const [secs, lks] = await Promise.all([
    db.select().from(sections).where(eq(sections.clientId, client.id)).orderBy(asc(sections.position)),
    db.select().from(links).where(eq(links.clientId, client.id)).orderBy(asc(links.position)),
  ]);
  const visible = lks.filter((l) => l.visible);
  const groups: LinkGroup[] = [];
  const loose = visible.filter((l) => !l.sectionId || !secs.some((s) => s.id === l.sectionId));
  if (loose.length) groups.push({ id: null, title: null, links: loose });
  for (const s of secs) {
    const inSec = visible.filter((l) => l.sectionId === s.id);
    if (inSec.length) groups.push({ id: s.id, title: s.title, links: inSec });
  }
  return { client, sections: secs, links: lks, groups };
}

export async function getClientById(id: string) {
  const client = await db.query.clients.findFirst({ where: eq(clients.id, id) });
  if (!client) return null;
  const [secs, lks] = await Promise.all([
    db.select().from(sections).where(eq(sections.clientId, id)).orderBy(asc(sections.position)),
    db.select().from(links).where(eq(links.clientId, id)).orderBy(asc(links.position)),
  ]);
  return { client, sections: secs, links: lks };
}
