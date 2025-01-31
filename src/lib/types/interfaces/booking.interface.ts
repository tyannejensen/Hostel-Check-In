import { Document, ObjectId } from "mongoose"
import { IChangeLog } from "@/lib/types/interfaces/change-log.interface"
import { IPayment } from "@/lib/types/interfaces/payment.interface"
import { IBookingStatus } from "@/lib/types/index"
import { INote } from "@/lib/types/interfaces/note.interface"

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
	payments: IPayment[]
	totalPayment?: number
	Notes?: INote[]
	history?: IChangeLog[]
}
