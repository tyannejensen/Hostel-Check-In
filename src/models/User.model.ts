import { Schema, model, ObjectId, Document, models } from "mongoose"
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"
import { changeLogSchema } from "@/models/Log.schema"
import { phoneNumberSchema } from "@/models/PhoneNumber.schema"
import { IUser } from "@/mytypes/interfaces/user.interface"
import { IChangeLog } from "@/mytypes/interfaces/change-log.interface"

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
		phoneNumber: [phoneNumberSchema],
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
		history: [changeLogSchema],
    createdBy: {
      type: String,
      ref: "User",
    },
    updatedBy: {
      type: String,
      ref: "User",
		}
	},
	{
		timestamps: true, // Add createdAt and updatedAt fields
		toJSON: { getters: true },
		toObject: { getters: true },
	}
)

// Capture and save the old Booking document before updating - Part 1 of 2 of logging the booking history
userSchema.pre("findOneAndUpdate", async function (next) {
	const query = this // Reference to the query
	const docToUpdate = await this.model.findOne(this.getQuery()) // Fetch the old document
	query.set("_oldDoc", docToUpdate) // Store the old document in a query property
	next()
})

// Capture and save the old Booking document before updating - Part 2 of 2 of logging the booking history
userSchema.post("findOneAndUpdate", async function (result: IUser & Document) {
	if (!result || !this.get("_oldDoc")) return // Exit if no result or old doc

  // Retrieve the old and new document fields
	const oldDoc = this.get("_oldDoc") // Retrieve the old document
	const update = this.getUpdate() as { $set?: Record<string, any> }; // Refined typing for update object
  
  if (!update) return; // Exit if no update object
  
  const updatedFields = update.$set || {}; // Safely access $set, defaulting to an empty object if undefined

  if (Object.keys(updatedFields).length === 0) return; // Exit if no updated fields

	const changeLogs: IChangeLog[] = Object.keys(updatedFields)
		.map((field) => {
			const oldValue = oldDoc[field]
			const newValue = updatedFields[field]

      if (field === "password") {
        return {
          field,
          oldValue: "Password updated", // Log that the password was updated
          newValue: "Password updated", // Log that the password was updated
          updatedAt: new Date(),
          updatedBy: result.updatedBy,
        } as IChangeLog
      }

			// Log the changes only if the value is different
			if (oldValue !== newValue) {
				return {
					field,
					oldValue,
					newValue,
					updatedAt: new Date(),
					updatedBy: result.updatedBy,
				} as IChangeLog
			}
		})
		.filter(Boolean) as IChangeLog[] // Remove undefined logs

	// Append the changes to the history field
	if (changeLogs.length > 0) {
		result.history = result.history || []
		result.history.push(...changeLogs)
		await result.save() // Save the document with the new history
	}
})

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
