import { dbConnect } from "@/lib/db";
import { Booking } from "@/models/index";

interface SaveNoteParams {
  bookingId: string;
  note: string;
  userId: string;
}

export async function saveNote({ bookingId, note, userId }: SaveNoteParams) {
  await dbConnect();

  try {
    const booking = await Booking.findById(bookingId).populate("notes.createdBy", "fullname email").exec();

    if (!booking) {
      return { error: true, message: "Booking not found" };
    }

    booking.notes.push({
      note,
      createdBy: userId,
      createdAt: new Date(),
    });

    await booking.save();

    return { error: false, message: "Note added successfully" };
  } catch (error) {
    console.error("Error adding note to booking:", error);
    return { error: true, message: (error as Error).message };
  }
}