import { Schema } from "mongoose"
import { IBillingAddress } from "../types/interfaces"
import { formatDate } from "@/server-utils/helpers"

export const BillingAddressSchema = new Schema<IBillingAddress>(
	{
		addressLineOne: {
			type: String,
			required: true,
			min_length: [5, "Address Line 1 must be at least 5 characters long"],
			max_length: [50, "Address Line 1 must not surpass 50 characters long"],
			trim: true,
		},
		addressLineTwo: {
			type: String,
			min_length: [5, "Address Line 2 must be at least 5 characters long"],
			max_length: [50, "Address Line 2 must not surpass 50 characters long"],
			trim: true,
		},
		city: {
			type: String,
			required: true,
			min_length: [3, "City must be at least 3 characters long"],
			max_length: [50, "City must not surpass 50 characters long"],
			trim: true,
		},
		postalCode: {
			type: String,
			required: true,
			min_length: [5, "Postal code must be 5 digits"],
			max_length: [5, "Postal code must be 5 digits"],
			trim: true,
			validate: {
				validator: function (v: string) {
					return /\d{5}/.test(v)
				},
				message: "{VALUE} is not a valid Postal code!",
			},
		},
		state: {
			type: String,
			enum: {
				values: [
					"AL",
					"AK",
					"AZ",
					"AR",
					"CA",
					"CO",
					"CT",
					"DE",
					"FL",
					"GA",
					"HI",
					"ID",
					"IL",
					"IN",
					"IA",
					"KS",
					"KY",
					"LA",
					"ME",
					"MD",
					"MA",
					"MI",
					"MN",
					"MS",
					"MO",
					"MT",
					"NE",
					"NV",
					"NH",
					"NJ",
					"NM",
					"NY",
					"NC",
					"ND",
					"OH",
					"OK",
					"OR",
					"PA",
					"RI",
					"SC",
					"SD",
					"TN",
					"TX",
					"UT",
					"VT",
					"VA",
					"WA",
					"WV",
				],
				message: "{VALUE} is not a valid role",
			},
			required: true,
		},
		country: {
			type: String,
			required: true,
			default: "USA",
			min_length: [3, "Country must be at least 3 characters long"],
			max_length: [25, "Country must not surpass 50 characters long"],
			trim: true,
		},
	},
	{
		timestamps: true,
		_id: false,
	}
)

// GETTERS
// Convert the 'createdAt' and 'updatedAt' fields to MMM DD, YYYY format e.g. Jan 30, 2025
BillingAddressSchema.path("createdAt").get(formatDate)
BillingAddressSchema.path("updatedAt").get(formatDate)
