import { Schema, model, Document, models, ObjectId, Query } from "mongoose"
import { IChangeLog } from "@/interfaces/change-log.interface"
import { IBooking } from "@/interfaces/booking.interface"
import { changeLogSchema } from "@/models/Log.schema"
import { noteSchema } from "@/models/Note.schema"

const bookingSchema = new Schema<IBooking>(
	{
		bookedBy: {
			type: String, // reference to the user (tenant) who made the booking - uses uuid v4
			required: [true, "Tenant ID is required"],
			ref: "User",
		},
		createdBy: {
			type: String, // reference to the user (employee) who created the booking - uses uuid v4
			required: [true, "Employee ID is required"],
			ref: "User",
		},
		roomId: {
			// reference to the Room Schema
			type: Schema.Types.ObjectId,
			ref: "Room",
			required: [true, "Room ID is required"],
		},
		checkIn: {
			type: Date,
			required: [true, "Check-in date is required"],
		},
		checkOut: {
			type: Date,
			required: [true, "Check-out date is required"],
		},
		status: {
			type: String,
			enum: ["paid", "pending", "due"],
			default: "pending",
		},
		DepositAmount: {
			type: Number,
			required: [true, "Deposit amount is required"],
		},
		depositReturned: {
			type: Boolean,
			default: false,
		},
		depositReturnDate: {
			type: Date,
		},
		depositReturnAmount: {
			type: Number,
		},
		payments: [
			{
				type: Schema.Types.ObjectId,
				ref: "Payment",
			},
		],
		Notes: [noteSchema],
		history: [changeLogSchema],
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

// Functions to help with logging changes to the booking history
async function getOldDoc(
	this: Query<any, any>, // Ensures 'this' is correctly types
	next: (err?: any) => void // Callback to move to the next middleware
) {
	const bookingId: ObjectId = await this.getQuery()._id
	const docToUpdate = await Booking.findById(bookingId)
	this.set("_oldDoc", docToUpdate)
	next()
}

async function logChanges(
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

// Capture and save the old Booking document before updating - Part 1 of 2 of logging the booking history
bookingSchema.pre("findOneAndUpdate", getOldDoc) // IMPORTANT: Use findOneAndUpdate as the standard unless you have a good reason not to
bookingSchema.pre("updateOne", getOldDoc)
bookingSchema.pre("replaceOne", getOldDoc)
// DO NOT USE findByIdAndUpdate as it does not trigger the pre hook

// Capture and save the old Booking document before updating - Part 2 of 2 of logging the booking history
bookingSchema.post("findOneAndUpdate", logChanges) // IMPORTANT: Use findOneAndUpdate as the standard unless you have a good reason not to
bookingSchema.post("updateOne", logChanges)
bookingSchema.post("replaceOne", logChanges)
// DO NOT USE findByIdAndUpdate as it does not trigger the post hook

export const Booking =
	models.Booking || model<IBooking>("Booking", bookingSchema)
