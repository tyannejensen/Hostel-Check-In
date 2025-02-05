"use server"

import { dbConnect } from "@/lib/db"
import { User } from "@/models/User.model"

// ----- GET DATA ----- //

// Get all tenants
export async function getTenants() {
	try {
		await dbConnect()

		const tenants = await User.find({ role: "tenant" })
			.populate("paymentMethods")
			.populate("bookings")

		if (!tenants)
			return {
				error: null,
				message: "No tenants found",
			}

		const tenantObjs = tenants.map((tenant) => tenant.toObject())

		return tenantObjs
	} catch (error) {
		console.error("Unable to get Tenants:", error)
		return { error: error, message: "Unable to get Tenants" }
	}
}

// Get tenant by ID
export async function getTenantById(id: string) {
	try {
		await dbConnect()

		const tenant = await User.findById(id)
			.populate("paymentMethods")
			.populate("bookings")

		if (!tenant)
			return {
				error: null,
				message: "Tenant not found",
			}

		const tenantObj = tenant?.toObject()

		return tenantObj
	} catch (error) {
		console.error("Unable to get Tenant:", error)
		return { error: error, message: "Unable to get Tenant" }
	}
}

// ----- SET DATA ----- //

// Register a new user
export async function registerUser(
    state: string | undefined,
    payload: FormData
) {
    await dbConnect()

    const firstName = payload.get("firstName") as string
    const lastName = payload.get("lastName") as string
    const email = payload.get("email") as string
    const password = payload.get("password") as string

    if (!firstName || !lastName || !email || !password) {
        return { error: true, message: "Please fill in all fields" }
    }

	if (password.length < 6) {
        return { error: true, message: "Password must be at least 6 characters long" }
    }

    try {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return { error: true, message: "Email already in use" }
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            role: "admin",
        })

        await newUser.save()

        return { error: false, message: "User created successfully" }
    } catch (error) {
        console.error("Error registering user:", error)
        return { error: true, message: "An error occurred while registering the user" }
    }
}