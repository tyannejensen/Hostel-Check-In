// TODO: add all mutation functions to this file.

'user server';

import { signIn } from '../auth';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
        } catch (error) {
            if (error instanceof AuthError) {
                switch (error.type) {
                    case 'CredentialsSignin':
                        return 'Invalid credentials';
                    default:
                        return 'An error occurred';
                }
            }
            throw error;
    }
}
