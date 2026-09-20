import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, assets } from "@/db";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: RouteContext<"/api/assets/[id]">) {
  const { id } = await ctx.params;
  const asset = await db.query.assets.findFirst({ where: eq(assets.id, id) });
  if (!asset) return new NextResponse("Não encontrado", { status: 404 });
  return new NextResponse(new Uint8Array(asset.data), {
    headers: {
      "Content-Type": asset.mime,
      "Content-Length": String(asset.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
