import { Document } from "mongoose"

export interface ILog extends Document {
	field: string
	oldValue: any
	newValue: any
}
