"use server";
import mongoose from "mongoose";
import { Booking } from "@/models/Booking.model";
import { User } from "@/models/User.model";
import { Payment } from "@/models/Payment.model";
import { PaymentMethod } from "@/models/PaymentMethod.model";
import { Room } from "@/models/Room.model";

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

interface Cached {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

const globalWithMongoose = global as typeof global & { mongoose: Cached };

const cached: Cached = globalWithMongoose.mongoose || { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = (mongoose
      .connect(MONGO_URI, {
        dbName: "hostel_db",
      } as mongoose.ConnectOptions) as unknown as Promise<mongoose.Connection>)
      .then((connection) => {
        // Force-load all models
        Booking.init();
        User.init();
        Payment.init();
        PaymentMethod.init();
        Room.init();
        return connection;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}