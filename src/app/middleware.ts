import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const isRegisterPage = request.nextUrl.pathname === '/admin/register';

  // If trying to access admin routes without token, redirect to login
  if (isAdminRoute && !isLoginPage && !isRegisterPage && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If logged in and trying to access login/register, redirect to dashboard
  if ((isLoginPage || isRegisterPage) && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};