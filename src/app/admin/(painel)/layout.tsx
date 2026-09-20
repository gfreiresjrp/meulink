import Link from "next/link";
import { LogoWordmark } from "@/components/Logo";
import { logout } from "../actions";
import { Button } from "@/components/ui";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/5 bg-navy/95 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-3">
            <LogoWordmark className="h-5 w-auto text-white" />
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-muted sm:inline">Entregáveis</span>
          </Link>
          <form action={logout}>
            <Button variant="ghost" size="sm" type="submit">Sair</Button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-8 pt-[88px]">{children}</main>
    </div>
  );
}
