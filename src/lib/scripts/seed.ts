"use server"

// Used to access environment variables
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { dbConnect } from "@/lib/db"
import { User } from "@/lib/models/User.model"
import { Room } from "@/lib/models/Room.model"
import { Booking } from "@/lib/models/Booking.model"
import { IRoom } from "@/lib/types/interfaces/room.interface"
import { IUser } from "@/lib/types/interfaces/user.interface"
import { users, rooms, bookings, notes } from "@/server-utils/test-data"
import mongoose from "mongoose"
import { transform } from "next/dist/build/swc/generated-native"

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
	const adminUser = await new User(users[0])
	return adminUser.save()
}

async function seedUsers(admin: IUser) {
	const insertedUsers = await Promise.all(
		// Add all users except the first one who was created in the previous function step (addAdminUser)
		users.slice(1).map(async (user) => {
			// build new user
			const userObj = {
				...user,
				createdBy: admin._id,
			}
			const newUser = await new User(userObj).save()
			return newUser
		})
	)
	const formatedUsers = await Promise.all(
		insertedUsers.map(async (user) => {
			const populatedUser = await User.findOne({ _id: user._id })
				.populate(
					"createdBy",
					"fullname" // Populate createdBy field with fullname and email
				)
				.select("fullname email createdAt tags role") // Select only these fields
			return populatedUser.toObject()
		})
	)
	console.table(formatedUsers)
	return formatedUsers
}

async function seedRooms() {
	const insertedRooms = await Promise.all(
		rooms.map(async (room) => {
			const newRoom = new Room(room)
			return newRoom.save()
		})
	)
	console.table(insertedRooms)
	return insertedRooms
}

async function seedBookings(
	admin: IUser,
	users: IUser[],
	rooms: IRoom[],
	notes: { content: string; createdBy: string }[]
) {
	const insertedBookings = await Promise.all(
		bookings.map(async (b, i) => {
			// build new note
			const newNote = {
				content: notes[i].content,
				createdBy: admin._id,
			}

			// build new booking
			const booking = {
				...b,
				bookedBy: users[i]._id,
				createdBy: admin._id,
				roomId: rooms[i]._id,
				depositAmount: rooms[i].deposit,

				notes: newNote,
			}
			const newBooking = new Booking(booking)
			return newBooking.save()
		})
	)
	console.table(insertedBookings)
	return insertedBookings
}

async function seedDatabase() {
	try {
		await dbConnect() // Connect to the database

		// Drop all collections
		await dropAllCollections() // Drop all collections
		console.log("Collections dropped")

		// Add the admin user
		const admin = await addAdminUser() // Add the admin user
		console.log("Admin user added")

		// Add all tenants
		const tenants = await seedUsers(admin) // Add all tenents
		console.log("Tenants added")

		// Add all rooms
		// await seedRooms() // Add all rooms

		// Add all bookings and link to the tenants
		// await seedBookings(admin, tenants, tenants, notes)

		// Add all notes and link to the bookings

		// Add all payments and link to the bookings

		process.exit(0)
	} catch (error) {
		console.error("Error seeding database:", error)
		process.exit(1)
	}
}

// Run the seedDatabase function
seedDatabase()
