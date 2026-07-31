import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const pathname = request.nextUrl.pathname
  const email = session?.value || ''
  
  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/signup', '/verify', '/forgot-password']
  const isPublicRoute = publicRoutes.includes(pathname)
  
  // Set-password page requires authentication but allows authenticated users
  if (pathname === '/set-password') {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }
  
  // If user is not authenticated and trying to access protected routes
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If user is authenticated and trying to access login/signup/verify/forgot-password pages
  if (session && (pathname === '/login' || pathname === '/signup' || pathname === '/verify' || pathname === '/forgot-password')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // For dashboard and other protected routes, check if user has password set
  // Note: This is a simple check - in production you'd want to verify this server-side
  // For now, we'll allow access and let the application handle password verification
  if (session && pathname === '/dashboard') {
    // We could add a check here to redirect to set-password if no password is set
    // But since we're using in-memory storage, we'll handle this in the application layer
    return NextResponse.next()
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