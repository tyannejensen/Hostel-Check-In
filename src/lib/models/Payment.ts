import { Schema, model, ObjectId, Document, models } from "mongoose"
import { IPaymentDetails } from "./User"

// Custom interfaces for Payment Schema
export interface IPayment extends IPaymentDetails {
	_id: ObjectId
	bookingId: ObjectId // reference to the booking the payment is associated with
	amount: number
	paidBy: string // reference to the user (tenant) who made the payment - uses uuid v4
	createdAt: Date
	createdBy: string // reference to the user (employee) who created the payment - uses uuid v4
}

// Payment Schema - subdocument of Booking Schema
const paymentSchema = new Schema<IPayment>(
	{},
	{ versionKey: false } // Disable versioning (__v) field to prevent Payment from being updated
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
