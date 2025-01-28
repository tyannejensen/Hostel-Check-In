import NextAuth from "next-auth";
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;   // satisfies NextAuthConfig;

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};