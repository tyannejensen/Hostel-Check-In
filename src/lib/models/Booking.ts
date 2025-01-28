import { Schema, model, ObjectId, Document, models } from "mongoose"
import { IPayment } from "./Payment"
import { changeLogSchema, IChangeLog } from "./Log"

// Custom types for Booking Schema
type IBookingStatus = "paid" | "pending" | "due"

// Interfaces for Booking Schema

export interface INote {
	content: string
	createdAt: Date
	createdBy: string // reference to the user (employee) who created the note - uses uuid v4
}

export interface IBooking extends Document {
	bookedBy: string // reference to the user (tenant) who made the booking - uses uuid v4
	createdBy: string // reference to the user (employee) who created the booking - uses uuid v4
	roomId: ObjectId
	checkIn: Date
	checkOut: Date
	status: IBookingStatus
	DepositAmount: number
	depositReturned: boolean
	depositReturnDate?: Date
	depositReturnAmount?: number
	payments: IPayment[]
	totalPayment?: number
	Notes?: INote[]
	history?: IChangeLog[]
}

// Note Schema - subdocument of Booking Schema
const noteSchema = new Schema<INote>(
	{
		content: {
			type: String,
			required: [true, "Note is required"],
			minLength: [5, "Note must be at least 5 characters long"],
			maxLength: [1000, "Note must not exceed 1000 characters"],
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		createdBy: {
			ref: "User",
			type: String, // reference to the user (employee) who created the note - uses uuid v4
			required: [true, "Employee ID is required"],
		},
	},
	{ versionKey: false } // Disable versioning (__v) field to prevent notes from being updated
)

// Notes Pre Save Hook -> Middleware to enforce immutability of notes
noteSchema.pre("save", function (next) {
	if (this.isNew) {
		// If the note is new, allow it to save
		return next()
	}

	// Prevent updating the note if it already exists
	this.invalidate("content", "Notes cannot be modified after creation")
	next(new Error("Notes are immutable once created"))
})

// TODO: Complete the Booking Schema - add validation, default values, and required fields

const bookingSchema = new Schema<IBooking>({
	bookedBy: {
		type: String,
		required: [true, "Tenant ID is required"],
	},
	createdBy: {
		type: String,
		required: [true, "Employee ID is required"],
	},
	roomId: {
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
})

// Capture and save the old Booking document before updating - Part 1 of 2 of logging the booking history
bookingSchema.pre("findOneAndUpdate", async function (next) {
	const query = this // Reference to the query
	const docToUpdate = await this.model.findOne(this.getQuery()) // Fetch the old document
	query.set("_oldDoc", docToUpdate) // Store the old document in a query property
	next()
})

// Capture and save the old Booking document before updating - Part 2 of 2 of logging the booking history
bookingSchema.post("findOneAndUpdate", async function (result) {
	if (!result || !this.get("_oldDoc")) return // Exit if no result or old doc

	const oldDoc = this.get("_oldDoc") // Retrieve the old document
	const update = this.getUpdate() // Retrieve the update object
	if (!update) return // Exit if no updates
	const updatedFields = (update as any).$set // Retrieve updated fields

	const changeLogs = Object.keys(updatedFields)
		.map((field) => {
			const oldValue = oldDoc[field]
			const newValue = updatedFields[field]

			// Log the changes only if the value is different
			if (oldValue !== newValue) {
				return {
					field,
					oldValue,
					newValue,
				}
			}
		})
		.filter(Boolean) // Remove undefined logs

	// Append the changes to the history field
	if (changeLogs.length > 0) {
		result.history.push(...changeLogs)
		await result.save() // Save the document with the new history
	}
})

export const Booking =
	models.Booking || model<IBooking>("Booking", bookingSchema)
