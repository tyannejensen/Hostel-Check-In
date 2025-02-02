import { Schema, model, models } from "mongoose"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"
import { IUser } from "@/interfaces/user.interface"
import { ChangeLogSchema } from "@/models/Log.schema"
import { phoneNumberSchema } from "@/models/PhoneNumber.schema"
import { PaymentMethodSchema } from "@/models/PaymentMethod.schema"
import { formatDate, getOldDoc, logChanges } from "@/server-utils/helpers"
import { IPaymentMethod } from "../types/interfaces/payment-method.interface"

// User Schema
const UserSchema = new Schema<IUser>(
	{
		_id: {
			type: String,
			default: uuidv4,
		},
		firstName: {
			type: String,
			required: [true, "First name is required"],
			minlength: [2, "First name must be at least 2 characters long"],
			maxlength: [50, "First name must be at most 50 characters long"],
			trim: true,
			set: (v: string) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(), // Capitalize firstName
			match: [
				/^[A-Za-zÀ-ÖØ-öø-ÿ'\-]{2,50}$/,
				"First name contains invalid characters",
			],
		},
		lastName: {
			type: String,
			required: [true, "Last name is required"],
			minlength: [2, "Last name must be at least 2 characters long"],
			maxlength: [50, "Last name must be at most 50 characters long"],
			trim: true,
			set: (v: string) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(), // Capitalize lastName
			match: [
				/^[A-Za-zÀ-ÖØ-öø-ÿ'\-]{2,50}$/,
				"Last name contains invalid characters",
			],
		},
		fullname: {
			type: String,
			default: function (this: IUser): string {
				return `${this.firstName} ${this.lastName}`
			},
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			match: [
				/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
				"Email is invalid",
			],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			select: false,
		},
		phoneNumbers: [phoneNumberSchema],
		role: {
			type: String,
			required: [true, "Role is required"],
			enum: {
				values: ["admin", "employee", "tenant"],
				message: "{VALUE} is not a valid role",
			},
		},
		bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
		paymentMethods: {
			type: [PaymentMethodSchema],
			validate: {
				validator: function (paymentMethods: IPaymentMethod[]) {
					// If role is Tenant, paymentMethods must not be empty
					if (
						this.role === "tenant" &&
						(!paymentMethods || paymentMethods.length === 0)
					) {
						return false // Validation fails
					}
					return true // Validation passes
				},
				message: "Tenants must have at least one payment method.",
			},
			default: [], // Default to empty array
		},
		tags: [
			{
				type: String,
				lowercase: true,
				min_length: [2, "Tag must be at least 2 characters long"],
				max_length: [20, "Tag must be at most 20 characters"],
				set: (v: string) => v.split(" ").join("-"), // Replace spaces with hyphens
				trim: true,
				validate: {
					// Checks the input for only letters, hyphens, and underscores
					validator: function (value) {
						return /^[A-Za-z\-_]+$/.test(value)
					},
					message: (props) =>
						`${props.value} contains invalid characters. Only letters, hyphens, and underscores are allowed.`,
				},
			},
		],
		history: [ChangeLogSchema],
		createdBy: {
			type: String,
			ref: "User",
			// get: function (createdBy: IUser) { // Return only the fullname of the createdBy user
			// 	// Here, you return the fullName instead of the entire user object
			// 	return createdBy ? createdBy.fullname : null
			// },
		},
		updatedBy: {
			type: String,
			ref: "User",
		},
	},
	{
		timestamps: true, // Add createdAt and updatedAt fields
	}
)

// MIDDLWARE
// Capture and save the old Booking document before updating - Part 1 of 2 of logging the booking history
UserSchema.pre("findOneAndUpdate", getOldDoc) // IMPORTANT: Use findOneAndUpdate as the standard unless you have a good reason not to
UserSchema.pre("updateOne", getOldDoc)
UserSchema.pre("replaceOne", getOldDoc)
// DO NOT USE findByIdAndUpdate as it does not trigger the pre hook

// Capture and save the old Booking document before updating - Part 2 of 2 of logging the booking history
UserSchema.post("findOneAndUpdate", logChanges) // IMPORTANT: Use findOneAndUpdate as the standard unless you have a good reason not to
UserSchema.post("updateOne", logChanges)
UserSchema.post("replaceOne", logChanges)
// DO NOT USE findByIdAndUpdate as it does not trigger the post hook

// MIDDLEWARE
// Pre-save hook to hash password
UserSchema.pre<IUser>("save", async function (next) {
	if (this.isNew || this.isModified("password")) {
		const saltRounds = 10
		this.password = await bcrypt.hash(this.password, saltRounds)
	}
	next()
})

// METHODS
// Check if the password is correct
UserSchema.methods.isCorrectPassword = async function (
	password: string
): Promise<boolean> {
	return bcrypt.compare(password, this.password)
}

// GETTERS
// Convert the 'createdAt' field to MMM DD, YYYY format e.g. Jan 30, 2025
UserSchema.path("createdAt").get(formatDate)
UserSchema.path("updatedAt").get(formatDate)

// SETTERS
// Set toObject options to exclude _id and password fields automatically
UserSchema.set("toObject", {
	getters: true,
	virtuals: true,
	transform: function (doc, ret) {
		delete ret._id // Exclude _id field
		delete ret.password // Exclude password field
	},
})

// Set toJSON options to exclude _id and password fields automatically
UserSchema.set("toJSON", {
	virtuals: true,
	getters: true,
	transform: function (doc, ret) {
		delete ret._id // Exclude _id field
		delete ret.password // Exclude password field
	},
})

// VIRTUALS
// None

export const User = models.User || model<IUser>("User", UserSchema)
