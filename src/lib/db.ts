/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import mongoose from "mongoose"

const MONGO_URI = process.env.MONGO_URI as string

if (!MONGO_URI) {
	throw new Error(
		"Please define the MONGO_URI environment variable inside .env.local"
	)
}

interface MongooseCache {
	conn: typeof mongoose | null
	promise: Promise<typeof mongoose> | null
}

const cached: MongooseCache = (global as any).mongoose || {
	conn: null,
	promise: null,
}

export async function dbConnect() {
	if (cached.conn) return cached.conn

	if (!cached.promise) {
		cached.promise = mongoose
			.connect(MONGO_URI, {
				dbName: "hostel_db",
			} as mongoose.ConnectOptions)
			.then(async (connection) => {
				// Force-load all models
				await import("@/models/Booking.model")
				await import("@/models/User.model")
				await import("@/models/Payment.model")
				await import("@/models/PaymentMethod.model")
				await import("@/models/Room.model")
				return connection
			})
	}

	cached.conn = await cached.promise
	return cached.conn
}
