import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientForm } from "@/components/admin/ClientForm";
import { SectionsPanel } from "@/components/admin/SectionsPanel";
import { LinksPanel } from "@/components/admin/LinksPanel";
import { DeleteClientButton } from "@/components/admin/DeleteClientButton";
import { PhonePreview } from "@/components/admin/PhonePreview";
import { Tabs } from "@/components/admin/Tabs";
import { Icon } from "@/components/admin/Icons";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/ui";
import { updateClient } from "@/app/admin/actions";
import { getClientById } from "@/lib/queries";
import { cn, siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EditClientPage({ params }: PageProps<"/admin/clientes/[id]">) {
  const { id } = await params;
  const data = await getClientById(id);
  if (!data) notFound();
  const { client, sections, links } = data;
  const url = `${siteUrl()}/${client.slug}`;
  const totalClicks = links.reduce((a, l) => a + l.clicks, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-muted hover:text-white">
            <Icon.Up className="size-3 -rotate-90" /> Clientes
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="truncate font-display text-2xl font-semibold">{client.name}</h1>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                client.published ? "bg-lime/15 text-lime" : "bg-white/10 text-muted",
              )}
            >
              {client.published ? "No ar" : "Rascunho"}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            <a href={`/${client.slug}`} target="_blank" className="hover:text-lime">{url.replace(/^https?:\/\//, "")}</a>
            <span className="flex items-center gap-1"><Icon.Link className="size-3" /> {links.length} {links.length === 1 ? "link" : "links"}</span>
            <span className="flex items-center gap-1"><Icon.Click className="size-3" /> {totalClicks} {totalClicks === 1 ? "clique" : "cliques"}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href={`/${client.slug}`} target="_blank">
            <Button variant="outline" size="sm" type="button">Abrir página</Button>
          </a>
          <CopyButton value={url} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Tabs
          tabs={[
            { id: "links", label: "Links", badge: links.length, content: <LinksPanel clientId={client.id} sections={sections} links={links} /> },
            { id: "secoes", label: "Seções", badge: sections.length, content: <SectionsPanel clientId={client.id} sections={sections} /> },
            {
              id: "cliente",
              label: "Cliente",
              content: (
                <div className="flex flex-col gap-6">
                  <ClientForm client={client} action={updateClient} submitLabel="Salvar" baseUrl={siteUrl()} />
                  <DeleteClientButton id={client.id} name={client.name} />
                </div>
              ),
            },
          ]}
        />
        <div className="hidden lg:block">
          <PhonePreview slug={client.slug} version={client.updatedAt.getTime()} published={client.published} />
        </div>
      </div>
    </div>
  );
}
