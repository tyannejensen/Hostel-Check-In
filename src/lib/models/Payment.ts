import { Schema, model, models } from "mongoose"
import { IPayment } from "@/lib/types"

// Payment Schema - subdocument of Booking Schema
const paymentSchema = new Schema<IPayment>(
	{
		bookingId: {
			type: Schema.Types.ObjectId,
			ref: "Booking",
			required: [true, "Booking ID is required"],
		},
		amount: {
			type: Number,
			required: [true, "Payment amount is required"],
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
		method: {
			type: String,
			enum: ["cash", "credit", "debit", "bank", "money order", "check"],
			required: [true, "Payment method is required"],
		},
		cardHolderName: {
			type: String,
			minlength: [2, "Card Holder Name must be at least 2 characters long"],
			maxlength: [50, "Card Holder Name must be at most 50 characters long"],
		},
		cardNumber: {
			type: String,
			minlength: [15, "Card Number must be at least 15 characters long"],
			maxlength: [16, "Card Number must be at most 16 characters long"],
		},
		expirationDate: {
			type: Date,
			validate: {
				validator: (v: Date) => v > new Date(),
				message: (props) => `${props.value} is not a valid expiration date`,
			},
		},
		cvv: {
			type: String,
			minlength: [3, "CVV must be at least 3 characters long"],
			maxlength: [4, "CVV must be at most 4 characters long"],
		},
		routingNumber: {
			type: String,
			minlength: [9, "Routing Number must be 9 characters long"],
			maxlength: [9, "Routing Number must be 9 characters long"],
		},
		accountNumber: {
			type: String,
			minlength: [10, "Account Number must be at least 10 characters long"],
			maxlength: [12, "Account Number must be at most 12 characters long"],
		},
		bankName: {
			type: String,
			minlength: [2, "Bank Name must be at least 2 characters long"],
			maxlength: [50, "Bank Name must be at most 50 characters long"],
		},
	},
	{
		versionKey: false, // Disable versioning (__v) field to prevent Payment from being updated
		timestamps: true, // Add createdAt and updatedAt fields
	}
)

// Notes Pre Save Hook -> Middleware to enforce immutability of notes
paymentSchema.pre("save", function (next) {
	if (this.isNew) {
		// If the Payment is new, allow it to save
		return next()
	}

	// Prevent updating the note if it already exists
	this.invalidate("content", "A Payment cannot be modified after creation")
	next(new Error("Payments are immutable once created"))
})

export const Payment =
	models.Payment || model<IPayment>("Payment", paymentSchema)
