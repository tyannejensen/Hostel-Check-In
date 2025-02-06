"use server";
import { dbConnect } from "@/lib/db";
import { Booking, User } from "@/models/index";
import { headers } from "next/headers";

export async function saveNote(payload: any) {
  console.log("Payload received:", payload);
  await dbConnect();
  const reqHeaders = await headers();
  const userId = reqHeaders.get("x-user-id");

  const newNote = payload.newNote;
  const userIdFromUrl = payload.userId;

  console.log("User ID from URL:", userIdFromUrl);

  if (!newNote) {
    return { error: true, message: "Please write a note" };
  }

  try {
    // Find the user by ID
    const user = await User.findById(userIdFromUrl).populate("bookings").exec();
    console.log("User found:", user);

    if (!user) {
      return { error: true, message: "User not found" };
    }

    // Get the booking ID from the user's bookings
    const bookingId = user.bookings[0]._id; // Assuming the user has at least one booking
    console.log("Booking ID:", bookingId);

    // Find the booking by ID
    const booking = await Booking.findById(bookingId).populate("notes.createdBy", "fullname email").exec();
    console.log("Booking found:", booking);

    if (!booking) {
      return { error: true, message: "Booking not found" };
    }

    const note = {
      content: newNote,
      createdBy: userId,
      createdAt: new Date(),
    };
    console.log("New note:", note);

    // Add the new note to the existing notes array
    booking.notes.push(note);

    await booking.save();

    console.log("Note saved successfully");
    return { error: false, message: "Note Created Successfully" };
  } catch (error) {
    console.error("Error adding note to booking:", error);
    return { error: true, message: (error as Error).message };
  }
}