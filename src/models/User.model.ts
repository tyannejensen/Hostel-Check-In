import { Schema, model, models } from "mongoose"
import { getOldDoc, logChanges } from "@/utils/helpers"
import { v4 as uuidv4 } from "uuid"
import { IUser } from "@/interfaces/user.interface"
import { changeLogSchema } from "@/models/Log.schema"
import { phoneNumberSchema } from "@/models/PhoneNumber.schema"
import bcrypt from "bcrypt"

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
		paymentMethods: [
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
		history: [changeLogSchema],
		createdBy: {
			type: String,
			ref: "User",
		},
		updatedBy: {
			type: String,
			ref: "User",
		},
	},
	{
		timestamps: true, // Add createdAt and updatedAt fields
		toJSON: { getters: true },
		toObject: { getters: true },
	}
)

// Capture and save the old Booking document before updating - Part 1 of 2 of logging the booking history
userSchema.pre("findOneAndUpdate", getOldDoc) // IMPORTANT: Use findOneAndUpdate as the standard unless you have a good reason not to
userSchema.pre("updateOne", getOldDoc)
userSchema.pre("replaceOne", getOldDoc)
// DO NOT USE findByIdAndUpdate as it does not trigger the pre hook

// Capture and save the old Booking document before updating - Part 2 of 2 of logging the booking history
userSchema.post("findOneAndUpdate", logChanges) // IMPORTANT: Use findOneAndUpdate as the standard unless you have a good reason not to
userSchema.post("updateOne", logChanges)
userSchema.post("replaceOne", logChanges)
// DO NOT USE findByIdAndUpdate as it does not trigger the post hook

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
