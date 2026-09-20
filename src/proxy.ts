import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ok = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/admin/login") {
    return ok ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
  }
  if (!ok) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
