import { Document, ObjectId } from "mongoose";
import { IChangeLog } from "@/interfaces/change-log.interface";
import { IPayment } from "@/interfaces/payment.interface";
import { IBookingStatus } from "@/mytypes/index";
import { INote } from "@/interfaces/note.interface";

// Interfaces for Booking Schema
export interface IBooking extends Document {
  _id: ObjectId;
  bookedBy: string; // reference to the user (tenant) who made the booking - uses uuid v4
  createdBy: string; // reference to the user (employee) who created the booking - uses uuid v4
  roomId: ObjectId;
  roomNumber: string;
  checkIn: Date;
  checkOut: Date;
  status: IBookingStatus;
  depositAmount: number;
  depositReturned: boolean;
  depositReturnedDate?: Date;
  depositReturnAmount?: number;
  payments: IPayment[];
  totalPayment?: number;
  notes?: INote[];
  history?: IChangeLog[];
}
