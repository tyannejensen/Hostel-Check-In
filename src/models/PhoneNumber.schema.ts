import { Schema, Document } from "mongoose"
import { IPhoneNumber } from "../types"

export const phoneNumberSchema = new Schema<IPhoneNumber>(
	{
		countryCode: {
			type: String,
			required: [true, "Country code is required"],
			default: "+1",
		},
		number: {
			type: String,
			required: [true, "Phone number is required"],
			unique: [true, "Phone number already exists"],
			validate: {
				// custom validator requiring number to be in the format 123-456-7890
				validator: (v: string) => /\d{3}-\d{3}-\d{4}/.test(v),
				message: (props) => `${props.value} is not a valid phone number`,
			},
		},
		isMobile: {
			type: Boolean,
			required: [true, "Phone type is required"],
			default: true,
		},
		isPrimary: {
			type: Boolean,
			required: [true, "Primary phone indicator is required"],
		},
	},
	{ _id: false }
)
