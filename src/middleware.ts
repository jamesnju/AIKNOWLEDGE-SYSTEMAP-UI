import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get token from cookies or localStorage (cookies are more secure)
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  const { pathname } = request.nextUrl;
  
  // Check if the route is an admin route
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';
  const isRegisterPage = pathname === '/admin/register';
  const isHomePage = pathname === '/';
  
  // Allow access to home page and public content
  if (!isAdminRoute) {
    return NextResponse.next();
  }
  
  // Allow access to login and register pages if not authenticated
  if ((isLoginPage || isRegisterPage) && !token) {
    return NextResponse.next();
  }
  
  // If authenticated and trying to access login/register, redirect to dashboard
  if ((isLoginPage || isRegisterPage) && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }
  
  // If trying to access admin routes without token, redirect to login
  if (isAdminRoute && !isLoginPage && !isRegisterPage && !token) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};