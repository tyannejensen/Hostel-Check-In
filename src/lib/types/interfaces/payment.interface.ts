import { Document, ObjectId } from "mongoose"
import { IPaymentDetails } from "@/interfaces/payment-details.interface"
import { IPaymentMethod } from "./payment-method.interface"

// Interfaces for Payment Schema
export interface IPayment extends IPaymentDetails, Document {
	_id: ObjectId
	bookingId: ObjectId // reference to the booking the payment is associated with
	amount: number
	paidBy: string // reference to the user (tenant) who made the payment - uses uuid v4
	paymentMethod: IPaymentMethod
	createdAt: Date
	createdBy: string // reference to the user (employee) who created the payment - uses uuid v4
}
