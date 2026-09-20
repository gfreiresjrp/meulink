import { ClientForm } from "@/components/admin/ClientForm";
import { createClient } from "@/app/admin/actions";

export const metadata = { title: "Novo cliente" };

export default function NewClientPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className=" font-display text-2xl font-semibold">Novo cliente</h1>
        <p className="mt-1 text-sm text-muted">Depois de criar, você adiciona as seções e os links.</p>
      </div>
      <ClientForm action={createClient} submitLabel="Criar cliente" />
    </div>
  );
}
