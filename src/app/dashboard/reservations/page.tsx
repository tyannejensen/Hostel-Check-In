import React from "react";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import "@/styles/global.css";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { getBookings } from "@/actions/booking.actions";
import { IBooking } from "@/lib/types/interfaces/booking.interface";
import ReservationsTable from "../../components/ReservationsTable";

export default async function Page() {
  const bookings = await getBookings();

  console.log(bookings);

  const statusMap: { [key in "paid" | "not-paid" | "pending"]: string } = {
    paid: "Paid",
    "not-paid": "Not Paid",
    pending: "Pending",
  };

  function convertBookingIntoTableData(bookings: any) {
    console.log(bookings);
    return bookings.map((booking: any) => {
      return {
        id: booking.id,
        name: booking.bookedBy.fullname,
        room: booking.roomId.roomNumber, // Extract the room number from the roomId object
        checkInDate: booking.checkIn,
        checkOutDate: booking.checkOut,
        status: booking.status,
        statusLabel:
          statusMap[booking.status as keyof typeof statusMap] || "Unknown",
      };
    });
  }

  return (
    <>
      <div className="page">
        <div className="w-full">
          <h1 className="pt-[10px] pl-[30px] font-bold">DASHBOARD</h1>

          <div className="rounded-xl table-container border bg-card text-card-foreground shadow">
            <div className="button-container align-middle content-center">
              <h1 className="pb-[20px]">Reservations</h1>
              <div className="add-new-button-container">
                <div className="add-button-container circular-styled-container">
                  <Link
                    href="/dashboard/reservations/create"
                    className="circular-styled-button p-4 -my-6 border-2 border-[var(--dark-button)] bg-[var(--dark-button)] rounded-md text-[var(--light)] cursor-pointer hover:bg-[var(--contrast)] hover:text-[var(--dark-button)] hover:border-[var(--contrast)]"
                  >
                    Add New
                  </Link>
                </div>
              </div>
            </div>
            <ReservationsTable
              bookings={convertBookingIntoTableData(bookings)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
