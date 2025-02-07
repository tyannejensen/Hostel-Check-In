"use server";
import React from "react";

import "@/styles/global.css";

import TenantForm from "@/components/TenantForm";
import { saveTenant } from "@/actions/tenant.actions";
import { redirect } from "next/navigation";

interface PhoneNumber {
  countryCode: string;
  number: string;
  isMobile: boolean;
  isPrimary: boolean;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
}

export default async function Page() {
  function formatPhoneNumber(phoneNumber: string): PhoneNumber {
    return {
      countryCode: phoneNumber.slice(0, 3),
      number: phoneNumber,
      isMobile: true,
      isPrimary: true,
    };
  }

  async function handleFormSubmit(values: any) {
    "use server";

    // values.phone = formatPhoneNumber(values.phone);
    values.password = "password";
    // Save the tenant to the database
    console.log(values);
    const response = await saveTenant(values);
    if (response.error) {
      throw new Error(response.message);
    } else {
      redirect("/dashboard/tenants");
      // Handle successful tenant creation (e.g., redirect to tenant list)
    }
  }

  return (
    <>
      <TenantForm title="ADD TENANT" handleOnSubmit={handleFormSubmit} />
    </>
  );
}
