import { Schema, model, Document, models, ObjectId } from "mongoose"
import { IPayment } from "@/lib/models/Payment"
import { changeLogSchema, IChangeLog } from "@/lib/models/Log"
import { noteSchema, INote } from "@/lib/models/Note"

// Custom types for Booking Schema
type IBookingStatus = "paid" | "pending" | "due"

// Interface for Booking Schema
export interface IBooking extends Document {
	_id: ObjectId
	bookedBy: string // reference to the user (tenant) who made the booking - uses uuid v4
	createdBy: string // reference to the user (employee) who created the booking - uses uuid v4
	roomId: ObjectId
	checkIn: Date
	checkOut: Date
	status: IBookingStatus
	DepositAmount: number
	depositReturned: boolean
	depositReturnDate?: Date
	depositReturnAmount?: number
	payments: IPayment[]
	totalPayment?: number
	Notes?: INote[]
	history?: IChangeLog[]
}

// TODO: Complete the Booking Schema - add validation, default values, and required fields

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

		const oldDoc = this.get("_oldDoc") as IBooking // Retrieve the old document
		const update = this.getUpdate() as Record<string, any> // Retrieve the update object
		if (!update) return // Exit if no updates
		const updatedFields = update.$set // Retrieve updated fields

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
