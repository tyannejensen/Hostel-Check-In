import { Schema, model, Document, models } from "mongoose"
import { IChangeLog } from "@/interfaces/change-log.interface"
import { IBooking } from "@/interfaces/booking.interface"
import { changeLogSchema } from "@/models/Log.schema"
import { noteSchema } from "@/models/Note.schema"

const bookingSchema = new Schema<IBooking>(
	{
		bookedBy: {
			type: String, // reference to the user (tenant) who made the booking - uses uuid v4
			required: [true, "Tenant ID is required"],
			ref: "User",
		},
		createdBy: {
			type: String, // reference to the user (employee) who created the booking - uses uuid v4
			required: [true, "Employee ID is required"],
			ref: "User",
		},
		roomId: {
			// reference to the Room Schema
			type: Schema.Types.ObjectId,
			ref: "Room",
			required: [true, "Room ID is required"],
		},
		checkIn: {
			type: Date,
			required: [true, "Check-in date is required"],
		},
		checkOut: {
			type: Date,
			required: [true, "Check-out date is required"],
		},
		status: {
			type: String,
			enum: ["paid", "pending", "due"],
			default: "pending",
		},
		DepositAmount: {
			type: Number,
			required: [true, "Deposit amount is required"],
		},
		depositReturned: {
			type: Boolean,
			default: false,
		},
		depositReturnDate: {
			type: Date,
		},
		depositReturnAmount: {
			type: Number,
		},
		payments: [
			{
				type: Schema.Types.ObjectId,
				ref: "Payment",
			},
		],
		Notes: [noteSchema],
		history: [changeLogSchema],
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

// Capture and save the old Booking document before updating - Part 1 of 2 of logging the booking history
bookingSchema.pre("findOneAndUpdate", async function (next) {
	const query = this // Reference to the query
	const docToUpdate = await this.model.findOne(this.getQuery()) // Fetch the old document
	query.set("_oldDoc", docToUpdate) // Store the old document in a query property
	next()
})

// Capture and save the old Booking document before updating - Part 2 of 2 of logging the booking history
bookingSchema.post(
	"findOneAndUpdate",
	async function (result: IBooking & Document) {
		if (!result || !this.get("_oldDoc")) return // Exit if no result or old doc

		// Retrieve the old and new document fields
		const oldDoc = this.get("_oldDoc") // Retrieve the old document
		const update = this.getUpdate() as { $set?: Record<string, any> } // Refined typing for update object

		if (!update) return // Exit if no update object

		const updatedFields = update.$set || {} // Safely access $set, defaulting to an empty object if undefined

		if (Object.keys(updatedFields).length === 0) return // Exit if no updated fields

		const changeLogs: IChangeLog[] = Object.keys(updatedFields)
			.map((field) => {
				const oldValue = (oldDoc as any)[field]
				const newValue = updatedFields[field]

				// Log the changes only if the value is different
				if (oldValue !== newValue) {
					return {
						field,
						oldValue,
						newValue,
						updatedAt: new Date(),
						updatedBy: result.createdBy, // Assuming the updater is the creator
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
	}
)

export const Booking =
	models.Booking || model<IBooking>("Booking", bookingSchema)
