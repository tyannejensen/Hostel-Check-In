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

  const tenant = await User.findOne({ _id: id, role: "tenant" })
    .populate("fullname")
    .populate("phoneNumbers")
    .populate({
      path: "bookings",
      populate: [
        {
          path: "roomId",
          select: "roomNumber",
        },
        {
          path: "notes",
          populate: {
            path: "createdBy",
            select: "firstName lastName",
          },
          select: "content createdBy createdAt",
          options: { strictPopulate: false },
        },
      ],
    })
    .select("_id firstName lastName fullName email phoneNumbers bookings paymentMethods tags createdBy");

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  const tenantObj = tenant.toObject({ getters: true, virtuals: false });
  return tenantObj;
}