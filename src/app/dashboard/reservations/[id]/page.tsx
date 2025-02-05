"use client"

import React, { useEffect, useState } from "react"
import "@/styles/global.css"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useParams } from "next/navigation"
import { headers } from "next/headers"
import { addBookingAndPayments } from "@/actions/booking.actions"

// Define the Reservation interface
interface Reservation {
  id: string
  name: string
  phone: string
  email: string
  room: string
  checkInDate: string
  checkOutDate: string
  deposit: string
  totalCharge: string
  totalPaymentDue: string
  notes: string
  transactionHistory: { date: string, amount: string, description: string }[]
}

export default async function Page() {
  const { id } = useParams()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        // Mock data for now
        const mockData: Reservation = {
          id: "1",
          name: "John Doe",
          phone: "123-456-7890",
          email: "john.doe@example.com",
          room: "101",
          checkInDate: "2025-01-01",
          checkOutDate: "2025-01-15",
          deposit: "$100",
          totalCharge: "$500",
          totalPaymentDue: "$400",
          notes: "No special requests.",
          transactionHistory: [
            { date: "2025-01-01", amount: "$100", description: "Deposit" },
            { date: "2025-01-10", amount: "$200", description: "Partial Payment" },
          ],
        }
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setReservation(mockData)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReservation()
  }, [id])

  const handleAddBookingAndPayment = async () => {
    try {
      const reqHeaders = await headers()
      const userId = reqHeaders.get("x-user-id")
      const data = {
        // Add necessary data here
        date: new Date().toISOString(),
        reservationId: id,
      }
      const booking = await addBookingAndPayments(data, userId)
      console.log("Booking and payment added:", booking)
    } catch (error) {
      console.error("Error adding booking and payment:", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    )
  }

  if (!reservation) {
    return <div>No reservation found</div>
  }

  return (
    <div className="page">
      <div className="w-full">
        <h1 className="pt-[10px] pl-[30px] font-bold">DASHBOARD</h1>

        <Card className="min-w-3xs bg-[var(--highlight)] rounded-md border p-4">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold">Reservation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-xl">{reservation.name}</p>
                <p>{reservation.phone}</p>
                <p>{reservation.email}</p>
                <p>Reservation ID: {reservation.id}</p>
              </div>
              <div className="flex space-x-4">
                <Button onClick={handleAddBookingAndPayment}>Check-out</Button>
                <Button>Extend Stay</Button>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex">
              <div className="w-1/2 p-4 border rounded-md">
                <p><strong>Room:</strong> {reservation.room}</p>
                <p><strong>Check-In Date:</strong> {reservation.checkInDate}</p>
                <p><strong>Check-Out Date:</strong> {reservation.checkOutDate}</p>
                <p><strong>Deposit:</strong> {reservation.deposit}</p>
                <p><strong>Total Charge:</strong> {reservation.totalCharge}</p>
                <p><strong>Total Payment Due:</strong> {reservation.totalPaymentDue}</p>
              </div>
              <div className="w-1/2 p-4 border rounded-md ml-4">
                <p><strong>Notes:</strong></p>
                <p>{reservation.notes}</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <h2 className="text-xl font-bold">Transaction History</h2>
              <ScrollArea className="h-[200px] bg-[var(--light)] rounded-md border p-4">
                {reservation.transactionHistory.map((transaction, index) => (
                  <div key={index} className="flex justify-between items-center border-b py-2">
                    <p>{transaction.date}</p>
                    <p>{transaction.amount}</p>
                    <p>{transaction.description}</p>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// // import { getTenantById } from "@/lib/data";

// // TODO: determine how to show an 'view' and 'edit' in the url e.g. /tenants/1/view or /tenants/1/edit
// // TODO: how can we have the edit and view pages be the same but the URL change upon state change?

// //remove this line after uncommenting the fetch request in the fetchTenants function
// const mockData = {
//   id: "1",
//   name: "John Doe",
//   email: "test@gmail.com",
// };

// export default async function Page(props: { params: Promise<{ id: string }> }) {
//   const params = await props.params;
//   const id = params.id;

//   const fetchReservation = async (): Promise<any> => {
//     let result = null;
//     // TODO: replace with actual fetch request
//     // result = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then((res) => res.json());
//     // mock return data

//     // After uncommenting the above code delete this result assignment
//     result = new Promise((resolve) => {
//       setTimeout(() => {
//         resolve(mockData);
//       }, 200);
//     }).then((data) => {
//       return data;
//     });

//     return result;
//   };

//   const tenant = await fetchReservation();

//   // TODO: create function to fetch the a tenant by id -> add function to data.ts file
//   // const tenant = await getTenantById(id)

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