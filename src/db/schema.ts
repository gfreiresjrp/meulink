import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const clients = sqliteTable("clients", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  logoUrl: text("logo_url"),
  coverUrl: text("cover_url"),
  socials: text("socials"), // JSON: { instagram, whatsapp, facebook, x, linkedin, youtube, site, email }
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export const sections = sqliteTable("sections", {
  id: text("id").primaryKey(),
  clientId: text("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  position: integer("position").notNull().default(0),
});

export const links = sqliteTable("links", {
  id: text("id").primaryKey(),
  clientId: text("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  sectionId: text("section_id").references(() => sections.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  position: integer("position").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  clicks: integer("clicks").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export const assets = sqliteTable("assets", {
  id: text("id").primaryKey(),
  mime: text("mime").notNull(),
  size: integer("size").notNull(),
  data: blob("data", { mode: "buffer" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export const clientsRelations = relations(clients, ({ many }) => ({
  sections: many(sections),
  links: many(links),
}));

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  client: one(clients, { fields: [sections.clientId], references: [clients.id] }),
  links: many(links),
}));

export const linksRelations = relations(links, ({ one }) => ({
  client: one(clients, { fields: [links.clientId], references: [clients.id] }),
  section: one(sections, { fields: [links.sectionId], references: [sections.id] }),
}));

export type Client = typeof clients.$inferSelect;
export type Section = typeof sections.$inferSelect;
export type Link = typeof links.$inferSelect;
