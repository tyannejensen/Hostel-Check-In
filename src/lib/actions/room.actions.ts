import { dbConnect } from "@/lib/db"
import { Room } from "@/models/Room.model"

//GET DATA

export async function getRooms() {
    await dbConnect()

    const rooms = await Room.find()
    .populate("roomType", "name")
    .populate("roomNumber", "name")
    .populate("status", "name")
    .populate("costPerDay", "name")
    .populate("deposit", "name")
    .populate("occupants", "name")
    

    const roomsAsObj = rooms.map((room: any) =>
        room.toObject({ getters: true, virtuals: false })
    )

    // Ensure final data is fully JSON-serializable
    return JSON.parse(JSON.stringify(roomsAsObj))
}

export async function getRoomById(id: string) {
    await dbConnect()

    const room = await Room.findById(id)
    .populate("roomType", "name")
    .populate("roomNumber", "name")
    .populate("status", "name")
    .populate("costPerDay", "name")
    .populate("deposit", "name")
    .populate("occupants", "name")

    const roomObj = room.toObject()
    return roomObj
}