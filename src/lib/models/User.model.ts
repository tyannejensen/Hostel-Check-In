import { Schema, model, models } from "mongoose"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"
import { IUser, IBillingAddress } from "@/interfaces/index"
import { BillingAddressSchema } from "@/models/BillingAddress.schema" // require invidual import to avoid circular dependency
import { ChangeLogSchema } from "@/models/index" // require invidual import to avoid circular dependency
import { PhoneNumberSchema } from "@/models/PhoneNumber.schema" // require invidual import to avoid circular dependency
import {
	formatDate,
	// getOldDoc,
	// logChanges,
	// logHistory,
} from "@/server-utils/helpers"

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
		phoneNumbers: [PhoneNumberSchema],
		role: {
			type: String,
			required: [true, "Role is required"],
			enum: {
				values: ["admin", "employee", "tenant"],
				message: "{VALUE} is not a valid role",
			},
		},
		bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
		paymentMethods: [{ type: Schema.Types.ObjectId, ref: "PaymentMethod" }],
		billingAddress: {
			type: BillingAddressSchema,
			validate: {
				validator: function (this: IUser, billingAddress: IBillingAddress) {
					if (this.role === "tenant") {
						return !!billingAddress // if the role is tenant, billing address is required
					}
					return this.role === "admin" || this.role === "employee"
				},
				message: "Billing address is required for tenants",
			},
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
		history: {
			type: [ChangeLogSchema],
			default: [],
		},
		createdBy: {
			type: String,
			ref: "User",
			// get: function (createdBy: IUser) { // Return only the fullname of the createdBy user
			// 	// Here, you return the fullName instead of the entire user object
			// 	return createdBy ? createdBy.fullname : null
			// },
		},
		updatedBy: {
			type: String, // Reference to the user (employee/admin) who updated the user
			ref: "User",
		},
	},
	{
		timestamps: true, // Add createdAt and updatedAt fields
	}
)

// TODO: Create a solution for capturing updates using the 'save' pre and post hooks to create a history of changes to User and Booking documents.
// NOTE: Only use the findOne(), new Model(), and save() methods to update documents to trigger the pre and post hooks

// MIDDLWARE

// Record document updates in the history array
// Capture and save the old Booking document before updating - Part 1 of 2 of logging the booking history
<<<<<<< HEAD
UserSchema.pre("findOneAndUpdate", getOldDoc);
// Capture and save the old Booking document before updating - Part 2 of 2 of logging the booking history
UserSchema.post("findOneAndUpdate", logChanges);
=======
// UserSchema.pre("findOneAndUpdate", getOldDoc)
// // Capture and save the old Booking document before updating - Part 2 of 2 of logging the booking history
// UserSchema.post("findOneAndUpdate", logChanges)

// UserSchema.pre("save", logHistory)
>>>>>>> main

// Pre-save hook to hash password
UserSchema.pre<IUser>("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// METHODS
// Check if the password is correct
UserSchema.methods.isCorrectPassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// GETTERS
// Convert the 'createdAt' field to MMM DD, YYYY format e.g. Jan 30, 2025
UserSchema.path("createdAt").get(formatDate);
UserSchema.path("updatedAt").get(formatDate);

// SETTERS
// Set toObject options to exclude _id and password fields automatically
UserSchema.set("toObject", {
  getters: true,
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id; // Exclude _id field
    delete ret.__v; // Exclude __v (version) field
    delete ret.password; // Exclude password field
  },
});

// Set toJSON options to exclude _id and password fields automatically
UserSchema.set("toJSON", {
  virtuals: true,
  getters: true,
  transform: function (doc, ret) {
    delete ret._id; // Exclude _id field
    delete ret.__v; // Exclude __v (version) field
    delete ret.password; // Exclude password field
  },
});

// VIRTUALS
// None

<<<<<<< HEAD
export const User = models.User || model<IUser>("User", UserSchema);
=======
// Compile and export User model
export const User = models.User || model<IUser>("User", UserSchema)
>>>>>>> main
