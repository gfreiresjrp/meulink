"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { Link, Section } from "@/db";
import { createLink, deleteLink, moveLink, toggleLink, updateLink, type ActionState } from "@/app/admin/actions";
import { Button, Card, Field, Input, Notice, Select, Toggle } from "@/components/ui";
import { Icon } from "./Icons";
import { cn, hostOf } from "@/lib/utils";

export function LinksPanel({ clientId, sections, links }: { clientId: string; sections: Section[]; links: Link[] }) {
  const groups: { id: string | null; title: string; links: Link[] }[] = [
    { id: null, title: "Links", links: links.filter((l) => !l.sectionId || !sections.some((s) => s.id === l.sectionId)) },
    ...sections.map((s) => ({ id: s.id, title: s.title, links: links.filter((l) => l.sectionId === s.id) })),
  ].filter((g) => g.links.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <Card title="Novo link">
        <NewLinkForm clientId={clientId} sections={sections} />
      </Card>

      {links.length === 0 ? (
        <Card><p className="text-sm text-muted">Nenhum link ainda. Adicione o primeiro acima.</p></Card>
      ) : (
        groups.map((g) => (
          <Card key={g.id ?? "__none"} title={g.title} action={<span className="text-xs text-muted">{g.links.length} {g.links.length === 1 ? "link" : "links"}</span>}>
            <div className="flex flex-col gap-2">
              {g.links.map((l, i) => (
                <LinkRow key={l.id} link={l} clientId={clientId} sections={sections} first={i === 0} last={i === g.links.length - 1} />
              ))}
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

function NewLinkForm({ clientId, sections }: { clientId: string; sections: Section[] }) {
  const [state, action, pending] = useActionState(createLink, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);
  return (
    <form ref={ref} action={action} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="clientId" value={clientId} />
      <Field label="Título">
        <Input name="title" required placeholder="Ex.: Identidade visual (Drive)" />
      </Field>
      <Field label="URL">
        <Input name="url" required placeholder="https://drive.google.com/…" inputMode="url" />
      </Field>
      <Field label="Descrição" hint="Opcional. Aparece em cinza abaixo do título.">
        <Input name="description" placeholder="Logos, paleta e manual em PDF" />
      </Field>
      <Field label="Seção">
        <Select name="sectionId" defaultValue="">
          <option value="">Sem seção (topo)</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </Select>
      </Field>
      <div className="flex items-center gap-3 sm:col-span-2">
        <Button type="submit" disabled={pending}><Icon.Plus className="size-4" /> {pending ? "Adicionando…" : "Adicionar link"}</Button>
        {state?.error && <Notice kind="error">{state.error}</Notice>}
      </div>
    </form>
  );
}

function LinkRow({ link, clientId, sections, first, last }: { link: Link; clientId: string; sections: Section[]; first: boolean; last: boolean }) {
  const [editing, setEditing] = useState(false);
  const [state, action, pending] = useActionState(
    async (prev: ActionState, fd: FormData) => {
      const r = await updateLink(prev, fd);
      if (r?.ok) setEditing(false);
      return r;
    },
    undefined,
  );
  const host = hostOf(link.url);

  return (
    <div className={cn("rounded-xl bg-navy ring-1 ring-white/5 transition", editing && "ring-lime/40", !link.visible && "opacity-60")}>
      <div className="flex items-center gap-3 p-2 pl-3">
        <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`} alt="" className="size-5" loading="lazy" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{link.title}</p>
          <p className="truncate text-xs text-muted">{link.description ? `${link.description} · ` : ""}{host}</p>
        </div>
        <span className="hidden shrink-0 items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-muted sm:flex" title="Cliques">
          <Icon.Click className="size-3" /> {link.clicks}
        </span>

        <div className="flex items-center">
          <form action={moveLink} className="flex">
            <input type="hidden" name="id" value={link.id} />
            <input type="hidden" name="clientId" value={clientId} />
            <Button variant="ghost" size="sm" type="submit" name="dir" value="up" disabled={first} title="Subir" className="px-2"><Icon.Up className="size-4" /></Button>
            <Button variant="ghost" size="sm" type="submit" name="dir" value="down" disabled={last} title="Descer" className="px-2"><Icon.Down className="size-4" /></Button>
          </form>
          <form action={toggleLink}>
            <input type="hidden" name="id" value={link.id} />
            <input type="hidden" name="clientId" value={clientId} />
            <Button variant="ghost" size="sm" type="submit" title={link.visible ? "Ocultar da página" : "Mostrar na página"} className="px-2">
              {link.visible ? <Icon.Eye className="size-4" /> : <Icon.EyeOff className="size-4" />}
            </Button>
          </form>
          <Button variant={editing ? "primary" : "ghost"} size="sm" type="button" onClick={() => setEditing((v) => !v)} title="Editar" className="px-2">
            {editing ? <Icon.Close className="size-4" /> : <Icon.Edit className="size-4" />}
          </Button>
        </div>
      </div>

      {editing && (
        <form action={action} className="grid gap-3 border-t border-white/5 p-3 sm:grid-cols-2">
          <input type="hidden" name="id" value={link.id} />
          <input type="hidden" name="clientId" value={clientId} />
          <Field label="Título"><Input name="title" defaultValue={link.title} required /></Field>
          <Field label="URL"><Input name="url" defaultValue={link.url} required /></Field>
          <Field label="Descrição"><Input name="description" defaultValue={link.description ?? ""} /></Field>
          <Field label="Seção">
            <Select name="sectionId" defaultValue={link.sectionId ?? ""}>
              <option value="">Sem seção (topo)</option>
              {sections.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </Select>
          </Field>
          <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
            <Toggle name="visible" defaultChecked={link.visible} label="Visível na página" />
            <div className="flex items-center gap-2">
              {state?.error && <Notice kind="error">{state.error}</Notice>}
              <Button variant="danger" size="sm" type="submit" formAction={deleteLink} formNoValidate
                onClick={(e) => { if (!confirm("Excluir este link?")) e.preventDefault(); }}>
                <Icon.Trash className="size-4" /> Excluir
              </Button>
              <Button size="sm" type="submit" disabled={pending}><Icon.Check className="size-4" /> {pending ? "Salvando…" : "Salvar"}</Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
