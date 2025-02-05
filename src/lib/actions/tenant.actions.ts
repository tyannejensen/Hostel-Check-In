"use server"

import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/index";
import path from "path";

// GET DATA

export async function getTenants() {
  await dbConnect();

  const tenants = await User.find({ role: "tenant" })
    .select("_id firstName lastName fullName email phoneNumbers bookings paymentMethods tags createdBy")
    .populate({
      path: "bookings",
      populate: {
        path: "roomId",
        select: "roomNumber",
      },
    })
    .populate("fullname");

  const tenantsAsObj = tenants.map((tenant: any) =>
    tenant.toObject()
  );

  // Ensure final data is fully JSON-serializable
  return tenantsAsObj;
}

export async function getTenantById(id: string) {
  await dbConnect();

  const tenant = await User.findById({ _id: id, role: "tenant" })
    .populate("firstName", "lastName")
    .populate("email", "phoneNumbers")
    .populate("paymentMethods", "createdAt")
    .populate("tags", "history")
    .populate("createdBy", "updatedBy")
    .populate("notes")
    .populate({
      path: "bookings",
      populate: [
        {
          path: "roomId",
          select: "roomNumber",
        },
        {
          path: "notes",
          select: "content createdBy createdAt",
        },
      ],
    })
    .select("_id firstName lastName email phoneNumbers bookings paymentMethods tags createdBy");


  const tenantObj = tenant.toObject();
  return tenantObj;
}