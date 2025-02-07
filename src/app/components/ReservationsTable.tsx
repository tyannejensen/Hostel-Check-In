"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

interface ReservationTableProps {
  bookings: any[];
}

export default function ReservationsTable({ bookings }: ReservationTableProps) {
  const router = useRouter();
  function handleNavigateToReservationById(id: string) {
    router.push(`/dashboard/reservations/${id}`);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Room</TableHead>
          <TableHead>Check-In Date</TableHead>
          <TableHead>Check-Out Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((rowData: any, index: number) => {
          return (
            <TableRow
              key={index}
              className="table-data-row"
              onClick={() => handleNavigateToReservationById(rowData.id)}
            >
              <TableCell>{rowData.name}</TableCell>
              <TableCell>{rowData.room}</TableCell>
              <TableCell>{rowData.checkInDate}</TableCell>
              <TableCell>{rowData.checkOutDate}</TableCell>
              <TableCell className="cell-status-container">
                <div className={rowData.status + "-status cell-status"}>
                  {rowData.statusLabel}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
