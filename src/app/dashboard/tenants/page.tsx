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
import { getTenants } from "@/actions/tenant.actions";
import TenantsTable from "@/components/TenantsTable";

export default async function Page() {
  const tenants = await getTenants();

  function convertTenantIntoTableData(tenants: any) {
    return tenants.reverse().map((tenant: any) => {
      return {
        id: tenant.id,
        name: tenant.fullname,
        phone: tenant.phoneNumbers.find((phone: any) => phone.isPrimary).number,
        email: tenant.email,
        balance: tenant.balance,
      };
    });
  }

  return (
    <>
      <div className="page">
        <div className="w-full">
          <h1 className="pt-[10px] pl-[30px] font-bold h-[47.5px]"></h1>

          <div className="rounded-xl table-container border bg-card text-card-foreground shadow">
            <div className="button-container align-middle content-center">
              <h1 className="pb-[20px]">Tenants</h1>
              <div className="add-new-button-container">
                <div className="add-button-container circular-styled-container">
                  <Link
                    href="/dashboard/tenants/create"
                    className="circular-styled-button p-4 -my-6 border-2 border-[var(--dark-button)] bg-[var(--dark-button)] rounded-md text-[var(--light)] cursor-pointer hover:bg-[var(--contrast)] hover:text-[var(--dark-button)] hover:border-[var(--contrast)]"
                  >
                    Add New
                  </Link>
                </div>
              </div>
            </div>
            <TenantsTable tenants={convertTenantIntoTableData(tenants)} />
          </div>
        </div>
      </div>
    </>
  );
}
