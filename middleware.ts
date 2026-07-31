import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const pathname = request.nextUrl.pathname
  const email = session?.value || ''
  
  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/signup', '/verify', '/forgot-password']
  const isPublicRoute = publicRoutes.includes(pathname)
  
  // If user is not authenticated and trying to access protected routes
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If user is authenticated and trying to access login/signup/verify/forgot-password pages
  if (session && (pathname === '/login' || pathname === '/signup' || pathname === '/verify' || pathname === '/forgot-password')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}