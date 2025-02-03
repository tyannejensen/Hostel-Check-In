import { Document } from "mongoose"

export interface _doc extends Document {
	_doc: {
		[key: string]: any // Define it as a generic object
	}
}
