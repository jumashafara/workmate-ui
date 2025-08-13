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
    route === pathname 
  );


  if (isPublicRoute) {
    // Check if user is already logged in and trying to access auth pages
    const token = request.cookies.get('access_token')?.value;
    const role = request.cookies.get('user_role')?.value;
    const isSuperuser = request.cookies.get('user_superuser')?.value === 'true';

    const authPages = ['/sign-in', '/sign-up', '/forgot-password'];
    const isAuthPage = authPages.some(page => pathname.startsWith(page));

    if (token && isAuthPage) {
      // User is logged in but trying to access auth pages, redirect to appropriate dashboard
      let redirectUrl;
      
      if (isSuperuser) {
        redirectUrl = new URL('/superuser/predictions', request.url);
      } else if (role === 'area_manager') {
        redirectUrl = new URL('/area-manager/predictions', request.url);
      } else {
        redirectUrl = new URL('/dashboard', request.url);
      }
      
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  // Get token and user info from cookies
  const token = request.cookies.get('access_token')?.value;
  const role = request.cookies.get('user_role')?.value;
  const isSuperuser = request.cookies.get('user_superuser')?.value === 'true';

  // If no token, redirect to sign-in page
  if (!token) {
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Define role-based route access
  const superuserOnlyRoutes = [
    '/superuser',
    '/model-metrics',
    '/feature-importance',
    '/individual-predictions',
    '/multiple-predictions',
    '/cluster-trends',
    '/project-manager',
    '/reports'
  ];

  const areaManagerRoutes = [
    '/area-manager'
  ];

  // Routes accessible to all authenticated users
  const commonRoutes = [
    '/chat',
    '/dashboard'
  ];

  // Check if user is trying to access a restricted route
  const isAccessingSuperuserRoute = superuserOnlyRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  const isAccessingAreaManagerRoute = areaManagerRoutes.some(route => 
    pathname.startsWith(route)
  );


  // Role-based access control - check user role first
  if (!isSuperuser) {
    // Non-superusers have restricted access
    if (role === 'area_manager') {
      // Area managers can only access chat, dashboard, and area-manager routes
      const isAllowedRoute = pathname.startsWith('/chat') || pathname.startsWith('/dashboard') || pathname.startsWith('/area-manager') || pathname.startsWith('/unauthorized');
      if (!isAllowedRoute) {
        const unauthorizedUrl = new URL('/unauthorized', request.url);
        return NextResponse.redirect(unauthorizedUrl);
      }
    } else {
      // Regular users can only access chat and dashboard
      const isAllowedRoute = pathname.startsWith('/chat') || pathname.startsWith('/dashboard') || pathname.startsWith('/unauthorized');
      if (!isAllowedRoute) {
        const unauthorizedUrl = new URL('/unauthorized', request.url);
        return NextResponse.redirect(unauthorizedUrl);
      }
    }
  }
  // Superusers can access everything, so no restrictions

  // Allow access if user has proper permissions
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