"use client";

import { useRef, useState } from "react";
import { Button, Field, Input } from "@/components/ui";
import { Icon } from "./Icons";
import { cn } from "@/lib/utils";

/**
 * Campo de imagem: envia um arquivo do computador (fica salvo no banco) ou aceita uma URL.
 * O valor final vai no input hidden `name`.
 */
export function ImageField({
  name,
  label,
  hint,
  defaultValue,
  shape = "square",
}: {
  name: string;
  label: string;
  hint?: string;
  defaultValue?: string | null;
  shape?: "square" | "wide";
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error ?? "Falha no envio.");
      setValue(json.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha no envio.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <Field label={label} hint={error ?? hint}>
      <input type="hidden" name={name} value={value} />
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "grid shrink-0 place-items-center overflow-hidden rounded-xl bg-navy ring-1 ring-white/10",
            shape === "square" ? "size-[72px]" : "h-[72px] w-[144px]",
          )}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-[10px] uppercase tracking-wider text-muted/60">Sem imagem</span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(f);
              }}
            />
            <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => fileRef.current?.click()}>
              {busy ? "Enviando…" : "Enviar imagem"}
            </Button>
            {value && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setValue("")} title="Remover imagem">
                <Icon.Trash className="size-4" /> Remover
              </Button>
            )}
          </div>
          <Input
            value={value.startsWith("/api/assets/") ? "" : value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={value.startsWith("/api/assets/") ? "Imagem enviada pelo painel" : "ou cole uma URL: https://…"}
            disabled={value.startsWith("/api/assets/")}
            className="h-9 text-xs"
          />
        </div>
      </div>
    </Field>
  );
}
