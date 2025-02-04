"use client";

import React from "react";
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

export default function Page() {
  const data = [
    {
      name: "Jane Doe",
      phone: "123-456-7890",
      email: "jane.doe@example.com",
      balanceDue: "$200",
    },
    {
      name: "John Smith",
      phone: "987-654-3210",
      email: "john.smith@example.com",
      balanceDue: "$150",
    },
    {
      name: "Alice Johnson",
      phone: "555-555-5555",
      email: "alice.johnson@example.com",
      balanceDue: "$0",
    },
    {
      name: "Bob Brown",
      phone: "444-444-4444",
      email: "bob.brown@example.com",
      balanceDue: "$300",
    },
  ];

  return (
    <>
      <div className="page">
        <div className="w-full">
          <h1 className="pt-[10px] pl-[30px] font-bold">DASHBOARD</h1>

          <div className="rounded-xl table-container border bg-card text-card-foreground shadow">
            <div className="button-container align-middle content-center">
              <h1 className="pb-[20px]">Tenants</h1>
              <div className="add-new-button-container">
                <div className="add-button-container circular-styled-container">
                  <Button className="circular-styled-button p-4 -my-6 border-2 border-[var(--dark-button)] bg-[var(--dark-button)] rounded-lg text-[var(--light)] cursor-pointer hover:bg-[var(--contrast)] hover:text-[var(--dark-button)] hover:border-[var(--contrast)]">
                    Add New
                  </Button>
                </div>
              </div>
            </div>
            <Table>
              <TableHeader className="table-row-header">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Balance Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((rowData: any, index: number) => {
                  return (
                    <TableRow key={index} className="table-data-row">
                      <TableCell>{rowData.name}</TableCell>
                      <TableCell>{rowData.phone}</TableCell>
                      <TableCell>{rowData.email}</TableCell>
                      <TableCell>{rowData.balanceDue}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}

// "use client"

// import React, { useEffect, useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// interface Tenant {
//   id: string
//   name: string
//   phone: string
//   email: string
//   balanceDue: string
// }

// export default function TenantsPage() {
//   const [tenants, setTenants] = useState<Tenant[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchTenants = async () => {
//       try {
//         const response = await fetch("/api/tenants")
//         if (!response.ok) {
//           throw new Error("Network response was not ok")
//         }
//         const data: Tenant[] = await response.json()
//         setTenants(data)
//       } catch (error: any) {
//         setError(error.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchTenants()
//   }, [])

//   if (loading) {
//     return <div>Loading...</div>
//   }

//   if (error) {
//     return (
//       <div>
//         <h1>Error</h1>
//         <p>{error}</p>
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-white to-violet-950 text-black font-sans">
//       <Card className="w-[800px] p-6 rounded-lg shadow-lg bg-white text-black text-center">
//         <CardHeader>
//           <CardTitle className="text-3xl font-semibold">Tenants Overview</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {tenants.map((tenant) => (
//             <div key={tenant.id}>
//               <p><strong>Name:</strong> {tenant.name}</p>
//               <p><strong>Phone:</strong> {tenant.phone}</p>
//               <p><strong>Email:</strong> {tenant.email}</p>
//               <p><strong>Balance Due:</strong> {tenant.balanceDue}</p>
//             </div>
//           ))}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }