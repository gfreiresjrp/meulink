import { LogoWordmark } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <LogoWordmark className="h-7 w-auto text-white" />
      <h1 className="font-display text-2xl font-semibold">Página não encontrada</h1>
      <p className="max-w-xs text-sm text-muted">Este link não existe ou ainda não foi publicado.</p>
    </main>
  );
}
