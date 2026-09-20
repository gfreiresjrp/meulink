import { NextResponse, type NextRequest } from "next/server";
import { db, assets } from "@/db";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { newId } from "@/lib/utils";

export const dynamic = "force-dynamic";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);

export async function POST(req: NextRequest) {
  const ok = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  if (!ok) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const fd = await req.formData();
  const file = fd.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: "Formato não suportado. Use PNG, JPG, WEBP, GIF ou SVG." }, { status: 415 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Arquivo muito grande. Máximo de 4 MB." }, { status: 413 });

  const id = newId();
  const data = Buffer.from(await file.arrayBuffer());
  await db.insert(assets).values({ id, mime: file.type, size: data.length, data });
  return NextResponse.json({ url: `/api/assets/${id}` });
}
