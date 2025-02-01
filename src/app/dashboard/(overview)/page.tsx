import React, { use, useEffect } from "react";
import "@/styles/global.css";
import { BedDouble, CircleSlash2, CalendarCheck2 } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

export default async function Page() {
  const data = [
    {
      name: "John E Doe.",
      room: "444",
      duration: "14 Days",
      checkInDate: "Jan 01, 2025",
      checkOutDate: "Jan 15, 2025",
      notes: "$250.00",
    },
    {
      name: "John E Doe.",
      room: "444",
      duration: "14 Days",
      checkInDate: "Jan 01, 2025",
      checkOutDate: "Jan 15, 2025",
      notes: "$250.00",
    },
    {
      name: "John E Doe.",
      room: "444",
      duration: "14 Days",
      checkInDate: "Jan 01, 2025",
      checkOutDate: "Jan 15, 2025",
      notes: "$250.00",
    },
    {
      name: "John E Doe.",
      room: "444",
      duration: "14 Days",
      checkInDate: "Jan 01, 2025",
      checkOutDate: "Jan 15, 2025",
      notes: "$250.00",
    },
    {
      name: "John E Doe.",
      room: "444",
      duration: "14 Days",
      checkInDate: "Jan 01, 2025",
      checkOutDate: "Jan 15, 2025",
      notes: "$250.00",
    },
  ];

  return (
    <div>
      <h1 className="pt-[10px] pl-[30px] pb-[40px] font-bold">DASHBOARD</h1>
      <div className="card-container">
        <Card className="card">
          <CardTitle>
            <div className="card-decoration-dark flex items-center justify-center">
              <BedDouble className="icon-light" />
            </div>
          </CardTitle>
          <CardContent>
            <div>
              <div>
                <h3>Occupied Rooms</h3>
                <h1 className="text-[42px]">12</h1>
              </div>
              <div className="progress"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardTitle>
            <div className="card-decoration-light flex items-center justify-center">
              <CircleSlash2 className="icon-dark" />
            </div>
          </CardTitle>
          <CardContent>
            <div>
              <div>
                <h3>Vacant Rooms</h3>
                <h1 className="text-[42px]">44</h1>
              </div>
              <div className="progress"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardTitle>
            <div className="card-decoration-dark flex items-center justify-center">
              <CalendarCheck2 className="icon-light" />
            </div>
          </CardTitle>
          <CardContent>
            <div>
              <div>
                <h3>Rooms to Check-Out</h3>
                <h1 className="text-[42px]">5</h1>
              </div>
              <div className="progress"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl table-container border bg-card text-card-foreground shadow">
        <h1 className="pt-[10px] pb-[40px]">Tenants</h1>
        <Table>
          <TableHeader className="table-row-header">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Check-In Date</TableHead>
              <TableHead>Check-Out Date</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((rowData: any, index: number) => {
              return (
                <TableRow key={index} className="table-data-row">
                  <TableCell>{rowData.name}</TableCell>
                  <TableCell>{rowData.room}</TableCell>
                  <TableCell>{rowData.duration}</TableCell>
                  <TableCell>{rowData.checkInDate}</TableCell>
                  <TableCell>{rowData.checkOutDate}</TableCell>
                  <TableCell>{rowData.notes}</TableCell>
                  <TableCell>. . .</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableCaption>A list of your recent customers.</TableCaption>
        </Table>
      </div>
    </div>
  );
}
