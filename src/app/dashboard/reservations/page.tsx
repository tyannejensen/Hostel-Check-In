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

export default async function Page() {
  const bookings = await getBookings();

  console.log(bookings);
  const data = [
    {
      name: "John E Doe.",
      room: "444",
      checkInDate: "Jan 01, 2025",
      checkOutDate: "Jan 15, 2025",
      status: "paid",
      statusLabel: "Paid",
    },
    {
      name: "John E Doe.",
      room: "444",
      checkInDate: "Jan 01, 2025",
      checkOutDate: "Jan 15, 2025",
      status: "paid",
      statusLabel: "Paid",
    },
    {
      name: "John E Doe.",
      room: "444",
      checkInDate: "Jan 01, 2025",
      checkOutDate: "Jan 15, 2025",
      status: "not-paid",
      statusLabel: "Not Paid",
    },
    {
      name: "John E Doe.",
      room: "444",
      checkInDate: "Jan 01, 2025",
      checkOutDate: "Jan 15, 2025",
      status: "paid",
      statusLabel: "Paid",
    },
  ];

  const statusMap: { [key in "paid" | "not-paid" | "pending"]: string } = {
    paid: "Paid",
    "not-paid": "Not Paid",
    pending: "Pending",
  };

  function convertBookingIntoTableData(bookings: any) {
    return bookings.map((booking: any) => {
      return {
        name: booking.bookedBy.fullname,
        room: booking.roomId,
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
            <Table>
              <TableHeader className="table-row-header">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Check-In Date</TableHead>
                  <TableHead>Check-Out Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {convertBookingIntoTableData(bookings).map(
                  (rowData: any, index: number) => {
                    return (
                      <TableRow key={index} className="table-data-row">
                        <TableCell>{rowData.name}</TableCell>
                        <TableCell>{rowData.room}</TableCell>
                        <TableCell>{rowData.checkInDate}</TableCell>
                        <TableCell>{rowData.checkOutDate}</TableCell>
                        <TableCell className="cell-status-container">
                          <div
                            className={rowData.status + "-status cell-status"}
                          >
                            {rowData.statusLabel}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
