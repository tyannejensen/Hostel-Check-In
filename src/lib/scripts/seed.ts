"use server"

// Used to access environment variables
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import mongoose from "mongoose"
import { dbConnect } from "@/lib/db"
import { Booking } from "@/models/Booking.model"
import { Payment } from "@/models/Payment.model"
import { Room } from "@/models/Room.model"
import { User } from "@/models/User.model"
import { IBooking } from "@/interfaces/booking.interface"
import { IRoom } from "@/interfaces/room.interface"
import { IUser } from "@/interfaces/user.interface"
import {
	usersData,
	roomsData,
	bookingsData,
	notesData,
} from "@/server-utils/test-data"

async function dropAllCollections() {
	await dbConnect() // Ensure connection is established

	const db = mongoose.connection.db
	if (!db) {
		console.error("Database connection is not established.")
		process.exit(1)
	}

	const collections = await db.listCollections().toArray()

	for (const collection of collections) {
		try {
			await mongoose.connection.collection(collection.name).deleteMany({})
			console.log(`Cleared collection: ${collection.name}`)
		} catch (error) {
			console.error(`Error clearing collection ${collection.name}:`, error)
		}
	}
}

async function addAdminUser() {
	const adminUser = await new User(usersData[0]).save()
	const newAdminUser = await User.findOne({ _id: adminUser._id }).select(
		"fullname email role tags createdAt"
	)
	const finalAdminUser = newAdminUser.toObject()
	console.table(
		[finalAdminUser],
		["fullname", "email", "role", "tags", "createdAt"]
	)
	return finalAdminUser
}

async function seedUsers(admin: IUser) {
	const insertedUsers = await Promise.all(
		// Add all users except the first one who was created in the previous function step (addAdminUser)
		usersData.slice(1).map(async (user) => {
			// build new user
			const userObj = {
				...user,
				createdBy: admin.id,
			}
			const newUser = await new User(userObj).save()
			return newUser
		})
	)
	const formatedUsers = await Promise.all(
		insertedUsers.map(async (user) => {
			const populatedUser = await User.findOne({ _id: user.id })
				.populate(
					"createdBy",
					"fullname" // Populate createdBy field with fullname and email
				)
				.select("fullname email createdAt tags role") // Select only these fields
			return populatedUser.toObject()
		})
	)
	console.table(formatedUsers, [
		"fullname",
		"email",
		"role",
		"tags",
		"createdAt",
	])
	return formatedUsers
}

async function seedRooms(users: IUser[]) {
	const insertedRooms = await Promise.all(
		roomsData.map(async (room, i) => {
			const newRoom = new Room(room)
			newRoom.occupants.push(users[i].id)
			return newRoom.save()
		})
	)

	const formatedRooms = await Promise.all(
		insertedRooms.map(async (room) => {
			const populatedRoom = await Room.findOne({ _id: room._id })
				.populate("occupants", "fullname email") // Populate bookedBy field with fullname and email
				.select("type roomNumber status deposit occupants") // Select only these fields
			return populatedRoom.toObject()
		})
	)

	console.table(formatedRooms, [
		"roomNumber",
		"status",
		"occupants",
		"deposit",
		"type",
	])
	return formatedRooms
}

async function seedBookingsWithPayments(
	admin: IUser,
	users: IUser[],
	rooms: IRoom[]
) {
	const session = await mongoose.startSession()
	session.startTransaction()

	try {
		const newBookings = []
		const newPayments = []

		for (let i = 0; i < bookingsData.length; i++) {
			// Step 1: Create Booking (initially without a payment reference)
			const booking = new Booking({
				...bookingsData[i],
				bookedBy: users[i].id,
				createdBy: admin.id,
				roomId: rooms[i].id,
				depositAmount: rooms[i].deposit,
			})
			await booking.save({ session })

			// Step 2: Create Payment and reference the Booking
			const payment = new Payment({
				bookingId: booking._id,
				amount: rooms[i].deposit + 85.23,
				paidBy: users[i].id,
				createdBy: admin.id,
				paymentMethod: {
					...usersData[i + 1].paymentMethods[0],
				},
			})
			await payment.save({ session })

			// Step 3: Update Booking with the Payment reference
			booking.payments.push(payment._id)
			await booking.save({ session })

			// Store the created documents for logging
			newBookings.push(booking)
			newPayments.push(payment)
		}

		// Step 4: Commit transaction
		await session.commitTransaction()
		session.endSession()

		const formatedBookings = await Promise.all(
			newBookings.map(async (booking) => {
				const populatedBooking = await Booking.findOne({ _id: booking._id })
					.populate("bookedBy", "fullname email") // Populate bookedBy field with fullname and email
					.populate("createdBy", "fullname email") // Populate createdBy field with fullname and email
					.populate({
						// Populate payments field with paidBy field
						path: "payments",
						select: "amount paidBy",
						populate: {
							path: "paidBy",
							select: "fullname email",
						},
					})
					.select("roomId checkIn checkOut status depositAmount") // Select only these fields
				return populatedBooking.toObject()
			})
		)

		console.table(formatedBookings, [
			"bookedBy",
			"checkIn",
			"checkOut",
			"status",
			"depositAmount",
			"payments",
		])
		return formatedBookings
	} catch (error) {
		await session.abortTransaction()
		session.endSession()
		console.error("Seeding failed:", error)
		throw error
	}
}

async function seedNotes(admin: IUser, bookings: IBooking[]) {
	// Add all notes and link to the bookings
	const formatedNotes = await Promise.all(
		notesData.map(async (note, i) => {
			const booking = await Booking.findOne({ _id: bookings[i].id }).populate({
				path: "notes",
				populate: {
					path: "createdBy",
					select: "fullname email",
				},
			})
			booking.notes.push({
				...note,
				createdBy: admin.id,
			})
			await booking.save()
			const bookingObject = await Booking.findOne({
				_id: booking._id,
			}).populate({
				path: "notes",
				populate: {
					path: "createdBy",
					select: "fullname email",
				},
			})
			return bookingObject.notes[0].toObject()
		})
	)
	console.table(formatedNotes, ["content", "createdBy", "createdAt"])
}

async function seedDatabase() {
	try {
		await dbConnect() // Connect to the database

		// Drop all collections
		await dropAllCollections() // Drop all collections
		console.log("Collections dropped\n")

		// Add the admin user
		const admin = await addAdminUser() // Add the admin user
		console.log("Admin user added successfully!\n")

		// Add all tenants
		const tenants = await seedUsers(admin) // Add all tenents
		console.log("Tenants added successfully!\n")

		// Add all rooms
		const rooms = await seedRooms(tenants) // Add all rooms
		console.log("Rooms added successfully!\n")

		// Add all bookings and link to the tenants
		const bookings = await seedBookingsWithPayments(admin, tenants, rooms) // Add all bookings
		console.log("Bookings and Payments added successfully!\n")

		// Add all notes and link to the bookings
		await seedNotes(admin, bookings) // Add all notes
		console.log("Notes added to Bookings successfully!\n")

		console.log("Database seeded successfully!")

		process.exit(0)
	} catch (error) {
		console.error("Error seeding database:", error)
		process.exit(1)
	}
}

// Run the seedDatabase function
seedDatabase()
