import { Schema, model, models } from "mongoose";
import { IBooking } from "@/interfaces/booking.interface";
import { ChangeLogSchema } from "@/lib/models/ChangeLog.schema";
import { NoteSchema } from "@/models/Note.schema";
import { formatDate, getOldDoc, logChanges } from "@/server-utils/helpers";

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
      enum: ["paid", "pending", "booked", "due"],
      default: "pending",
    },
    // TODO: Add a field for "cost"
    // TODO: Add a field for the "totalCost" of the booking (cost + deposit)
    // TODO: Add virtual for "totalCost" that calculates the total cost of the booking
    depositAmount: {
      type: Number,
      required: [true, "Deposit amount is required"],
      get: (v: number) => v / 100, // Convert deposit amount to cents
      set: (v: number) => v * 100, // Convert deposit amount to dollars
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
      get: (v: number) => v / 100, // Convert deposit amount to cents
      set: (v: number) => v * 100, // Convert deposit amount to dollars
      default: 0,
    },
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
        required: [true, "Payment ID is required"],
      },
    ],
    notes: [NoteSchema],
    history: {
      type: [ChangeLogSchema],
      default: [],
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
  }
);

// MIDDLEWARE

// Record document updates in the history array
// Capture and save the old Booking document before updating - Part 1 of 2 of logging the booking history
// BookingSchema.pre("findOneAndUpdate", getOldDoc)
// // Capture and save the old Booking document before updating - Part 2 of 2 of logging the booking history
// BookingSchema.post("findOneAndUpdate", logChanges)

// GETTERS
// Convert the 'createdAt' and 'updatedAt' fields to MMM DD, YYYY format e.g. Jan 30, 2025
BookingSchema.path("createdAt").get(formatDate);
BookingSchema.path("updatedAt").get(formatDate);
BookingSchema.path("checkIn").get(formatDate);
BookingSchema.path("checkOut").get(formatDate);

// SETTERS
// Set toObject options to exclude _id and password fields automatically
BookingSchema.set("toObject", {
  getters: true,
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id; // Exclude _id field
    delete ret.__v; // Exclude __v (version) field
  },
});

// Set toJSON options to exclude _id and password fields automatically
BookingSchema.set("toJSON", {
  virtuals: true,
  getters: true,
  transform: function (doc, ret) {
    delete ret._id; // Exclude _id field
    delete ret.__v; // Exclude __v (version) field
  },
});

// VIRTUALS
// None

export const Booking =
  models.Booking || model<IBooking>("Booking", BookingSchema);
