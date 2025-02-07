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

interface TenantsTableProps {
  tenants: any[];
}

export default function TenantsTable({ tenants }: TenantsTableProps) {
  const router = useRouter();
  function handleNavigateToReservationByID(id: string) {
    router.push(`/dashboard/tenants/${id}`);
  }

  return (
    <Table>
      <TableHeader className="table-row-header">
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Phone #</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Balance Due</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenants.map((rowData: any, index: number) => {
          return (
            <TableRow
              key={index}
              className="table-data-row"
              onClick={() => handleNavigateToReservationByID(rowData.id)}
            >
              <TableCell>{rowData.name}</TableCell>
              <TableCell>{rowData.phone}</TableCell>
              <TableCell>{rowData.email}</TableCell>
              <TableCell>{rowData.balance || "$0.00"}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

//added the following code to the file
// remove anytypes and replace with the correct types
// export interface ITenant {
//   id: string;
//   name: string;
//   phone: string;
//   email: string;
//   balanceDue: string;
// }

// Test correct
// "use client";
// import React from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useRouter } from "next/navigation";
// import { ITenant } from "@/lib/types/interfaces/tenant.interface";

// interface TenantsTableProps {
//   tenants: ITenant[];
// }

// export default function TenantsTable({ tenants }: TenantsTableProps) {
//   const router = useRouter();

//   function handleNavigateToTenantByID(id: string) {
//     router.push(`/dashboard/tenants/${id}`);
//   }

//   return (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead>Name</TableHead>
//           <TableHead>Phone</TableHead>
//           <TableHead>Email</TableHead>
//           <TableHead>Balance Due</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {tenants.map((tenant: ITenant, index: number) => {
//           return (
//             <TableRow
//               key={index}
//               className="table-data-row"
//               onClick={() => handleNavigateToTenantByID(tenant.id)}
//             >
//               <TableCell>{tenant.name}</TableCell>
//               <TableCell>{tenant.phone}</TableCell>
//               <TableCell>{tenant.email}</TableCell>
//               <TableCell>{tenant.balanceDue}</TableCell>
//             </TableRow>
//           );
//         })}
//       </TableBody>
//     </Table>
//   );
// }