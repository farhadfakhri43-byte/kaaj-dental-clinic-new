import { NextResponse, type NextRequest } from 'next/server'
import {
  ADMIN_SESSION_COOKIE,
} from '@/lib/admin/auth'
import { verifySessionToken } from '@/lib/admin/session'

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const session = verifySessionToken(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
  )

  if (session) {
    return NextResponse.next()
  }

  const loginUrl = new URL('/admin/login', request.url)
  loginUrl.searchParams.set('next', pathname)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*'],
}
