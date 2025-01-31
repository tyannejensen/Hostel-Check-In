import { Schema, model, models } from "mongoose"
import { getOldDoc, logChanges } from "@/server-utils/helpers"
import { IBooking } from "@/interfaces/booking.interface"
import { changeLogSchema } from "@/models/Log.schema"
import { noteSchema } from "@/models/Note.schema"

const BookingSchema = new Schema<IBooking>(
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
		depositAmount: {
			type: Number,
			required: [true, "Deposit amount is required"],
			get: (v: number) => v * 100, // Convert deposit amount to cents
			set: (v: number) => v / 100, // Convert deposit amount to dollars
		},
		depositReturned: {
			type: Boolean,
			default: false,
		},
		depositReturnedDate: {
			type: Date,
		},
		depositReturnAmount: {
			type: Number,
			get: (v: number) => v * 100, // Convert deposit amount to cents
			set: (v: number) => v / 100, // Convert deposit amount to dollars
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
	{
		timestamps: true,
		toJSON: { getters: true, virtuals: true },
		toObject: { getters: true, virtuals: true },
	}
)

// VIRTUALS
// Virtual to calculate the total payment made for a booking
BookingSchema.virtual("totalPayment").get(function () {
	return this.payments.reduce((acc, curr) => acc + curr.amount, 0)
})

// MIDDLEWARE
// Capture and save the old Booking document before updating - Part 1 of 2 of logging the booking history
BookingSchema.pre("findOneAndUpdate", getOldDoc) // IMPORTANT: Use findOneAndUpdate as the standard unless you have a good reason not to
BookingSchema.pre("updateOne", getOldDoc)
BookingSchema.pre("replaceOne", getOldDoc)
// DO NOT USE findByIdAndUpdate as it does not trigger the pre hook

// Capture and save the old Booking document before updating - Part 2 of 2 of logging the booking history
BookingSchema.post("findOneAndUpdate", logChanges) // IMPORTANT: Use findOneAndUpdate as the standard unless you have a good reason not to
BookingSchema.post("updateOne", logChanges)
BookingSchema.post("replaceOne", logChanges)
// DO NOT USE findByIdAndUpdate as it does not trigger the post hook

export const Booking =
	models.Booking || model<IBooking>("Booking", BookingSchema)
