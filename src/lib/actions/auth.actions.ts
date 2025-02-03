"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

// Add token to registerUser function
import { dbConnect } from "@/lib/db"
import { User } from "@/models/User.model"
import jwt from "jsonwebtoken"

// Update the registerUser function to return a token.
// Store the token in local storage upon successful registration.
// Retrieve the token from local storage when needed.
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
        role: "admin",
    })

    await newUser.save()

    // Generate a token
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    })

    return { message: "User created successfully", token }
}

// Update the authenticate function to return a token.
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
