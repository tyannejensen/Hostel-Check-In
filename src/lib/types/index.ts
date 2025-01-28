import { Document, ObjectId } from "mongoose"

// Custom types for interfaces and schemas
type IRoomType = "shared" | "single" | "double" | "suite"
type IRoomStatus = "available" | "occupied" | "maintenance" | "cleaning"
type IRole = "admin" | "employee" | "tenant"
type IBookingStatus = "paid" | "pending" | "due"
type IPaymentType =
	| "cash"
	| "credit"
	| "debit"
	| "bank"
	| "money order"
	| "check"

// Interfaces for Schemas
export interface IPhoneNumber extends Document {
	_id: ObjectId
	countryCode: string
	number: string
	isMobile: boolean
	isPrimary: boolean
}

// Bases of IPayment and IPaymentMethod
export interface IPaymentDetails {
	method: IPaymentType
	cardHolderName?: string
	cardNumber?: string
	expirationDate?: Date
	cvv?: string
	routingNumber?: string
	accountNumber?: string
	bankName?: string
}

// Interfaces for Payment Schema
export interface IPayment extends IPaymentDetails, Document {
	_id: ObjectId
	bookingId: ObjectId // reference to the booking the payment is associated with
	amount: number
	paidBy: string // reference to the user (tenant) who made the payment - uses uuid v4
	createdAt: Date
	createdBy: string // reference to the user (employee) who created the payment - uses uuid v4
}

// Interfaces for Payment Method Subdocument
export interface IPaymentMethod extends IPaymentDetails {
	isPrimary: boolean
	paymentName?: string
}

// Interfaces for Room Schema
export interface IRoom extends Document {
	_id: ObjectId
	type: IRoomType
	roomNumber: number | string
	status: IRoomStatus
	bookedBy: string // reference to the user (tenant) who made the booking - uses uuid v4
	name?: string
	occupants?: number
}

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

// Interfaces for Subdocument - Note Schema
export interface INote extends Document {
	_id: ObjectId
	content: string
	createdAt: Date
	createdBy: string // reference to the user (employee) who created the note - uses uuid v4
}

// Interfaces for Booking Schema
export interface IBooking extends Document {
	_id: ObjectId
	bookedBy: string // reference to the user (tenant) who made the booking - uses uuid v4
	createdBy: string // reference to the user (employee) who created the booking - uses uuid v4
	roomId: ObjectId
	checkIn: Date
	checkOut: Date
	status: IBookingStatus
	DepositAmount: number
	depositReturned: boolean
	depositReturnDate?: Date
	depositReturnAmount?: number
	payments: IPayment[]
	totalPayment?: number
	Notes?: INote[]
	history?: IChangeLog[]
}

// Interfaces for Subdocument - Change Log Schema
export interface IChangeLog extends Document {
	_id: ObjectId
	field: string
	oldValue: any
	newValue: any
	updatedAt: Date
	updatedBy: string // reference to the user (employee) who updated the booking - uses uuid v4
}
