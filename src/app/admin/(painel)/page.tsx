import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db, clients, links } from "@/db";
import { Button } from "@/components/ui";
import { Icon } from "@/components/admin/Icons";
import { ClientList } from "@/components/admin/ClientList";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clientes" };

export default async function AdminHome() {
  const rows = await db
    .select({
      id: clients.id,
      name: clients.name,
      slug: clients.slug,
      logoUrl: clients.logoUrl,
      published: clients.published,
      updatedAt: clients.updatedAt,
      linkCount: sql<number>`count(${links.id})`,
      clicks: sql<number>`coalesce(sum(${links.clicks}), 0)`,
    })
    .from(clients)
    .leftJoin(links, eq(links.clientId, clients.id))
    .groupBy(clients.id)
    .orderBy(desc(clients.updatedAt));

  const totals = rows.reduce(
    (a, r) => ({ clients: a.clients + 1, published: a.published + (r.published ? 1 : 0), links: a.links + Number(r.linkCount), clicks: a.clicks + Number(r.clicks) }),
    { clients: 0, published: 0, links: 0, clicks: 0 },
  );

  const stats = [
    { label: "Clientes", value: totals.clients, hint: `${totals.published} no ar`, icon: Icon.Users },
    { label: "Links", value: totals.links, hint: "publicados no total", icon: Icon.Link },
    { label: "Cliques", value: totals.clicks, hint: "em todas as páginas", icon: Icon.Click },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Painel</p>
          <h1 className="mt-1 font-display text-2xl font-semibold">Clientes</h1>
          <p className="mt-1 text-sm text-muted">Uma página por cliente. Cole o link na descrição do grupo do WhatsApp.</p>
        </div>
        <Link href="/admin/clientes/novo">
          <Button type="button"><Icon.Plus className="size-4" /> Novo cliente</Button>
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-2xl bg-navy-deep p-5 ring-1 ring-white/5">
            <span className="grid size-11 place-items-center rounded-xl bg-lime/10 text-lime"><s.icon className="size-5" /></span>
            <div>
              <p className="font-display text-2xl font-semibold leading-none">{s.value}</p>
              <p className="mt-1 text-xs text-muted">{s.label} · {s.hint}</p>
            </div>
          </div>
        ))}
      </div>

      <ClientList rows={rows.map((r) => ({ ...r, linkCount: Number(r.linkCount), clicks: Number(r.clicks) }))} baseUrl={siteUrl()} />
    </div>
  );
}
