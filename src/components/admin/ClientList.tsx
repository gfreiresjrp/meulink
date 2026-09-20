"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "./Icons";
import { Button, Input } from "@/components/ui";
import { CopyButton } from "@/components/CopyButton";
import { cn } from "@/lib/utils";

export type ClientRow = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  published: boolean;
  updatedAt: Date;
  linkCount: number;
  clicks: number;
};

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");
}

function relative(d: Date) {
  const diff = Date.now() - d.getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `há ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `há ${h} h`;
  const days = Math.round(h / 24);
  if (days < 30) return `há ${days} d`;
  return d.toLocaleDateString("pt-BR");
}

export function ClientList({ rows, baseUrl }: { rows: ClientRow[]; baseUrl: string }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? rows.filter((r) => r.name.toLowerCase().includes(t) || r.slug.includes(t)) : rows;
  }, [q, rows]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-sm">
        <Icon.Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar cliente…" className="pl-9" />
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-navy-deep px-5 py-10 text-center text-sm text-muted ring-1 ring-white/5">
          Nenhum cliente encontrado.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => {
            const url = `${baseUrl}/${c.slug}`;
            return (
              <div key={c.id} className="group flex flex-col gap-4 rounded-2xl bg-navy-deep p-5 ring-1 ring-white/5 transition hover:ring-white/15">
                <div className="flex items-start gap-3">
                  <Link href={`/admin/clientes/${c.id}`} className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-white font-display text-sm font-bold text-navy">
                    {c.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.logoUrl} alt="" className="size-full object-cover" />
                    ) : (
                      initials(c.name)
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/clientes/${c.id}`} className="block truncate font-display text-[15px] font-semibold text-white group-hover:text-lime">
                      {c.name}
                    </Link>
                    <a href={`/${c.slug}`} target="_blank" className="block truncate text-xs text-muted hover:text-white">
                      /{c.slug}
                    </a>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                      c.published ? "bg-lime/15 text-lime" : "bg-white/10 text-muted",
                    )}
                  >
                    {c.published ? "No ar" : "Rascunho"}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5"><Icon.Link className="size-3.5" />{c.linkCount} {c.linkCount === 1 ? "link" : "links"}</span>
                  <span className="flex items-center gap-1.5"><Icon.Click className="size-3.5" />{c.clicks} {c.clicks === 1 ? "clique" : "cliques"}</span>
                  <span className="ml-auto">{relative(c.updatedAt)}</span>
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/clientes/${c.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full" type="button"><Icon.Edit className="size-3.5" /> Editar</Button>
                  </Link>
                  <CopyButton value={url} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
