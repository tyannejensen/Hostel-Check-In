import { Document, ObjectId } from "mongoose"
import { IChangeLog, IPayment, INote } from "@/interfaces/index"
import { IBookingStatus } from "@/mytypes/index"

// Interfaces for Booking Schema
export interface IBooking extends Document {
	_id: ObjectId
	bookedBy: string // reference to the user (tenant) who made the booking - uses uuid v4
	createdBy: string // reference to the user (employee) who created the booking - uses uuid v4
	roomId: ObjectId
	checkIn: Date
	checkOut: Date
	status: IBookingStatus
	depositAmount: number
	depositReturned: boolean
	depositReturnedDate?: Date
	depositReturnAmount?: number
	payments: IPayment[] // reference to the payment(s) made for the booking
	totalPayment?: number
	notes?: INote[]
	history?: IChangeLog[]
}
