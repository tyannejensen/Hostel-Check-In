import { Schema } from "mongoose"
import { IBooking } from "@/mytypes/interfaces/booking.interface"
import { IChangeLog } from "@/mytypes/interfaces/change-log.interface"

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
	{ versionKey: false, timestamps: true } // Disable versioning (__v) field to prevent Booking Updates from being updated
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
