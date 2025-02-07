"use server";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/index";
import { headers } from "next/headers";

// Define a type for the payload
interface NotePayload {
  newNote: string;
  userId: string;
}

export async function saveNote(payload: NotePayload) {
  await dbConnect();
  const reqHeaders = await headers();
  const userId = reqHeaders.get("x-user-id");

  const { newNote, userId: userIdFromUrl } = payload;

  if (!newNote) {
    return { error: true, message: "Please write a note" };
  }

  try {
    // Find the user by ID
    const user = await User.findById(userIdFromUrl);

    if (!user) {
      return { error: true, message: "User not found" };
    }

    const note = {
      content: newNote,
      createdBy: userId,
      createdAt: new Date(),
    };

    // Add the new note to the existing notes array
    user.notes.push(note);

    await user.save();

    return { error: false, message: "Note Created Successfully" };
  } catch (error) {
    console.error("Error adding note to booking:", error);
    return { error: true, message: (error as Error).message };
  }
}