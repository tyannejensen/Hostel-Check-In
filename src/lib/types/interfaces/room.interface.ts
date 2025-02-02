import { Document, ObjectId } from "mongoose"
import { IRoomStatus, IRoomType } from "@/mytypes/index"

// Interfaces for Room Schema
export interface IRoom extends Document {
	_id: ObjectId
	type: IRoomType
	roomNumber: number | string
	status: IRoomStatus
	deposit: number
	name?: string
	size: number
	occupants: string[] // reference to the tenent(s) who are staying in the room - uses uuid v4
}
