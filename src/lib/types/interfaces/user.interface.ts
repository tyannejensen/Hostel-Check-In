import { Document, ObjectId } from "mongoose"
import {
	IBillingAddress,
	IPhoneNumber,
	IPaymentMethod,
	IChangeLog,
	INote,
} from "@/interfaces/index"
import { IRole } from "@/mytypes/index"

// Interfaces for User Schema
export interface IUser extends Document {
	_id: string // string in UUID v4 format - example: 123e4567-e89b-12d3-a456-426614174000
	firstName: string
	lastName: string
	fullname: string
	email: string
	phoneNumbers: IPhoneNumber[] // reference to PhoneNumber Subdocument
	password: string
	birthdate: string
	role: IRole
	bookings: ObjectId[] // reference to Booking Schema
	paymentMethods: IPaymentMethod[] // reference to PaymentMethod Subdocument
	billingAddress?: IBillingAddress
	createdAt?: Date
	updatedAt?: Date
	tags: string[]
	notes: INote[] // reference to Note Subdocument
	history: IChangeLog[] // reference to ChangeLog Subdocument
	createdBy?: string // reference to the user (employee) who created the user - uses uuid v4
	updatedBy?: string // reference to the user (employee) who updated the user - uses uuid v4
}
