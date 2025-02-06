"use server";

import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/index";
import path from "path";

// GET DATA

export async function getTenants() {
  await dbConnect();

  const tenants = await User.find({ role: "tenant" })
    .select(
      "_id firstName lastName fullName email phoneNumbers bookings paymentMethods tags createdBy"
    )
    .populate({
      path: "bookings",
      populate: {
        path: "roomId",
        select: "roomNumber",
      },
    })
    .populate("fullname");

  const tenantsAsObj = tenants.map((tenant: any) => tenant.toObject());

  // Ensure final data is fully JSON-serializable
  return tenantsAsObj;
}

export async function getTenantById(id: string | string[]) {
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
    .select(
      "_id firstName lastName fullName email phoneNumbers bookings paymentMethods tags createdBy"
    );

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  const tenantObj = JSON.parse(JSON.stringify(tenant.toObject()));
  return tenantObj;
}

// SET DATA

//save tenant as a user

export async function saveTenant(payload: any) {
  await dbConnect();

  const firstName = payload.firstName;
  const lastName = payload.lastName;
  const email = payload.email;
  const password = payload.password;
  const phoneNumbers = payload.phone;
  const address = payload.address;
  const city = payload.city;
  const state = payload.state;
  const zip = payload.zip;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phoneNumbers ||
    !address ||
    !city ||
    !state ||
    !zip
  ) {
    return { error: true, message: "Please fill in all fields" };
  }

  try {
    // Check if a user with the same email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return { error: true, message: "Email already in use" };
    }

    // Check if a user with the same first and last name already exists
    const existingUserByName = await User.findOne({ firstName, lastName });
    if (existingUserByName) {
      return {
        error: true,
        message: "User with the same first and last name already exists",
      };
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      phoneNumbers: [{ number: phoneNumbers, isPrimary: true }],
      address,
      city,
      state,
      zip,
      role: "tenant",
    });

    console.log("Saving new user:", newUser);

    await newUser.save();

    console.log("User saved successfully");

    return { error: false, message: "Tenant created successfully" };
  } catch (error) {
    console.error("Error saving user:", error);
    return { error: true, message: (error as Error).message };
  }
}
