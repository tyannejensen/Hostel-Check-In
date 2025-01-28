import { Schema, ObjectId, Document } from "mongoose"

export interface INote extends Document {
	content: string
	createdAt: Date
	createdBy: string // reference to the user (employee) who created the note - uses uuid v4
}

// Note Schema - subdocument of Booking Schema
export const noteSchema = new Schema<INote>(
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
