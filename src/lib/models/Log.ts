import { Schema, Document, ObjectId } from "mongoose"
import { IBooking } from "./Booking"

export interface IChangeLog extends Document {
	_id: ObjectId
	field: string
	oldValue: any
	newValue: any
	updatedAt: Date
	updatedBy: string // reference to the user (employee) who updated the booking - uses uuid v4
}

// Change Log Schema - subdocument of Booking Schema
export const changeLogSchema = new Schema<IChangeLog>(
	{
		field: {
			type: String,
			required: [true, "Field is required"],
		},
		oldValue: {
			type: Schema.Types.Mixed,
			required: [true, "Old value is required"],
		},
		newValue: {
			type: Schema.Types.Mixed,
			required: [true, "New value is required"],
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
		updatedBy: {
			ref: "User",
			type: String, // reference to the user (employee) who updated the booking - uses uuid v4
			required: [true, "Employee ID is required"],
		},
	},
	{ versionKey: false } // Disable versioning (__v) field to prevent Booking Updates from being updated
)

// Booking Update Pre Save Hook -> Middleware to enforce immutability of notes
changeLogSchema.pre<IBooking>("save", function (next) {
	if (this.isNew) {
		// If the Log is new, allow it to save
		return next()
	}

	// Prevent updating the note if it already exists
	this.invalidate("content", "A Booking Log cannot be modified after creation")
	next(new Error("Booking Logs are immutable once created"))
})
