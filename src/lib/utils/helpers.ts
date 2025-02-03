// For Mongoose Model Pre and Post Hook Functions
import { Query, Document } from "mongoose"
import { ObjectId } from "mongodb"
import { _doc } from "@/interfaces/_doc.interface"

// Functions to help with logging changes to documents

// Middleware to get the old document before updating
export async function getOldDoc(
	this: Query<any, any>,
	next: (err?: any) => void
	// Callback to move to the next middleware
) {
	// Fetch the document manually before updating
	const oldDoc = await this.model.findOne(this.getQuery())
	// Save the old document to the options object
	this.setOptions({ _oldDoc: oldDoc })

	next()
}

// Middleware to log changes to the document history
export async function logChanges(
	this: Query<any, any>,
	doc: any,
	next: (err?: any) => void
) {
	// If the document was updated, log the changes
	if (this.getOptions()._oldDoc && doc) {
		const oldDoc = this.getOptions()._oldDoc.toObject()
		const newDoc = doc.toObject()
		const changes = []

		console.log("Old Doc: ", this.getOptions()._oldDoc.isModified())
		console.log("New Doc: ", doc.isModified("email"))

		// Log if old and dnew docs were modified

		// Fields to ignore when logging changes
		const blockedFields = new Set(["history", "payments", "notes"])

		// Compare the current document with the old document
		for (const key in newDoc) {
			// Skip the history field
			if (blockedFields.has(key)) continue

			// If the field is an Array, loop through and compare the objects in the array
			if (newDoc[key] instanceof Array) {
				console.log(
					`Array: key: ${key}, value: ${newDoc[key]}, typeOf: ${typeof newDoc[
						key
					]}`
				)
				// if OldArray not equal to newArray
				// else OldArray equal to newArray

				if (newDoc[key][0] instanceof ObjectId) {
				} else if (typeof newDoc[key] === "object") {
				}

				newDoc[key].forEach((item: any, index: number) => {})
				continue
			} else if (newDoc[key] instanceof ObjectId) {
				console.log(
					`MongoDB ObjectId: key: ${key}, value: ${
						newDoc[key]
					}, typeOf: ${typeof newDoc[key]}`
				)
				if (oldDoc[key].toString() !== newDoc[key].toString()) {
					changes.push({
						field: key,
						oldValue: oldDoc[key],
						newValue: doc[key],
					})
				}
				continue
			} else if (typeof newDoc[key] === "object") {
				console.log(
					`Normal Object: key: ${key}, value: ${
						newDoc[key]
					}, typeOf: ${typeof newDoc[key]}`
				)
				// const newDocSubObject = doc[key].toString()
				// const oldDocSubObject = oldDoc[key].toString()
				// for (const subKey in newDocSubObject) {
				// 	if (oldDocSubObject[subKey] !== newDocSubObject[subKey]) {
				// 		changes.push({
				// 			field: `${key}.${subKey}`,
				// 			oldValue: oldDocSubObject[subKey],
				// 			newValue: newDocSubObject[subKey],
				// 		})
				// 	}
				// }
				continue
			} else if (oldDoc[key] !== newDoc[key]) {
				console.log(
					`Yes change to ${key}, value: ${doc[key]}, typeOf: ${typeof doc[key]}`
				)
				changes.push({
					field: key,
					oldValue: oldDoc[key],
					newValue: doc[key],
				})
			}
		}

		// If there are no changes, move to the next middleware
		if (changes.length === 0) {
			return next()
		}

		console.log("Changes: ", changes)

		// If there are changes, add them to the history array
		doc.history.push({
			updates: changes,
			updatedBy: this.getOptions().userId,
		})

		await doc.save()
		next()
	}
}

export async function logHistory(this: _doc, next: (err?: any) => void) {
	// Do not check for changes if the document is new
	if (this.isNew) {
		return next()
	}
	// 'this' refers to the new document (after modifications)
	const newDoc = this
	const newDocObj = newDoc.toObject() // used to loop through only the plain document fields

	// Access the old document (before modifications)
	const oldDoc = this._doc

	console.log(newDoc.isModified())
	for (const key in newDocObj) {
		// Skip the history field
		if (key === "history") continue

		// Add all modified fields to the updatedFields array
		const updatedFields = []
		if (newDoc.isModified(key)) {
			updatedFields.push(key)
		} else {
			continue
		}

		console.log(`Path: ${key}, Modified: ${newDoc.isModified(key)}`)
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
