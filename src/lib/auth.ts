import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import { dbConnect } from '@/lib/db'; // Ensure this path is correct
import { User } from '@/models/User.model'; // Ensure this path is correct
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

export default NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
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