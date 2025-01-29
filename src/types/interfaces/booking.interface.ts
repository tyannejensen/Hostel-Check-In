import { Document, ObjectId } from "mongoose"
import { IChangeLog } from "@/interfaces/changeLog.interface"
import { IPayment } from "@/interfaces/payment.interface"
import { IBookingStatus } from "@/mytypes/index"
import { INote } from "@/interfaces/note.interface"

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
