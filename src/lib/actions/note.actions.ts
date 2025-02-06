"use server"
import { dbConnect } from "@/lib/db"
import { Booking, User } from "@/models/index"
import { headers } from "next/headers"

export async function saveNote(payload: any) {
	console.log("Payload received:", payload)
	await dbConnect()
	const reqHeaders = await headers()
	const userId = reqHeaders.get("x-user-id")

	console.log("Logged in user:", userId)

	const newNote = payload.newNote
	const userIdFromUrl = payload.userId

	console.log("New note:", newNote)
	console.log("User ID from URL:", userIdFromUrl)

	if (!newNote) {
		return { error: true, message: "Please write a note" }
	}

	try {
		// Find the user by ID
		const user = await User.findById(userIdFromUrl)
		console.log("User found:", user)

		if (!user) {
			return { error: true, message: "User not found" }
		}

		// Get the booking ID from the user's bookings
		const bookingId = user.bookings[0]._id // Assuming the user has at least one booking

		const note = {
			content: newNote,
			createdBy: userId,
			createdAt: new Date(),
		}

		// Add the new note to the existing notes array
		user.notes.push(note)

		await user.save()

		console.log("Note saved successfully")
		return { error: false, message: "Note Created Successfully" }
	} catch (error) {
		console.error("Error adding note to booking:", error)
		return { error: true, message: (error as Error).message }
	}
}
