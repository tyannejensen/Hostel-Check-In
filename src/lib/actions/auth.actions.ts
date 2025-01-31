"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"
import { dbConnect } from "@/lib/db"
import { User } from "@/lib/models/User.model"

export async function authenticate(
	prevState: string | undefined,
	formData: FormData
) {
	try {
		await signIn("credentials", formData)
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return "Invalid credentials"
				default:
					return "An error occurred"
			}
		}
		throw error
	}
}
