import { Schema, model, models } from "mongoose"
import { getOldDoc, logChanges } from "@/utils/helpers"
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
bookingSchema.pre("findOneAndUpdate", getOldDoc) // IMPORTANT: Use findOneAndUpdate as the standard unless you have a good reason not to
bookingSchema.pre("updateOne", getOldDoc)
bookingSchema.pre("replaceOne", getOldDoc)
// DO NOT USE findByIdAndUpdate as it does not trigger the pre hook

// Capture and save the old Booking document before updating - Part 2 of 2 of logging the booking history
bookingSchema.post("findOneAndUpdate", logChanges) // IMPORTANT: Use findOneAndUpdate as the standard unless you have a good reason not to
bookingSchema.post("updateOne", logChanges)
bookingSchema.post("replaceOne", logChanges)
// DO NOT USE findByIdAndUpdate as it does not trigger the post hook

export const Booking =
	models.Booking || model<IBooking>("Booking", bookingSchema)
