import { LoginForm } from "./LoginForm";
import { LogoWordmark } from "@/components/Logo";

export const metadata = { title: "Entrar" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : "/admin";
  return (
    <main className="relative flex flex-1 items-center justify-center px-4">
      <div aria-hidden className="chevrons pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative w-full max-w-sm rounded-2xl bg-navy-deep p-8 ring-1 ring-white/5 shadow-card">
        <LogoWordmark className="h-6 w-auto text-white" />
        <h1 className="mt-6 font-display text-xl font-semibold">Painel de entregáveis</h1>
        <p className="mt-1 text-sm text-muted">Acesso interno da equipe ALVEO.</p>
        <LoginForm next={next} />
      </div>
    </main>
  );
}
