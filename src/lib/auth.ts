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
        // Ensure the password field is included in the query
        const user = await User.findOne({ email }).select('+password').exec();
        if (!user) {
            console.error('User not found:', email);
            return null;
        }
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user');
    }
}

export const { auth, signIn, signOut} = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                console.log('Authorize function called with credentials:', credentials);

                if (!credentials) {
                    console.error('No credentials provided');
                    return null;
                }

                const parsedCredentials = z.object({
                    email: z.string().email(),
                    password: z.string().min(8)
                }).safeParse(credentials);

                if (!parsedCredentials.success) {
                    console.error('Invalid credentials format:', parsedCredentials.error);
                    return null;
                }

                const { email, password } = parsedCredentials.data;
                const user = await getUserByEmail(email);
                if (!user) {
                    console.error('User not found:', email);
                    return null;
                }

                if (!user.password) {
                    console.error('User password not found:', email);
                    return null;
                }

                const passwordsMatch = await bcrypt.compare(password, user.password);
                if (!passwordsMatch) {
                    console.log(password, user.password);
                    console.error('Invalid password for user:', email);
                    return null;
                }

                console.log('User authenticated successfully:', user);
                return user;
            }
        })
    ]
});