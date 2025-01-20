import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                        email: credentials?.email,
                        password: credentials?.password,
                    });

                    if (data?.token) {
                        return { token: data.token, user: data.user };
                    }
                    return null;
                } catch (error) {
                    console.error('Login failed:', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.token;
                token.user = user.user;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.user = token.user;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: { jwt: true },
});
