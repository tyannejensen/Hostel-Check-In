import { Document, ObjectId } from "mongoose"
import { IRoomStatus, IRoomType } from "@/mytypes/index"

// Interfaces for Room Schema
export interface IRoom extends Document {
	_id: ObjectId
	roomType: IRoomType
	roomNumber: number | string
	status: IRoomStatus
	costPerDay: number
	deposit: number
	name?: string // TODO: update to roomName on interface, model, and in use on the front-end.
	size: number
	occupants: string[] // reference to the tenent(s) who are staying in the room - uses uuid v4
}
