import { Document, ObjectId } from "mongoose"

// Interfaces for Subdocument - Note Schema
export interface INote extends Document {
	_id: ObjectId
	content: string
	createdAt: Date
	createdBy: string // reference to the user (employee) who created the note - uses uuid v4
}
