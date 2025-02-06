"use server";
import React from "react";
import { z } from "zod";
import "@/styles/global.css";

import { getTenants } from "@/actions/user.actions";
import { getRooms } from "@/actions/room.actions";
import { headers } from "next/headers";
import ReservationCreateForm from "@/components/ReservationCreateForm";
import { addBookingAndPayment } from "@/actions/booking.actions";
import { redirect, useRouter } from "next/navigation";
import { NextResponse } from "next/server";

export default async function Page() {
  const tenantsResponse = await getTenants();
  const roomsResponse = await getRooms();
  const reqHeaders = headers();
  const userId = (await reqHeaders).get("x-user-id");
  const url = (await reqHeaders).get("refferer");
  const tenants = Array.isArray(tenantsResponse) ? tenantsResponse : [];
  const rooms = Array.isArray(roomsResponse) ? roomsResponse : [];

  const convertedTenants = tenants.map((tenant) => {
    return {
      value: tenant.id,
      label: tenant.fullname,
    };
  });

  const convertedRooms = rooms.map((room) => {
    return {
      value: room.id,
      label: room.roomNumber,
    };
  });

  async function handleFormSubmit(values: any) {
    "use server";

    console.log(values);
    if (userId) {
      const result = await addBookingAndPayment(values, userId);
      // redirect back to reservations page if successful
      redirect("/dashboard/reservations");
    } else {
      console.error("User ID not found.");
    }
  }

  return (
    <>
      <ReservationCreateForm
        tenants={convertedTenants}
        rooms={convertedRooms}
        userId={userId}
        handleOnSubmit={handleFormSubmit}
      />
    </>
  );
}
