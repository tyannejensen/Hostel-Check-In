import { Document, ObjectId } from "mongoose"
import { IPhoneNumber } from "@/lib/types/interfaces/phone-number.interface"
import { IPaymentMethod } from "@/lib/types/interfaces/payment-method.interface"
import { IChangeLog } from "@/lib/types/interfaces/change-log.interface"
import { IRole } from "@/lib/types/index"

// Interfaces for User Schema
export interface IUser extends Document {
	_id: string // string in UUID v4 format - example: 123e4567-e89b-12d3-a456-426614174000
	firstName: string
	lastName: string
	fullname?: string
	email: string
	phoneNumbers: IPhoneNumber[] // reference to PhoneNumber Subdocument
	password: string
	role: IRole
	bookings: ObjectId[] // reference to Booking Schema
	paymentMethods: IPaymentMethod[] // reference to PaymentMethod Subdocument
	createdAt?: Date
	updatedAt?: Date
	tags: string[]
	history: IChangeLog[] // reference to ChangeLog Subdocument
	createdBy?: string // reference to the user (employee) who created the user - uses uuid v4
	updatedBy?: string // reference to the user (employee) who updated the user - uses uuid v4
}
