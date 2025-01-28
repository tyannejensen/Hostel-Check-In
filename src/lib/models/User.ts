import { Schema, model, ObjectId, Document, models } from "mongoose"
import { IPaymentDetails } from "@/lib/models/Payment"
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"

// Custom types for User Schema
type IRole = "admin" | "employee" | "tenant"

// Interfaces for User Schema
export interface IPhoneNumber extends Document {
	countryCode: string
	number: string
	isMobile: boolean
	isPrimary: boolean
}

export interface IPaymentMethod extends IPaymentDetails {
	isPrimary: boolean
	paymentName?: string
}

export interface IUser extends Document {
	_id: string // string in UUID v4 format - example: 123e4567-e89b-12d3-a456-426614174000
	firstName: string
	lastName: string
	fullname?: string
	email: string
	phoneNumber: IPhoneNumber[]
	password: string
	role: IRole
	transactions: ObjectId[] // reference to Transaction Schema
	paymentMethod: IPaymentMethod[]
	createdAt?: Date
	updatedAt?: Date
	tags: string[]
}

// User Schema
const userSchema = new Schema<IUser>(
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
			lowercase: true,
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
			lowercase: true,
			match: [
				/^[A-Za-zÀ-ÖØ-öø-ÿ'\-]{2,50}$/,
				"Last name contains invalid characters",
			],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			match: [
				/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
				"Email is invalid",
			],
		},
		phoneNumber: [
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
		],
		password: {
			type: String,
			required: [true, "Password is required"],
			select: false,
		},
		role: {
			type: String,
			required: [true, "Role is required"],
			enum: {
				values: ["admin", "employee", "tenant"],
				message: "{VALUE} is not a valid role",
			},
		},
		transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
		paymentMethod: [
			{
				isPrimary: {
					type: Boolean,
					required: [true, "Primary payment method indicator is required"],
				},
				method: {
					type: String,
					required: [true, "Payment method is required"],
					enum: {
						values: ["cash", "credit", "debit", "bank", "money order", "check"],
						message: "{VALUE} is not a valid payment method",
					},
				},
				cardHolderName: {
					type: String,
					minlength: [2, "Card Holder Name must be at least 2 characters long"],
					maxlength: [
						50,
						"Card Holder Name must be at most 50 characters long",
					],
					match: [
						/^[A-Za-zÀ-ÖØ-öø-ÿ'\-]{2,50}$/,
						"Card Holder Name contains invalid characters",
					],
				},
				cardNumber: {
					type: String,
					minlength: [15, "Card Number must be at least 15 characters long"],
					maxlength: [16, "Card Number must be at most 16 characters long"],
				},
				expirationDate: {
					type: Date,
					validate: {
						validator: (v: Date) => v > new Date(),
						message: (props) => `${props.value} is not a valid expiration date`,
					},
				},
				cvv: {
					type: String,
					minlength: [3, "CVV must be at least 3 characters long"],
					maxlength: [4, "CVV must be at most 4 characters long"],
				},
				routingNumber: {
					type: String,
					minlength: [9, "Routing Number must be 9 characters long"],
					maxlength: [9, "Routing Number must be 9 characters long"],
				},
				accountNumber: {
					type: String,
					minlength: [10, "Account Number must be at least 10 characters long"],
					maxlength: [12, "Account Number must be at most 12 characters long"],
				},
				bankName: {
					type: String,
					minlength: [2, "Bank Name must be at least 2 characters long"],
					maxlength: [50, "Bank Name must be at most 50 characters long"],
				},
			},
		],
		tags: [
			{
				type: String,
				lowercase: true,
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
	},
	{
		timestamps: true, // Add createdAt and updatedAt fields
		toJSON: { getters: true },
		toObject: { getters: true },
	}
)

// Pre-save hook to hash password
userSchema.pre<IUser>("save", async function (next) {
	if (this.isNew || this.isModified("password")) {
		const saltRounds = 10
		this.password = await bcrypt.hash(this.password, saltRounds)
	}
	next()
})

// Method to check if provided password is correct
userSchema.methods.isCorrectPassword = async function (
	password: string
): Promise<boolean> {
	return bcrypt.compare(password, this.password)
}

// Virtuals (fullname)
userSchema.virtual("fullname").get(function (this: IUser) {
	return `${this.firstName} ${this.lastName}`
})

// Ensure virtual fields are serialized in JSON and object representations
userSchema.set("toJSON", { virtuals: true })
userSchema.set("toObject", { virtuals: true })

export const User = models.User || model<IUser>("User", userSchema)
