import mongoose from "mongoose"
import { dbConnect } from "@/lib/db"
import { User } from "@/lib/models/User.model"
import { Room } from "@/lib/models/Room.model"
import { Booking } from "@/lib/models/Booking.model"
import { IRoom } from "@/lib/types/interfaces/room.interface"
import { IUser } from "@/lib/types/interfaces/user.interface"
import { users, rooms, bookings, notes } from "@/server-utils/test-data"

async function dropAllCollections() {
	const db = await dbConnect()

	console.log(db)

	if (!db)
		return new Response(
			JSON.stringify({ message: "Error connecting to database" }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		)

	// Reomve all data from collections
	const collections = await db.collections()
	console.log(collections)
	for (const collection of collections) {
		await collection.deleteMany({})
	}
}

async function addAdminUser() {
	const adminUser = await new User(users[0])
	return adminUser.save()
}

async function seedUsers() {
	const insertedUsers = await Promise.all(
		// Add all users except the first one who was created in the previous function step (addAdminUser)
		users.slice(1).map(async (user) => {
			const newUser = new User(user)
			return newUser.save()
		})
	)
	console.table(insertedUsers)
	return insertedUsers
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

export async function GET() {
	try {
		await dbConnect() // Connect to the database

		// Drop all collections
		await dropAllCollections() // Drop all collections
		console.log("Collections dropped")

		// Add the admin user
		const admin = await addAdminUser() // Add the admin user
		console.log("Admin user added")

		// Add all tenants
		const tenants = await seedUsers() // Add all tenents
		console.log("Tenants added")

		// Add all rooms
		const rooms = await seedRooms() // Add all rooms

		// Add all bookings and link to the tenants
		await seedBookings(admin, tenants, tenants, notes)

		// Add all notes and link to the bookings

		// Add all payments and link to the bookings

		return new Response(
			JSON.stringify({ message: "Database seeded successfully" }),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		)
	} catch (error) {
		console.error("Error seeding database:", error)
		return new Response(JSON.stringify({ message: "Error seeding database" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		})
	}
}
