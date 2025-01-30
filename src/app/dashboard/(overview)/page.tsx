import React from "react";
import "@/styles/global.css";
import { BedDouble, CircleSlash2, CalendarCheck2 } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

export default async function Page() {
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

      <div className="table-container">
        <Table>
          <TableHeader>
            <h1 className="pt-[10px] pb-[40px]">Tenants</h1>
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
          <TableRow>
            <TableCell>John E Doe.</TableCell>
            <TableCell>444</TableCell>
            <TableCell>14 Days</TableCell>
            <TableCell>Jan 01, 2025</TableCell>
            <TableCell>Jan 15, 2025</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>. . .</TableCell>
          </TableRow>
          <TableCaption>A list of your recent customers.</TableCaption>
        </Table>
      </div>
    </div>
  );
}
