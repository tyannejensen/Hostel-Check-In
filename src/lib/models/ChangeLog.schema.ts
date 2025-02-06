import { Schema } from "mongoose"
import { IChangeLog, ILog } from "@/interfaces/index"
import { LogSchema } from "@/models/Log.schema"
import { formatDate } from "@/server-utils/helpers"

// Change Log Schema - subdocument of Booking Schema
export const ChangeLogSchema = new Schema<IChangeLog>(
	{
		updates: {
			type: [LogSchema],
			required: [true, "Updates are required"],
			validate: {
				validator: (v: ILog[]) => v.length > 0,
				message: "At least one update is required",
			},
		},
		updatedAt: {
			type: Date,
			default: new Date(),
		},
		updatedBy: {
			ref: "User",
			type: String, // reference to the user (employee) who updated the booking - uses uuid v4
			required: [true, "Employee ID is required"],
		},
	},
	{ versionKey: false, timestamps: false } // Disable versioning (__v) field to prevent Booking Updates from being updated
)

// MIDDLEWARE
// Booking Update Pre Save Hook -> Middleware to enforce immutability of notes
ChangeLogSchema.pre<IChangeLog>("save", function (next) {
	if (this.isNew || !this.isModified()) {
		// If the Log is new, allow it to save
		return next()
	}

	// Prevent updating the note if it already exists
	next(new Error("ChangeLogs are immutable once created"))
})

// GETTERS
ChangeLogSchema.path("updatedAt").get(formatDate)

// SETTERS

ChangeLogSchema.set("toObject", {
	getters: true,
	virtuals: true,
	transform: function (doc, ret) {
		delete ret._id // Exclude _id field
		delete ret.__v // Exclude __v (version) field
	},
})

// Set toJSON options to exclude _id and password fields automatically
ChangeLogSchema.set("toJSON", {
	virtuals: true,
	getters: true,
	transform: function (doc, ret) {
		delete ret._id // Exclude _id field
		delete ret.__v // Exclude __v (version) field
	},
})
