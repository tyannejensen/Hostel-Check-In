import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { dbConnect } from "@/lib/db" // Ensure this path is correct
import type { IUser } from "@/interfaces/user.interface" // Ensure this path is correct
import { User } from "@/models/User.model" // Ensure this path is correct
import bcrypt from "bcrypt"

// Get a user using their email address
async function getUserByEmail(email: string): Promise<IUser | undefined> {
	await dbConnect()
	try {
		// Ensure the password field is included in the query
		const user = await User.findOne({ email }).select("+password").exec()
		if (!user) {
			console.error("User not found:", email)
			return undefined
		}
		return user
	} catch (error) {
		console.error("Failed to fetch user:", error)
		throw new Error("Failed to fetch user")
	}
}

// Export the auth object and the signIn and signOut functions

export const { auth, signIn, signOut } = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			async authorize(credentials) {
				const parsedCredentials = z
					.object({ email: z.string().email(), password: z.string().min(6) })
					.safeParse(credentials)

				if (parsedCredentials.success) {
					const { email, password } = parsedCredentials.data
					const user = await getUserByEmail(email)
					if (!user) return null
					const passwordsMatch = await bcrypt.compare(password, user.password)

					if (passwordsMatch) return user
				}

				console.log("Invalid credentials")
				return null
			},
		}),
	],
})
