import NextAuth from "next-auth";
import { authConfig } from './auth.config';
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default NextAuth(authConfig).auth;


export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  
    // Allow the seed page to be accessed without authentication
    if (req.nextUrl.pathname.startsWith('/seed')) {
      return NextResponse.next();
    }
  
    // Redirect to login if the user is not authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  
    return NextResponse.next();
  }
  
  export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|seed).*)'],
  };