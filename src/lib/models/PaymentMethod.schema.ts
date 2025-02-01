import { Schema } from "mongoose"
import { IPaymentMethod } from "../types/interfaces/payment-method.interface"

// PaymentMethod Schema - subdocument of Booking Schema
export const paymentMethodSchema = new Schema<IPaymentMethod>(
	{
		isPrimary: {
			type: Boolean,
			required: [true, "Primary payment method indicator is required"],
		},
		method: {
			type: String,
			required: [true, "Payment method is required"],
			enum: {
				values: ["cash", "credit", "debit", "bank", "money order", "check"],
				message: "{VALUE} is not a valid payment method",
			},
		},
		cardHolderName: {
			type: String,
			minlength: [2, "Card Holder Name must be at least 2 characters long"],
			maxlength: [50, "Card Holder Name must be at most 50 characters long"],
			match: [
				/^[A-Za-zÀ-ÖØ-öø-ÿ'\-]{2,50}$/,
				"Card Holder Name contains invalid characters",
			],
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
		timestamps: true, // Add createdAt and updatedAt fields
	}
)
