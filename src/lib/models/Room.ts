import { Schema, model, ObjectId, Document, models } from "mongoose"

// Custom types and interfaces for Room Schema
export type IRoomType = "shared" | "single" | "double" | "suite"
export type IRoomStatus = "available" | "occupied" | "maintenance" | "cleaning"

export interface IRoom extends Document {
	_id: ObjectId
	type: IRoomType
	roomNumber: number | string
	status: IRoomStatus
	bookedBy: string // reference to the user (tenant) who made the booking - uses uuid v4
	name?: string
	occupants?: number
}

export const roomSchema = new Schema<IRoom>({
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
				return /^[0-9]{3}$/.test(v.toString())
			},
			message: (props) => `${props.value} is not a valid room number!`,
		},
		status: {
			type: String,
			enum: ["available", "occupied", "maintenance", "cleaning"],
			default: "available",
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
})

export const Room = models.Room || model<IRoom>("Room", roomSchema)
