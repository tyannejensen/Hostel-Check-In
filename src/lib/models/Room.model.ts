import { Schema, model, ObjectId, Document, models } from "mongoose"
import { IRoom } from "@/lib/types/interfaces/room.interface"

// Room Schema
export const roomSchema = new Schema<IRoom>(
	{
		type: {
			type: String,
			enum: ["shared", "single", "double", "suite"],
			required: [true, "Room type is required"],
		},
		roomNumber: {
			type: Schema.Types.Mixed,
			required: [true, "Room number is required"],
			unique: [true, "Room number must be unique"],
			validate: {
				validator: (v: number | string) => {
					return /^[0-9]{3}[a-zA-Z]$/.test(v.toString())
				},
				message: "{VALUE} is not a valid room number!",
			},
			status: {
				type: String,
				enum: ["available", "occupied", "maintenance", "cleaning"],
				default: "available",
			},
			deposit: {
				type: Number,
				required: [true, "Deposit amount is required"],
				get: (v: number) => v * 100, // Convert deposit amount to cents
				set: (v: number) => v / 100, // Convert deposit amount to dollars
			},
			bookedBy: {
				type: String,
				ref: "User",
				required: [true, "Tenant ID is required"],
			},
			name: {
				type: String,
				required: false,
			},
			occupants: {
				type: Number,
				required: false,
			},
		},
	},
	{ timestamps: true }
)

export const Room = models.Room || model<IRoom>("Room", roomSchema)
