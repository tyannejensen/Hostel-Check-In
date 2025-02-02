import { dbConnect } from "@/lib/db";
import { Booking } from "@/models/Booking.model";

// GET DATA
export async function getBookings() {
  await dbConnect();

  const bookings = await Booking.find()
    .populate("bookedBy", "fullname email")
    .populate("createdBy", "fullname")
    .populate({
      path: "payments",
      select: "amount",
      populate: {
        path: "paymentMethod",
        select: "method paymentName",
      },
    })
    .populate({
      path: "notes",
      populate: {
        path: "createdBy",
        select: "fullname",
      },
    });

  const bookingsAsObj = bookings.map((booking: any) =>
    booking.toObject({ getters: true, virtuals: false })
  );

  // Ensure final data is fully JSON-serializable
  return JSON.parse(JSON.stringify(bookingsAsObj));
}

export async function getBookingById(id: string) {
  await dbConnect();

  const booking = await Booking.findById(id)
    .populate("bookedBy", "fullname email")
    .populate("createdBy", "fullname")
    .populate({
      path: "payments",
      select: "amount",
      populate: {
        path: "paymentMethod",
        select: "method paymentName",
      },
    })
    .populate({
      path: "notes",
      populate: {
        path: "createdBy",
        select: "fullname",
      },
    });

  const bookingObj = booking.toObject();
  return bookingObj;
}

export async function getBookingsByTenantId(id: string) {
  await dbConnect();

  const tenantBookings = await Booking.find({ bookedBy: id })
    .populate("bookedBy", "fullname email")
    .populate("createdBy", "fullname")
    .populate({
      path: "payments",
      select: "amount",
      populate: {
        path: "paymentMethod",
        select: "method paymentName",
      },
    })
    .populate({
      path: "notes",
      populate: {
        path: "createdBy",
        select: "fullname",
      },
    });

  const tenantBookingsObjs = tenantBookings.map((booking) =>
    booking.toObject()
  );
  return tenantBookingsObjs;
}

// SET DATA
