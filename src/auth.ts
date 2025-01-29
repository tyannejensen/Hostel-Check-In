import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { dbConnect } from '@/utils/db';
import type { User } from '@/lib/definitions';
import bcrypt from 'bcrypt';

async function getUserbyEmail(email: string): Promise<User | undefined> {
    const client = await dbConnect();
    try {
        const user = await client.sql<User>`SELECT * FROM users WHERE email = ${email}`;
        return user.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user');
    }
}


export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z.object({
                    email: z.string().email(),
                    password: z.string().min(8)
                })
                    .safeParse(credentials);


                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUserbyEmail(email);
                    if (!user) return null;
                    const isValid = await bcrypt.compare(password, user.password);
                    if (isValid) return user;
                }
                console.log('Invalid credentials');
                return null;
            },
        })],
});