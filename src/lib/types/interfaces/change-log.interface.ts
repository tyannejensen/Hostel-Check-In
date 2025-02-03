import { ObjectId, Document } from "mongoose"
import { ILog } from "@/interfaces/log.interface"

// Interfaces for Subdocument - Change Log Schema
export interface IChangeLog extends Document {
	_id: ObjectId
	updates: ILog[]
	updatedAt: Date
	updatedBy: string // reference to the user (employee) who updated the booking - uses uuid v4
}
