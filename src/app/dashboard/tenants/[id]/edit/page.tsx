"use server";
import React from "react";

import "@/styles/global.css";

import TenantForm from "@/components/TenantForm";
import {
  getTenantById,
  saveTenant,
  updateTenant,
} from "@/actions/tenant.actions";
import { notFound, redirect, useParams } from "next/navigation";

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

export default async function Page({ params }: any) {
  const { id } = await params;
  const tenant = await getTenantById(id);

  const formValues = {
    firstName: tenant.firstName,
    lastName: tenant.lastName,
    email: tenant.email,
    phone: tenant.phoneNumbers[0].number,
    addressLineOne: tenant.billingAddress.addressLineOne,
    addressLineTwo: tenant.billingAddress.addressLineTwo,
    birthdate: new Date(tenant.birthdate).toISOString().split("T")[0], // yyyy-MM-dd format
    city: tenant.billingAddress.city,
    state: tenant.billingAddress.state,
    zip: tenant.billingAddress.postalCode,
  };

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
    values.tenantId = tenant.id;
    // Save the tenant to the database
    const response = await updateTenant(values);
    if (response.error) {
      throw new Error(response.message);
    } else {
      redirect(`/dashboard/tenants/${tenant.id}`);
      // Handle successful tenant creation (e.g., redirect to tenant list)
    }
  }

  return (
    <>
      {tenant ? (
        <TenantForm
          title={"UPDATE TENANT"}
          defaultValues={formValues}
          handleOnSubmit={handleFormSubmit}
        />
      ) : (
        notFound()
      )}
    </>
  );
}
