import { Document, ObjectId } from "mongoose"
import { IRoomStatus, IRoomType } from "@/lib/types/index"

// Interfaces for Room Schema
export interface IRoom extends Document {
	_id: ObjectId
	type: IRoomType
	roomNumber: number | string
	status: IRoomStatus
	deposit: number
	bookedBy: string // reference to the user (tenant) who made the booking - uses uuid v4
	name?: string
	occupants?: number
}
