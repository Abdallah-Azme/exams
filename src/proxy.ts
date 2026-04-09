import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Define auth routes (Next.js removes the basePath from pathname here)
  const isAuthRoute = pathname === "/signin" || pathname === "/signup";

  // 1. If authenticated but on auth route -> redirect to App Home
  if (token && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/"; // Next.js adds basePath automatically here
    return NextResponse.redirect(url);
  }

  // 2. If NOT authenticated and not on an auth route -> redirect to /signin
  if (!token && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin"; // Next.js adds basePath automatically here
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // This is the fix for the root path issue
    { source: "/" },
    // Standard exclusion for assets/APIs
    "/((?!api|_next/static|_next/image|favicon.ico|public|images).*)",
  ],
};
