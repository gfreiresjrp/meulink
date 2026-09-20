import type { Section } from "@/db";
import { createSection, deleteSection, moveSection, renameSection } from "@/app/admin/actions";
import { Button, Card, Input } from "@/components/ui";
import { Icon } from "./Icons";

export function SectionsPanel({ clientId, sections }: { clientId: string; sections: Section[] }) {
  return (
    <div className="flex flex-col gap-6">
      <Card title="Nova seção">
        <p className="mb-4 text-xs text-muted">
          Seções agrupam os links na página (ex.: Identidade, Site, Criativos). São opcionais: links sem seção aparecem no topo, sob o título &ldquo;Links&rdquo;.
        </p>
        <form action={createSection} className="flex gap-2">
          <input type="hidden" name="clientId" value={clientId} />
          <Input name="title" placeholder="Ex.: Criativos" required />
          <Button type="submit"><Icon.Plus className="size-4" /> Adicionar</Button>
        </form>
      </Card>

      <Card title={`Seções (${sections.length})`}>
        {sections.length === 0 ? (
          <p className="text-sm text-muted">Nenhuma seção ainda.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {sections.map((s, i) => (
              <li key={s.id} className="flex items-center gap-2 rounded-xl bg-navy p-2 ring-1 ring-white/5">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/5 font-display text-xs font-semibold text-muted">{i + 1}</span>
                <form action={renameSection} className="flex flex-1 items-center gap-2">
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="clientId" value={clientId} />
                  <Input name="title" defaultValue={s.title} className="h-9 bg-transparent ring-0 focus:bg-navy-deep" />
                  <Button variant="ghost" size="sm" type="submit" title="Salvar nome"><Icon.Check className="size-4" /></Button>
                </form>
                <form action={moveSection} className="flex">
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="clientId" value={clientId} />
                  <Button variant="ghost" size="sm" name="dir" value="up" type="submit" disabled={i === 0} title="Subir"><Icon.Up className="size-4" /></Button>
                  <Button variant="ghost" size="sm" name="dir" value="down" type="submit" disabled={i === sections.length - 1} title="Descer"><Icon.Down className="size-4" /></Button>
                </form>
                <form action={deleteSection}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="clientId" value={clientId} />
                  <Button variant="danger" size="sm" type="submit" title="Remover seção (os links voltam para o topo)"><Icon.Trash className="size-4" /></Button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
