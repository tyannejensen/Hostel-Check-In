import { Schema } from "mongoose"
import { INote } from "@/interfaces/note.interface"
import { formatDate } from "@/server-utils/helpers"

// Note Schema - subdocument of Booking Schema
export const NoteSchema = new Schema<INote>(
	{
		content: {
			type: String,
			required: [true, "Note is required"],
			minLength: [5, "Note must be at least 5 characters long"],
			maxLength: [1000, "Note must not exceed 1000 characters"],
		},
		createdBy: {
			type: String, // reference to the user (employee) who created the note - uses uuid v4
			ref: "User",
			required: [true, "Employee ID is required"],
		},
	},
	{ versionKey: false, timestamps: true } // Disable versioning (__v) field to prevent notes from being updated
)

// MIDDLEWARE
// Notes Pre Save Hook -> Middleware to enforce immutability of notes
NoteSchema.pre("save", function (next) {
	if (this.isNew) return next() // If the note is new, allow it to save
	if (!this.isModified()) return next() // If the note is not modified, allow it to save

	// Prevent updating the note if it already exists
	this.invalidate("content", "Notes cannot be modified after creation")
	next(new Error("Notes are immutable once created"))
})

// GETTERS
// Convert the 'createdAt' and 'updatedAt' fields to MMM DD, YYYY format e.g. Jan 30, 2025
NoteSchema.path("createdAt").get(formatDate)
NoteSchema.path("updatedAt").get(formatDate)

// SETTERS
// Set toObject options to exclude _id and password fields automatically
NoteSchema.set("toObject", {
	getters: true,
	virtuals: true,
	transform: function (doc, ret) {
		delete ret._id // Exclude _id field
	},
})

// Set toJSON options to exclude _id and password fields automatically
NoteSchema.set("toJSON", {
	virtuals: true,
	getters: true,
	transform: function (doc, ret) {
		if (ret.createdBy && ret.createdBy.fullname) {
			ret.createdBy = ret.createdBy.fullname // Transform createdBy to fullname
		}
		delete ret._id // Exclude _id field
	},
})

// VIRTUALS
// None
