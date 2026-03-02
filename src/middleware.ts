import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Next.js basePath is handled automatically in links,
  // but in Middleware redirects, we must be explicit.
  const BASE_PATH = "/dr-tarek-salah-exam";

  const isAuthRoute =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");

  // ✅ If authenticated but on auth route -> redirect to the App Home
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL(BASE_PATH, request.url));
  }

  // 🚫 If NOT authenticated and not on auth route -> redirect to /signin
  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL(`${BASE_PATH}/signin`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico|images|public).*)"],
};
