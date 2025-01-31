import { Document, ObjectId } from "mongoose"

export interface IPhoneNumber extends Document {
	_id: ObjectId
	countryCode: string
	number: string
	isMobile: boolean
	isPrimary: boolean
}
