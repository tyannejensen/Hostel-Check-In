"use server"

import mongoose from "mongoose"
import { dbConnect } from "@/lib/db"
import { NextRequest } from "next/server"
import { Booking, Payment, PaymentMethod, User } from "@/models/index"

// GET DATA
export async function getBookings() {
	await dbConnect()

	const bookings = await Booking.find()
		.populate("bookedBy", "fullname email")
		.populate("createdBy", "fullname")
		.populate("roomId", "roomNumber roomType")
		.populate({
			path: "payments",
			select: "amount",
			populate: {
				path: "paymentMethod",
				select: "method paymentName",
			},
		})
		.populate({
			path: "notes",
			populate: {
				path: "createdBy",
				select: "fullname",
			},
		})

	const bookingsAsObj = bookings.map((booking: any) =>
		booking.toObject({ getters: true, virtuals: false })
	)

	// Ensure final data is fully JSON-serializable
	return JSON.parse(JSON.stringify(bookingsAsObj))
}

export async function getBookingById(id: string) {
	await dbConnect()

	const booking = await Booking.findById(id)
		.populate("bookedBy", "fullname email")
		.populate("createdBy", "fullname")
		.populate("roomId", "roomNumber roomType")
		.populate({
			path: "payments",
			select: "amount",
			populate: {
				path: "paymentMethod",
				select: "method paymentName",
			},
		})
		.populate({
			path: "notes",
			populate: {
				path: "createdBy",
				select: "fullname",
			},
		})

	const bookingObj = booking.toObject()
	return bookingObj
}

export async function getBookingsByTenantId(req: NextRequest) {
	await dbConnect()

	const userId = req.headers.get("x-user-id")
	if (!userId) {
		throw new Error("User ID not found in request headers")
	}

	const tenantBookings = await Booking.find({ bookedBy: userId })
		.populate("bookedBy", "fullname email")
		.populate("createdBy", "fullname")
		.populate("roomId", "roomNumber roomType")
		.populate({
			path: "payments",
			select: "amount",
			populate: {
				path: "paymentMethod",
				select: "method paymentName",
			},
		})
		.populate({
			path: "notes",
			populate: {
				path: "createdBy",
				select: "fullname",
			},
		})

	const tenantBookingsObjs = tenantBookings.map((booking) => booking.toObject())
	return tenantBookingsObjs
}

// SET DATA

export async function addBookingAndPayment(data: any, userId: string) {
	// Connect to the database
	await dbConnect()

	// Step 1: Create Session
	const session = await mongoose.startSession()
	session.startTransaction()

	try {
		// Step 2: Create Booking (initially without a payment reference) and save it
		const booking = new Booking({
			bookedBy: data.name.value, // tenantId - uuid v4
			createdBy: userId, // userId - ObjectId
			roomId: data.room.value, // roomId - ObjectId
			checkIn: new Date(data.dateRange.from),
			checkOut: new Date(data.dateRange.to),
			status: data.status,
			depositAmount: data.deposit,
		})
		await booking.save({ session })

		console.log("function addBookingAndPayment -> booking", booking)

		// Step 3: Get a Paymebt Method to use with the Payment
		const paymentMethod = await PaymentMethod.findOne({
			userId: data.name.value,
		}).session(session)

		console.group(
			// debugging
			"function addBookingAndPayment -> paymentMethod: ",
			paymentMethod
		)

		// Step 4: Create Payment and save it
		const payment = new Payment({
			bookingId: booking._id,
			amount: Number(data.total),
			paidBy: data.name.value,
			createdBy: userId,
			paymentMethod: paymentMethod._id,
		})
		await payment.save({ session })

		console.log("function addBookingAndPayment -> payment", payment)

		// Step 5: Update Booking with the Payment reference
		booking.payments.push(payment._id)
		await booking.save({ session })

		// Step 6: Commit the transaction
		await session.commitTransaction()
		session.endSession()

		// Step 7: Return the booking object
		return booking.toObject()
	} catch (error) {
		await session.abortTransaction()
		session.endSession()
		throw new Error(`Failed to create booking and payment: ${String(error)}`)
	}
}

// addNewReservation()
// - tenantId: the tenant the reservation will be under
// - checkInDate
// - checkOutDate
// - roomId
// - totalCost
// - deposit
// - status: paid, not-paid, pending
