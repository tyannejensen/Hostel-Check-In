import { Document, ObjectId } from "mongoose"
import { IPhoneNumber } from "@/interfaces/phoneNumber.interface"
import { IPaymentMethod } from "@/interfaces/paymentMethod.interface"
import { IChangeLog } from "@/interfaces/changeLog.interface"
import { IRole } from "@/mytypes/index"

// Interfaces for User Schema
export interface IUser extends Document {
	_id: string // string in UUID v4 format - example: 123e4567-e89b-12d3-a456-426614174000
	firstName: string
	lastName: string
	fullname?: string
	email: string
	phoneNumber: IPhoneNumber[] // reference to PhoneNumber Subdocument
	password: string
	role: IRole
	transactions: ObjectId[] // reference to Transaction Schema
	paymentMethod: IPaymentMethod[] // reference to PaymentMethod Subdocument
	createdAt?: Date
	updatedAt?: Date
	tags: string[]
	history: IChangeLog[] // reference to ChangeLog Subdocument
	createdBy?: string // reference to the user (employee) who created the user - uses uuid v4
	updatedBy?: string // reference to the user (employee) who updated the user - uses uuid v4
}
