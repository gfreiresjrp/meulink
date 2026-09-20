"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, asc, eq, ne, sql } from "drizzle-orm";
import { db, clients, sections, links } from "@/db";
import {
  SESSION_COOKIE,
  checkPassword,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth";
import { isValidUrl, newId, normalizeUrl, slugify } from "@/lib/utils";

function imageUrl(v: string) {
  if (!v) return null;
  return v.startsWith("/api/assets/") ? v : normalizeUrl(v);
}
import { SOCIAL_KEYS, socialsToJson } from "@/lib/socials";

export type ActionState = { error?: string; ok?: boolean } | undefined;

function str(fd: FormData, key: string) {
  return String(fd.get(key) ?? "").trim();
}

function revalidateClient(clientId: string, slug?: string) {
  revalidatePath("/admin");
  revalidatePath(`/admin/clientes/${clientId}`);
  if (slug) revalidatePath(`/${slug}`);
}

/* ---------------- Sessão ---------------- */

export async function login(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const password = String(fd.get("password") ?? "");
  const next = str(fd, "next") || "/admin";
  if (!process.env.ADMIN_PASSWORD) return { error: "ADMIN_PASSWORD não está configurada no servidor." };
  if (!process.env.AUTH_SECRET) return { error: "AUTH_SECRET não está configurada no servidor. Cadastre a variável e faça o redeploy." };
  if (!checkPassword(password)) return { error: "Senha incorreta." };
  const store = await cookies();
  store.set(SESSION_COOKIE, await createSessionToken(), sessionCookieOptions);
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* ---------------- Clientes ---------------- */

async function slugAvailable(slug: string, exceptId?: string) {
  const found = await db.query.clients.findFirst({
    where: exceptId ? and(eq(clients.slug, slug), ne(clients.id, exceptId)) : eq(clients.slug, slug),
  });
  return !found;
}

export async function createClient(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const name = str(fd, "name");
  const slug = slugify(str(fd, "slug") || name);
  if (!name) return { error: "Informe o nome do cliente." };
  if (!slug) return { error: "Slug inválido." };
  if (["admin", "go", "api", "_next"].includes(slug)) return { error: "Este slug é reservado." };
  if (!(await slugAvailable(slug))) return { error: "Já existe um cliente com este slug." };

  const id = newId();
  await db.insert(clients).values({
    id,
    name,
    slug,
    tagline: str(fd, "tagline") || null,
    logoUrl: imageUrl(str(fd, "logoUrl")),
    coverUrl: imageUrl(str(fd, "coverUrl")),
    socials: socialsToJson(Object.fromEntries(SOCIAL_KEYS.map((k) => [k, str(fd, `social_${k}`)]))),
    published: fd.get("published") === "on",
  });
  revalidatePath("/admin");
  redirect(`/admin/clientes/${id}`);
}

export async function updateClient(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const id = str(fd, "id");
  const current = await db.query.clients.findFirst({ where: eq(clients.id, id) });
  if (!current) return { error: "Cliente não encontrado." };

  const name = str(fd, "name");
  const slug = slugify(str(fd, "slug") || name);
  if (!name) return { error: "Informe o nome do cliente." };
  if (!slug) return { error: "Slug inválido." };
  if (["admin", "go", "api", "_next"].includes(slug)) return { error: "Este slug é reservado." };
  if (!(await slugAvailable(slug, id))) return { error: "Já existe um cliente com este slug." };

  await db
    .update(clients)
    .set({
      name,
      slug,
      tagline: str(fd, "tagline") || null,
      logoUrl: imageUrl(str(fd, "logoUrl")),
      coverUrl: imageUrl(str(fd, "coverUrl")),
      socials: socialsToJson(Object.fromEntries(SOCIAL_KEYS.map((k) => [k, str(fd, `social_${k}`)]))),
      published: fd.get("published") === "on",
      updatedAt: new Date(),
    })
    .where(eq(clients.id, id));
  revalidateClient(id, current.slug);
  revalidatePath(`/${slug}`);
  return { ok: true };
}

export async function deleteClient(fd: FormData) {
  const id = str(fd, "id");
  const current = await db.query.clients.findFirst({ where: eq(clients.id, id) });
  if (!current) return;
  await db.delete(links).where(eq(links.clientId, id));
  await db.delete(sections).where(eq(sections.clientId, id));
  await db.delete(clients).where(eq(clients.id, id));
  revalidatePath("/admin");
  revalidatePath(`/${current.slug}`);
  redirect("/admin");
}

/* ---------------- Seções ---------------- */

async function touch(clientId: string) {
  const c = await db.query.clients.findFirst({ where: eq(clients.id, clientId) });
  await db.update(clients).set({ updatedAt: new Date() }).where(eq(clients.id, clientId));
  revalidateClient(clientId, c?.slug);
}

export async function createSection(fd: FormData) {
  const clientId = str(fd, "clientId");
  const title = str(fd, "title");
  if (!clientId || !title) return;
  const [{ max }] = await db
    .select({ max: sql<number>`coalesce(max(${sections.position}), -1)` })
    .from(sections)
    .where(eq(sections.clientId, clientId));
  await db.insert(sections).values({ id: newId(), clientId, title, position: Number(max) + 1 });
  await touch(clientId);
}

export async function renameSection(fd: FormData) {
  const id = str(fd, "id");
  const title = str(fd, "title");
  const clientId = str(fd, "clientId");
  if (!id || !title) return;
  await db.update(sections).set({ title }).where(eq(sections.id, id));
  await touch(clientId);
}

export async function deleteSection(fd: FormData) {
  const id = str(fd, "id");
  const clientId = str(fd, "clientId");
  if (!id) return;
  // Links da seção voltam para "sem seção" em vez de sumirem.
  await db.update(links).set({ sectionId: null }).where(eq(links.sectionId, id));
  await db.delete(sections).where(eq(sections.id, id));
  await touch(clientId);
}

export async function moveSection(fd: FormData) {
  const id = str(fd, "id");
  const clientId = str(fd, "clientId");
  const dir = str(fd, "dir") === "up" ? -1 : 1;
  const list = await db.select().from(sections).where(eq(sections.clientId, clientId)).orderBy(asc(sections.position));
  const i = list.findIndex((s) => s.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  await Promise.all(list.map((s, idx) => db.update(sections).set({ position: idx }).where(eq(sections.id, s.id))));
  await touch(clientId);
}

/* ---------------- Links ---------------- */

export async function createLink(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const clientId = str(fd, "clientId");
  const title = str(fd, "title");
  const url = normalizeUrl(str(fd, "url"));
  const sectionId = str(fd, "sectionId") || null;
  if (!clientId) return { error: "Cliente inválido." };
  if (!title) return { error: "Informe o título do link." };
  if (!isValidUrl(url)) return { error: "URL inválida. Use um endereço completo, ex.: https://drive.google.com/..." };

  const [{ max }] = await db
    .select({ max: sql<number>`coalesce(max(${links.position}), -1)` })
    .from(links)
    .where(eq(links.clientId, clientId));
  await db.insert(links).values({
    id: newId(),
    clientId,
    sectionId,
    title,
    url,
    description: str(fd, "description") || null,
    position: Number(max) + 1,
    visible: true,
  });
  await touch(clientId);
  return { ok: true };
}

export async function updateLink(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const id = str(fd, "id");
  const clientId = str(fd, "clientId");
  const title = str(fd, "title");
  const url = normalizeUrl(str(fd, "url"));
  if (!title) return { error: "Informe o título do link." };
  if (!isValidUrl(url)) return { error: "URL inválida." };
  await db
    .update(links)
    .set({
      title,
      url,
      description: str(fd, "description") || null,
      sectionId: str(fd, "sectionId") || null,
      visible: fd.get("visible") === "on",
    })
    .where(eq(links.id, id));
  await touch(clientId);
  return { ok: true };
}

export async function toggleLink(fd: FormData) {
  const id = str(fd, "id");
  const clientId = str(fd, "clientId");
  await db.update(links).set({ visible: sql`NOT ${links.visible}` }).where(eq(links.id, id));
  await touch(clientId);
}

export async function deleteLink(fd: FormData) {
  const id = str(fd, "id");
  const clientId = str(fd, "clientId");
  await db.delete(links).where(eq(links.id, id));
  await touch(clientId);
}

export async function moveLink(fd: FormData) {
  const id = str(fd, "id");
  const clientId = str(fd, "clientId");
  const dir = str(fd, "dir") === "up" ? -1 : 1;
  const all = await db.select().from(links).where(eq(links.clientId, clientId)).orderBy(asc(links.position));
  const me = all.find((l) => l.id === id);
  if (!me) return;
  // Move dentro do mesmo grupo (mesma seção), preservando a ordem global.
  const group = all.filter((l) => (l.sectionId ?? null) === (me.sectionId ?? null));
  const i = group.findIndex((l) => l.id === id);
  const j = i + dir;
  if (j < 0 || j >= group.length) return;
  const a = group[i], b = group[j];
  await Promise.all([
    db.update(links).set({ position: b.position }).where(eq(links.id, a.id)),
    db.update(links).set({ position: a.position }).where(eq(links.id, b.id)),
  ]);
  await touch(clientId);
}
