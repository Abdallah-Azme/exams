import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Define auth-related routes
  const isAuthRoute = pathname.startsWith('/signin') || pathname.startsWith('/signup')

  // ✅ If user IS authenticated but tries to access /signin or /signup → redirect to home
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 🚫 If user is NOT authenticated and tries to access any page except auth → redirect to /signin
  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // ✅ Otherwise, allow the request
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
      Match all routes except for:
      - _next (Next.js internals)
      - static assets
      - API routes (optional, if you want API protection, remove this)
      - favicon, images, etc.
    */
    '/((?!_next|api|static|favicon.ico|images|public).*)',
  ],
}
