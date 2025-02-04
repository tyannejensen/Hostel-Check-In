import { Schema, model, models } from "mongoose"
import { IPaymentMethod } from "@/interfaces/index"
import {
	formatDate,
	getOldDoc,
	logChanges,
	// logHistory,
} from "@/server-utils/helpers"

// PaymentMethod Schema - subdocument of Booking Schema
const PaymentMethodSchema = new Schema<IPaymentMethod>(
	{
		userId: {
			type: String,
			required: [true, "User ID is required"],
			ref: "User",
		},
		isPrimary: {
			type: Boolean,
			required: [true, "Primary payment method indicator is required"],
			default: false,
		},
		cardBrand: {
			type: String,
			enum: {
				values: ["Visa", "Mastercard", "Amex", "Discover"],
				message: "{VALUE} is not a valid card brand",
			},
		},
		method: {
			type: String,
			required: [true, "Payment method is required"],
			enum: {
				values: ["cash", "credit", "debit", "bank", "money order", "check"],
				message: "{VALUE} is not a valid payment method",
			},
		},
		cardNumberLastFour: {
			type: String,
			minlength: [4, "Card Number must be at least 4 characters long"],
			maxlength: [4, "Card Number must be at most 4 characters long"],
		},
		expirationDate: {
			type: Date,
			validate: {
				validator: (v: Date) => v > new Date(),
				message: (props) => `${props.value} is not a valid expiration date`,
			},
		},
		routingNumber: {
			type: String,
			minlength: [9, "Routing Number must be 9 characters long"],
			maxlength: [9, "Routing Number must be 9 characters long"],
		},
		accountNumber: {
			type: String,
			minlength: [8, "Account Number must be at least 8 characters long"],
			maxlength: [20, "Account Number must be at most 20 characters long"],
		},
		bankName: {
			type: String,
			minlength: [2, "Bank Name must be at least 2 characters long"],
			maxlength: [50, "Bank Name must be at most 50 characters long"],
		},
	},
	{
		timestamps: true, // Add createdAt and updatedAt fields
	}
)

// MIDDLWARE

// Record document updates in the history array
// Capture and save the old Booking document before updating - Part 1 of 2 of logging the booking history
PaymentMethodSchema.pre("findOneAndUpdate", getOldDoc)
// Capture and save the old Booking document before updating - Part 2 of 2 of logging the booking history
PaymentMethodSchema.post("findOneAndUpdate", logChanges)

// PaymentMethodSchema.pre("save", logHistory)

// GETTERS
// Convert the 'createdAt' field to MMM DD, YYYY format e.g. Jan 30, 2025
PaymentMethodSchema.path("createdAt").get(formatDate)
PaymentMethodSchema.path("updatedAt").get(formatDate)
PaymentMethodSchema.path("expirationDate").get(formatDate)

// SETTERS
// Set toObject options to exclude _id and password fields automatically
PaymentMethodSchema.set("toObject", {
	getters: true,
	virtuals: true,
	transform: function (doc, ret) {
		delete ret.__v // Exclude __v (version) field
		delete ret._id // Exclude _id field
	},
})

// Set toJSON options to exclude _id and password fields automatically
PaymentMethodSchema.set("toJSON", {
	virtuals: true,
	getters: true,
	transform: function (doc, ret) {
		delete ret.__v // Exclude __v (version) field
		delete ret._id // Exclude _id field
	},
})

// Compile and export the PaymentMethod model
export const PaymentMethod =
	models.PaymentMethod ||
	model<IPaymentMethod>("PaymentMethod", PaymentMethodSchema)
