import { NextResponse, type NextRequest } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db, links } from "@/db";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, ctx: RouteContext<"/go/[id]">) {
  const { id } = await ctx.params;
  const link = await db.query.links.findFirst({ where: eq(links.id, id) });
  if (!link) return new NextResponse("Link não encontrado", { status: 404 });

  // Contagem de cliques sem bloquear o redirecionamento.
  db.update(links)
    .set({ clicks: sql`${links.clicks} + 1` })
    .where(eq(links.id, id))
    .run()
    .catch(() => {});

  return NextResponse.redirect(link.url, { status: 302 });
}
