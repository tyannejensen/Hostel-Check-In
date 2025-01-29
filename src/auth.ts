import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { dbConnect } from '@/utils/db';
import User from '@/lib/definitions';
import bcrypt from 'bcrypt';

async function getUserByEmail(email: string) {
    await dbConnect();
    try {
        const user = await User.findOne({ email }).exec();
        return user;
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
                }).safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUserByEmail(email);
                    if (!user) return null;
                    const isValid = await bcrypt.compare(password, user.password);
                    if (isValid) return user;
                }
                return null;
            }
        })
    ]
});