"use server"

import { createDecipheriv } from "crypto"
import { headers } from "next/headers"
import mongoose from "mongoose"
import { dbConnect } from "@/lib/db"
import { User } from "@/models/index"
import path from "path"

// GET DATA

export async function getTenants() {
	await dbConnect()

	const tenants = await User.find({ role: "tenant" })
		.select(
			"_id firstName lastName fullName email phoneNumbers bookings paymentMethods tags createdBy"
		)
		.populate({
			path: "bookings",
			populate: {
				path: "roomId",
				select: "roomNumber",
			},
		})
		.populate("fullname")

	const tenantsAsObj = tenants.map((tenant: any) => tenant.toObject())

	// Ensure final data is fully JSON-serializable
	return tenantsAsObj
}

export async function getTenantById(id: string) {
	await dbConnect()

	// FIXME: Identify why the booking history for 'Alice Smith' is populating with the 'tenant' history on the tenant/{id} page
	const tenant = await User.findOne({ _id: id, role: "tenant" })
		.populate("fullname")
		.populate("billingAddress")
		.populate("birthdate")
		.populate("phoneNumbers")
		.populate({
			path: "bookings",
			populate: [
				{
					path: "roomId",
					select: "roomNumber",
				},
				{
					path: "notes",
					populate: {
						path: "createdBy",
						select: "firstName lastName",
					},
					select: "content createdBy createdAt",
				},
				{
					path: "history",
					populate: {
						path: "updatedBy",
						select: "fullname",
					},
				},
				{
					path: "history",
					populate: {
						path: "updates",
						select: "field oldValue newValue",
					},
				},
			],
		})
		.select(
			"_id firstName lastName fullName email phoneNumbers bookings paymentMethods tags history createdBy"
		)

	if (!tenant) {
		throw new Error("Tenant not found")
	}

	const tenantObj = tenant.toObject()
	return tenantObj
}

// SET DATA

//save tenant as a user

export async function saveTenant(payload: any) {
	await dbConnect()
	const reqHeaders = await headers()
	const userId = reqHeaders.get("x-user-id")
	await dbConnect()

	const firstName = payload.firstName
	const lastName = payload.lastName
	const email = payload.email
	const password = payload.password
	const birthdate = payload.birthdate
	const phoneNumbers = payload.phone
	const addressLineOne = payload.addressLineOne
	const addressLineTwo = payload.addressLineTwo
	const city = payload.city
	const state = payload.state
	const postalCode = payload.zip

	if (
		!firstName ||
		!lastName ||
		!email ||
		!password ||
		!birthdate ||
		!phoneNumbers ||
		!addressLineOne ||
		!addressLineTwo ||
		!city ||
		!state ||
		!postalCode	
	) {
		return { error: true, message: "Please fill in all fields" }
	}

	try {
		// Check if a user with the same email already exists
		const existingUserByEmail = await User.findOne({ email })
		if (existingUserByEmail) {
			return { error: true, message: "Email already in use" }
		}

		// Check if a user with the same first and last name already exists
		const existingUserByName = await User.findOne({ firstName, lastName })
		if (existingUserByName) {
			return {
				error: true,
				message: "User with the same first and last name already exists",
			}
		}

		const billingAddress = {
			addressLineOne,
			addressLineTwo,
			city,
			state,
			postalCode,
		  };

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
	  birthdate,
      phoneNumbers: [{ number: phoneNumbers, isPrimary: true }],
      billingAddress,
      role: "tenant",
      createdBy: userId,
    });

		console.log("Saving new user:", newUser)

		await newUser.save()

		console.log("User saved successfully")

		return { error: false, message: "Tenant created successfully" }
	} catch (error) {
		console.error("Error saving user:", error)
		return { error: true, message: (error as Error).message }
	}
}
