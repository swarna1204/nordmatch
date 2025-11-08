import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  const pathname = req.nextUrl.pathname;

  // Protected routes
  const protectedRoutes = ['/dashboard', '/jobs', '/candidates'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Auth routes
  const authRoutes = ['/auth/signin', '/auth/signup'];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
  }

  if (isAuthRoute && token && verifyToken(token)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/jobs/:path*', '/candidates/:path*', '/auth/:path*'],
};