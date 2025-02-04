import { Schema } from "mongoose"
import { ILog } from "@/interfaces/index"

// Log Schema - subdocument of ChangeLog Schema
export const LogSchema = new Schema<ILog>(
	{
		field: {
			type: String,
			required: [true, "Field is required"],
		},
		oldValue: {
			type: Schema.Types.Mixed,
			required: [true, "Old value is required"],
		},
		newValue: {
			type: Schema.Types.Mixed,
			required: [true, "New value is required"],
		},
	},
	{ _id: false, versionKey: false }
)
