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

	return "User created successfully"
}
