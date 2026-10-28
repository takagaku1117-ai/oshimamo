import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { response, isLoggedIn } = await updateSession(request);

  // F-01: 未ログインで /me 以下に来たら /login へ（戻り先を next に入れる）
  const { pathname, search } = request.nextUrl;
  if (!isLoggedIn && (pathname === "/me" || pathname.startsWith("/me/"))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // 静的ファイルと画像は除く
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
