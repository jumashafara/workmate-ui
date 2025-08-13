import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from './utils/cookie';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/sign-in',
    '/sign-up', 
    '/forgot-password',
    '/_next',
    '/api',
    '/auth/google/callback',
    '/google',
    '/RTV_Logo.png',
    '/favicon.ico'
  ];

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route => 
    route === pathname || pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('access_token')?.value;

  // If no token, redirect to sign-in page
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