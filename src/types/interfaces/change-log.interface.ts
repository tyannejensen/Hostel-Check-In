import { ObjectId, Document } from "mongoose"

// Interfaces for Subdocument - Change Log Schema
export interface IChangeLog extends Document {
	_id: ObjectId
	field: string
	oldValue: any
	newValue: any
	updatedAt: Date
	updatedBy: string // reference to the user (employee) who updated the booking - uses uuid v4
}
