import { Schema, model, ObjectId, Document, models } from "mongoose"
import { IPaymentType } from "./User"
import { v4 as uuidv4 } from "uuid"

type IBookingStatus = "paid" | "pending" | "due"

export interface INote {
	content: string
	createdAt: Date
	createdBy: string // reference to the user (employee) who created the note - uses uuid v4
}

export interface IPayment {
	_id: ObjectId
	amount: number
	paymentMethod: IPaymentType
	createdAt: Date
	createdBy: string // reference to the user (employee) who created the payment - uses uuid v4
}

export interface IBooking extends Document {
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
	history: ObjectId[] // reference to BookingHistory Schema
}

// Note Schema - subdocument of Booking Schema
const noteSchema = new Schema<INote>(
	{
		content: {
			type: String,
			required: [true, "Note is required"],
			minLength: [5, "Note must be at least 5 characters long"],
			maxLength: [1000, "Note must not exceed 1000 characters"],
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		createdBy: {
			ref: "User",
			type: String, // reference to the user (employee) who created the note - uses uuid v4
			required: [true, "Employee ID is required"],
		},
	},
	{ versionKey: false } // Disable versioning (__v) field to prevent notes from being updated
)

// Notes Pre Save Hook -> Middleware to enforce immutability of notes
noteSchema.pre("save", function (next) {
	if (this.isNew) {
		// If the note is new, allow it to save
		return next()
	}

	// Prevent updating the note if it already exists
	this.invalidate("content", "Notes cannot be modified after creation")
	next(new Error("Notes are immutable once created"))
})

// TODO: Define BookingHistory Schema
// TODO: Complete the Booking Schema - add validation, default values, and required fields

const bookingSchema = new Schema<IBooking>({
	bookedBy: {
		type: String,
		required: [true, "Tenant ID is required"],
	},
	createdBy: {
		type: String,
		required: [true, "Employee ID is required"],
	},
	roomId: {
		type: Schema.Types.ObjectId,
		ref: "Room",
		required: [true, "Room ID is required"],
	},
	checkIn: {
		type: Date,
		required: [true, "Check-in date is required"],
	},
	checkOut: {
		type: Date,
		required: [true, "Check-out date is required"],
	},
	status: {
		type: String,
		enum: ["paid", "pending", "due"],
		default: "pending",
	},
	DepositAmount: {
		type: Number,
		required: [true, "Deposit amount is required"],
	},
	depositReturned: {
		type: Boolean,
		default: false,
	},
	depositReturnDate: {
		type: Date,
	},
	depositReturnAmount: {
		type: Number,
	},
	payments: [
		{
			_id: {
				type: String,
				default: uuidv4,
			},
		},
	],
	Notes: [noteSchema],
	history: [
		{
			type: Schema.Types.ObjectId,
			ref: "BookingHistory",
		},
	],
})
