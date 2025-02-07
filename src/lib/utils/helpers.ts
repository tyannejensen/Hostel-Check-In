// For Mongoose Model Pre and Post Hook Functions
import mongoose, { Document, Model } from "mongoose"
import { ObjectId } from "mongodb"
import { IRoom } from "@/interfaces/room.interface"
import { IUser } from "@/interfaces/user.interface"
import { IBooking } from "@/interfaces/booking.interface"
import { IPaymentMethod } from "@/interfaces/payment-method.interface"
import { ILog } from "../types/interfaces"

// Functions to help with logging changes to documents

// Middleware to log changes to the document history
export async function logChanges(
	this: Document & {
		history: { updates: Partial<ILog>[]; updatedAt: Date; updatedBy: string }[]
		updatedBy: string
		createdBy: string
	},
	next: mongoose.CallbackWithoutResultAndOptionalError
) {
	try {
		// Do not check for changes if the document is new
		if (this.isNew || this.$session()) {
			console.log("Session present")
			return next()
		}

		// log the model the document is from
		console.log(
			`Model: ${(this.constructor as typeof mongoose.Model).modelName}`
		)
		console.log(`this: ${this._id}`)

		const newDoc = this as IBooking | IUser | IPaymentMethod // 'this' refers to the new document (after modifications)
		const newDocObj = newDoc.toObject() // used to loop through only the plain document fields
		const thisModel = this.constructor as Model<
			IUser | IBooking | IRoom | IPaymentMethod
		> // Get the model of the current document
		const oldDoc = await thisModel.findById(this._id).lean() // Fetch the old document

		if (!oldDoc) {
			return next(new Error("Old document not found"))
		}

		// Exit middleware if no changes are detected
		if (!newDoc.isModified()) return next(new Error("No changes detected"))

		const fieldsToIgnore = new Set([
			"history",
			"createdAt",
			"updatedAt",
			"id",
			"createdBy",
		]) // Fields to ignore when logging changes
		const changes: Partial<ILog>[] = [] // Array to store updated fields

		for (const key in newDocObj) {
			// Skip specific fields in 'fieldsToIgnore' set
			if (fieldsToIgnore.has(key)) continue

			// Is field modified?
			if (newDoc.isModified(key)) {
				// Is the field is an object?
				if (newDocObj[key] instanceof Object) {
					// Log the type of field
					console.log(`${key} is an object`)

					// Is the field is an Array && ObjectId (MongoDB ObjectId)?
					if (
						newDocObj[key] instanceof Array &&
						newDocObj[key][0] instanceof ObjectId
					) {
						console.log(`${key} is an Array of MongoDB ObjectIds`)
						// Check if the array elements have been modified
						for (let i = 0; i < newDocObj[key].length; i++) {
							if (newDoc.isModified(`${key}.${i}`)) {
								// Log the updated field
								console.log(`${key}.${i} is modified`)

								console.log(`newDocObj[key][i]: ${newDocObj[key][i]}`)

								changes.push({
									field: `${key}.${i}`,
									oldValue: (oldDoc as typeof newDocObj)[key][i] || "N/A",
									newValue: newDocObj[key][i],
								})
							}
						}
						continue
					}

					// Is the field is an Array && Object?
					if (
						newDocObj[key] instanceof Array &&
						typeof newDocObj[key][0] === "object"
					) {
						console.log(`${key} is an Array of Objects`)
						// Check if the array elements have been modified
						for (let i = 0; i < newDocObj[key].length; i++) {
							for (const subKey in newDocObj[key][i]) {
								if (newDoc.isModified(`${key}.${i}.${subKey}`)) {
									// Log the updated field
									console.log(`${key}.${i}.${subKey} is modified`)

									// console.log(`${subKey}: ${newDocObj[key][i][subKey]}`)
									if (fieldsToIgnore.has(subKey)) continue

									let _oldValue
									if (!(oldDoc as typeof newDocObj)[key][i]?.subKey) {
										_oldValue = "N/A"
									} else {
										_oldValue = (oldDoc as typeof newDocObj)[key][i][subKey]
									}

									changes.push({
										field: `${key}.${i}.${subKey}`,
										oldValue: _oldValue,
										newValue: newDocObj[key][i][subKey],
									})
								}
							}
						}
						continue
					}

					// Is the field is an ObjectId (MongoDB ObjectId)?
					if (newDocObj[key] instanceof ObjectId) {
						// Log the type of field
						console.log(`${newDocObj[key]} is a MongoDB ObjectId`)

						changes.push({
							field: key,
							oldValue: (oldDoc as typeof newDocObj)[key] || "N/A",
							newValue: newDocObj[key],
						})
					}

					// Move to the next field
					continue
				}

				// Is the field is a string, number, boolean, or date?
				if (
					typeof newDocObj[key] === "string" ||
					typeof newDocObj[key] === "number" ||
					typeof newDocObj[key] === "boolean" ||
					newDocObj[key] instanceof Date
				) {
					console.log(`${newDocObj[key]} is of type ${typeof newDocObj[key]}`)

					// Log the updated field
					changes.push({
						field: key,
						oldValue: (oldDoc as typeof newDocObj)[key] || "N/A",
						newValue: newDocObj[key],
					})
					continue
				} else {
					console.log(
						`Type not captured: ${newDocObj[key]} is of type ${typeof newDocObj[
							key
						]}`
					)
				}
			}
		}

		// Log the changes to the console
		console.log(`Updated fields: ${JSON.stringify(changes)}\n`)
		console.log(`UpdatedBy: ${this}`)
		// Add the changes to the document's history
		this?.history.push({
			updates: changes,
			updatedAt: new Date(),
			updatedBy: this.updatedBy || this.createdBy,
		})

		console.log(`History: ${this?.history}`) // debugging
	} catch (error) {
		console.error("Error in logChanges middleware:", error)
		next(error as mongoose.CallbackError)
	}
}

// Setter function to format dates for createdAt and updatedAt fields
export function formatDate(v: Date): string {
	const date = new Date(v)
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "2-digit",
	})
}

// Function to check if a string is a valid MongoDB ObjectId
export function isStrictValidObjectId(value: string): boolean {
	const isValid = ObjectId.isValid(value)
	console.log(`isValid: ${isValid}`)

	const isStrict = new ObjectId(value).toString() === value
	console.log(`isStrict: ${isStrict}`)
	return isValid && isStrict
}
