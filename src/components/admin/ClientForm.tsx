"use client";

import { useActionState, useState } from "react";
import type { Client } from "@/db";
import type { ActionState } from "@/app/admin/actions";
import { Button, Card, Field, Input, Notice, Toggle } from "@/components/ui";
import { ImageField } from "./ImageField";
import { slugify } from "@/lib/utils";
import { SOCIAL_KEYS, SOCIAL_LABELS, SOCIAL_PLACEHOLDERS, parseSocials } from "@/lib/socials";

export function ClientForm({
  client,
  action,
  submitLabel,
  baseUrl,
}: {
  client?: Client;
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  submitLabel: string;
  baseUrl?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [slug, setSlug] = useState(client?.slug ?? "");
  const [touched, setTouched] = useState(Boolean(client));
  const socials = parseSocials(client?.socials);

  return (
    <form action={formAction}>
      <Card title="Dados do cliente">
        {client && <input type="hidden" name="id" value={client.id} />}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome">
            <Input
              name="name"
              required
              defaultValue={client?.name}
              placeholder="Ex.: Farmácia Vida"
              onChange={(e) => !touched && setSlug(slugify(e.target.value))}
            />
          </Field>
          <Field label="Slug (endereço)" hint={baseUrl ? `${baseUrl}/${slug || "…"}` : undefined}>
            <Input
              name="slug"
              value={slug}
              onChange={(e) => {
                setTouched(true);
                setSlug(slugify(e.target.value));
              }}
              placeholder="farmacia-vida"
            />
          </Field>
          <Field label="Frase de apoio" hint="Aparece abaixo do nome. Opcional.">
            <Input name="tagline" defaultValue={client?.tagline ?? ""} placeholder="Central de entregáveis da parceria" />
          </Field>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ImageField name="logoUrl" label="Logo / avatar" hint="Imagem quadrada. Se vazio, mostra o símbolo ALVEO." defaultValue={client?.logoUrl} shape="square" />
          <ImageField name="coverUrl" label="Capa" hint="Imagem horizontal 3:1 (ex.: 1500×500). Se vazio, usa a capa ALVEO." defaultValue={client?.coverUrl} shape="wide" />
        </div>

        <h3 className="mt-6 font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">Redes sociais</h3>
        <p className="mt-1 text-xs text-muted">Aparecem como ícones redondos abaixo do nome. Deixe vazio o que não usar.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {SOCIAL_KEYS.map((k) => (
            <Field key={k} label={SOCIAL_LABELS[k]}>
              <Input name={`social_${k}`} defaultValue={socials[k] ?? ""} placeholder={SOCIAL_PLACEHOLDERS[k]} />
            </Field>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <Toggle name="published" defaultChecked={client ? client.published : true} label="Página publicada" />
          <div className="flex items-center gap-3">
            {state?.error && <Notice kind="error">{state.error}</Notice>}
            {state?.ok && <Notice kind="ok">Salvo.</Notice>}
            <Button type="submit" disabled={pending}>{pending ? "Salvando…" : submitLabel}</Button>
          </div>
        </div>
      </Card>
    </form>
  );
}
