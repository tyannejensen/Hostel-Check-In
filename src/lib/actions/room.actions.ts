import { dbConnect } from "@/lib/db"
import { Room } from "@/models/Room.model"

//GET DATA

export async function getRooms() {
	await dbConnect()

	const rooms = await Room.find().populate("occupants", "fullname")

	const roomsAsObj = rooms.map((room: any) => room.toObject())

	// Ensure final data is fully JSON-serializable
	return roomsAsObj
}

export async function getRoomById(_id: string) {
	await dbConnect()

	const room = await Room.findById(_id)
		.populate("occupants", "name")
		.select("roomType roomNumber status costPerDay name size occupants")

	const roomObj = room.toObject()
	return roomObj
}

//SET DATA

export async function createRoom(data: any) {
	await dbConnect()

	const newRoom = new Room(data)
	const room = await newRoom.save()
	return room
}

export async function updateRoom(_id: string, data: any) {
	await dbConnect()

	const room = await Room.findByIdAndUpdate(_id, data, {
		new: true,
		runValidators: true,
	})
	return room
}
