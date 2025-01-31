// For Mongoose Model Pre and Post Hook Functions
import { ObjectId, Query } from "mongoose"
import { Booking } from "@/models/Booking.model"
import { IBooking } from "@/lib/types/interfaces/booking.interface"
import { IChangeLog } from "@/lib/types/interfaces/change-log.interface"

// Functions to help with logging changes to documents

// Middleware to get the old document before updating
export async function getOldDoc(
	this: Query<any, any>, // Ensures 'this' is correctly types
	next: (err?: any) => void // Callback to move to the next middleware
) {
	const bookingId: ObjectId = await this.getQuery()._id
	const docToUpdate = await Booking.findById(bookingId)
	this.set("_oldDoc", docToUpdate)
	next()
}

// Middleware to log changes to the document history
export async function logChanges(
	this: Query<any, any>, // Ensures 'this' is correctly typed
	result: IBooking & Document // The document returned after update
) {
	if (!result || !this.get("_oldDoc")) return // Exit if no result or old doc

	// Retrieve the old and new document fields
	const oldDoc = this.get("_oldDoc") // Retrieve the old document
	const update = this.getUpdate() as { $set?: Record<string, any> } // Get the updated fields
	const userId = this.getOptions().userId // Get the userId from the query options

	if (!update) return // Exit if no update object

	const updatedFields = update.$set || {} // Safely access $set, defaulting to an empty object if undefined

	if (Object.keys(updatedFields).length === 0) return // Exit if no updated fields

	const changeLogs: IChangeLog[] = Object.keys(updatedFields)
		.map((field) => {
			const oldValue = (oldDoc as any)[field]
			const newValue = updatedFields[field]

			// Log the password change differently -> For the User Schema
			if (field === "password") {
				return {
					field,
					oldValue: "Password updated", // Log that the password was updated
					newValue: "Password updated", // Log that the password was updated
					updatedAt: new Date(),
					updatedBy: userId,
				} as IChangeLog
			}

			// Log the changes only if the value is different
			if (oldValue !== newValue) {
				return {
					field,
					oldValue,
					newValue,
					updatedAt: new Date(),
					updatedBy: userId,
				} as IChangeLog
			}
		})
		.filter(Boolean) as IChangeLog[] // Remove undefined logs

	// Append the changes to the history field
	if (changeLogs.length > 0) {
		result.history = result.history || []
		result.history.push(...changeLogs)
		await result.save() // Save the document with the new history
	}
}
