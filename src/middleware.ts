import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from './utils/cookie';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to auth pages without authentication
  if (pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth/google/callback') ||
    pathname.startsWith('/google') ||
    pathname.startsWith('/RTV_Logo.png') ||
    pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('access_token')?.value;

  // If no token, redirect to sign-in
  if (!token) {
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Allow access if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};