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

// register user function
export async function registerUser(
	prevState: string | undefined,
	formData: FormData
) {
	await dbConnect()

	const firstName = formData.get("firstName") as string
	const lastName = formData.get("lastName") as string
	const email = formData.get("email") as string
	const password = formData.get("password") as string

	if (!firstName || !lastName || !email || !password) {
		return "Please fill in all fields"
	}

	const newUser = new User({
		firstName,
		lastName,
		email,
		password,
		role: "user",
	})

	await newUser.save()

	return "User created successfully"
}
