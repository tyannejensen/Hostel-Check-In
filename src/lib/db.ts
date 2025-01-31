"use server"
import mongoose from "mongoose"

const MONGO_URI = process.env.MONGO_URI as string

console.log("MONGO_URI", MONGO_URI)
console.log("MONGO_URI", process.env.MONGO_URI)
console.log(typeof MONGO_URI)

if (!MONGO_URI) {
	throw new Error(
		"Please define the MONGO_URI environment variable inside .env.local"
	)
	throw new Error(
		"Please define the MONGO_URI environment variable inside .env.local"
	)
}

let cached = (global as any).mongoose || { conn: null, promise: null }

export async function dbConnect() {
	if (cached.conn) return cached.conn

	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGO_URI, {
			dbName: "hostel_db",
		} as mongoose.ConnectOptions)
	}

	cached.conn = await cached.promise
	return cached.conn
}
