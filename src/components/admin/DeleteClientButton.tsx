"use client";

import { deleteClient } from "@/app/admin/actions";
import { Button } from "@/components/ui";

export function DeleteClientButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteClient}
      onSubmit={(e) => {
        if (!confirm(`Excluir "${name}" e todos os links? Esta ação não pode ser desfeita.`)) e.preventDefault();
      }}
      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5 ring-1 ring-red-500/15"
    >
      <input type="hidden" name="id" value={id} />
      <div><p className="font-display text-sm font-semibold text-white">Excluir cliente</p><p className="text-xs text-muted">Remove a página, as seções e todos os links. Não pode ser desfeito.</p></div>
      <Button variant="danger" size="sm" type="submit">Excluir</Button>
    </form>
  );
}
