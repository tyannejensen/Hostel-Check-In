"use client";
// import { getTenantById } from "@/lib/data";
import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useParams } from "next/navigation"

// TODO: determine how to show an 'view' and 'edit' in the url e.g. /tenants/1/view or /tenants/1/edit
// TODO: how can we have the edit and view pages be the same but the URL change upon state change?

//remove this line after uncommenting the fetch request in the fetchTenants function
const mockData = {
  id: "1",
  name: "John Doe",
  email: "test@gmail.com",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const fetchReservation = async (): Promise<any> => {
    let result = null;
    // TODO: replace with actual fetch request
    // result = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then((res) => res.json());
    // mock return data

    // After uncommenting the above code delete this result assignment
    result = new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData);
      }, 200);
    }).then((data) => {
      return data;
    });

    return result;
  };

  const tenant = await fetchReservation();

  // TODO: create function to fetch the a tenant by id -> add function to data.ts file
  // const tenant = await getTenantById(id)

  return (
    <>
      {tenant ? (
        // if tenant exists show the tenant details
        <div>
          <h1>{tenant.name}</h1>
          <p>{tenant.email}</p>
        </div>
      ) : (
        // if tenant does not exist show a not found message
        <div>
          <h1>Not Found</h1>
          <p>Could not find tenant with id: {id}</p>
        </div>
      )}
    </>
  );
}





// Test code 2. Adjustments needed!
// const mockData = {
//   id: "1",
//   name: "John Doe",
//   email: "test@gmail.com",
//   room: "101",
//   checkInDate: "Jan 01, 2025",
//   checkOutDate: "Jan 15, 2025",
//   status: "paid",
// }

// // Adjusted export function to remove async from the function declaration
// // export default async function Page(props: { params: Promise<{ id: string }> }) {
// //   const params = await props.params;
// //   const id = params.id;

// export default function Page() {
//   const { id } = useParams()
//   const [reservation, setReservation] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const fetchReservation = async () => {
//       try {
//         // Uncomment and use the actual fetch request
//         const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await response.json();
//         setReservation(data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReservation();
//   }, [id]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div>
//         <h1>Error</h1>
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       {reservation ? (
//         // if reservation exists show the reservation details
//         <Card>
//           <CardHeader>
//             <CardTitle>{reservation.name}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <CardDescription>Email: {reservation.email}</CardDescription>
//             <CardDescription>Room: {reservation.room}</CardDescription>
//             <CardDescription>Check-in Date: {reservation.checkInDate}</CardDescription>
//             <CardDescription>Check-out Date: {reservation.checkOutDate}</CardDescription>
//             <CardDescription>Status: {reservation.status}</CardDescription>
//           </CardContent>
//         </Card>
//       ) : (
//         // if reservation does not exist show a not found message
//         <div>
//           <h1>Not Found</h1>
//           <p>Could not find reservation with id: {id}</p>
//         </div>
//       )}
//     </>
//   );


// Tested code 1. Adjustments needed!
// import { useState, useEffect } from "react";

// // TODO: determine how to show an 'view' and 'edit' in the url e.g. /tenants/1/view or /tenants/1/edit
// // TODO: how can we have the edit and view pages be the same but the URL change upon state change?

// //remove this line after uncommenting the fetch request in the fetchTenants function
// const mockData = {
//   id: "1",
//   name: "John Doe",
//   email: "test@gmail.com",
// };

// export default function Page(props: { params: { id: string } }) {
//   const { id } = props.params;
//   const [tenant, setTenant] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchReservation = async (): Promise<void> => {
//       try {
//         // Uncomment and use the actual fetch request
//         const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await response.json();
//         setTenant(data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReservation();
//   }, [id]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div>
//         <h1>Error</h1>
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       {tenant ? (
//         // if tenant exists show the tenant details
//         <div>
//           <h1>{tenant.name}</h1>
//           <p>{tenant.email}</p>
//         </div>
//       ) : (
//         // if tenant does not exist show a not found message
//         <div>
//           <h1>Not Found</h1>
//           <p>Could not find tenant with id: {id}</p>
//         </div>
//       )}
//     </>
//   );
// }