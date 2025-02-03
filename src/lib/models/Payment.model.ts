import { Schema, model, models } from "mongoose"
import { IPayment } from "@/interfaces/payment.interface"
import { PaymentMethodSchema } from "@/models/PaymentMethod.schema"
import { formatDate } from "@/server-utils/helpers"

// Payment Schema - subdocument of Booking Schema
const PaymentSchema = new Schema<IPayment>(
	{
		bookingId: {
			type: Schema.Types.ObjectId,
			ref: "Booking",
			required: [true, "Booking ID is required"],
		},
		amount: {
			type: Number,
			required: [true, "Payment amount is required"],
			get: (v: number) => v / 100, // Convert deposit amount to cents
			set: (v: number) => v * 100, // Convert deposit amount to dollars
		},
		paidBy: {
			type: String,
			required: [true, "Payer ID is required"],
			ref: "User",
		},
		createdBy: {
			type: String,
			required: [true, "Employee ID is required"],
			ref: "User",
		},
		paymentMethod: {
			type: PaymentMethodSchema,
			required: [true, "Payment method is required"],
		},
	},
	{
		versionKey: false, // Disable versioning (__v) field to prevent Payment from being updated
		timestamps: true, // Add createdAt and updatedAt fields
	}
)

// MIDDLEWARE
// Notes Pre Save Hook -> Middleware to enforce immutability of notes
PaymentSchema.pre("save", function (next) {
	if (this.isNew) {
		// If the Payment is new, allow it to save
		return next()
	}

	// Prevent updating the note if it already exists
	this.invalidate("content", "A Payment cannot be modified after creation")
	next(new Error("Payments are immutable once created"))
})

// GETTERS
// Convert the 'createdAt' and 'updatedAt' fields to MMM DD, YYYY format e.g. Jan 30, 2025
PaymentSchema.path("createdAt").get(formatDate)
PaymentSchema.path("updatedAt").get(formatDate)

// SETTERS
// Set toObject options to exclude _id and password fields automatically
PaymentSchema.set("toObject", {
	getters: true,
	virtuals: true,
	transform: function (doc, ret) {
		delete ret._id // Exclude _id field
	},
})

// Set toJSON options to exclude _id and password fields automatically
PaymentSchema.set("toJSON", {
	virtuals: true,
	getters: true,
	transform: function (doc, ret) {
		delete ret._id // Exclude _id field
	},
})

// VIRTUALS
// None

// Export Payment model
export const Payment =
	models.Payment || model<IPayment>("Payment", PaymentSchema)
