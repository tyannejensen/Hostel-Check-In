import { dbConnect } from "@/lib/db";
import { Room } from "@/models/Room.model";

//GET DATA

export async function getRooms() {
  await dbConnect();

  const rooms = await Room.find().populate("occupants", "fullname");

  const roomsAsObj = rooms.map((room: any) => room.toObject());

  // Ensure final data is fully JSON-serializable
  return roomsAsObj;
}

export async function getRoomById(roomId: string) {
  await dbConnect();

  const room = await Room.findById(roomId)
    .populate("occupants", "fullname")
    .select(
      "roomType roomNumber status costPerDay deposit name size occupants"
    );

  const roomObj = room.toObject();
  return roomObj;
}

//SET DATA

export async function createRoom(data: any) {
  await dbConnect();

  const newRoom = new Room(data);
  const room = await newRoom.save();
  return room.toObject();
}

export async function updateRoom(roomId: string, data: any) {
  await dbConnect();

  // TODO: replace 'findByIdAndUpdate' with 'find() and save()'
  // to use the 'pre' and 'post' hooks for history logging
  const room = await Room.findByIdAndUpdate(roomId, data, {
    new: true,
    runValidators: true,
  });
  return room.toObject();
}
