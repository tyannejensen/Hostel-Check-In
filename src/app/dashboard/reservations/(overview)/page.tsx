//Rebuilt with stylng and error handling
"use client"

import React, { useEffect, useState } from "react"
import "@/styles/global.css"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Registration {
  id: string
  name: string
  room: string
  checkInDate: string
  checkOutDate: string
  status: string
}

interface Room {
  roomNumber: string
  isEmpty: boolean
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch("/api/registrations")
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data: { registrations: Registration[], rooms: Room[] } = await response.json()
        setRegistrations(data.registrations)
        setRooms(data.rooms)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRegistrations()
  }, [])

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

  return (
    <>
      <div className="page">
        <div className="w-full">
          <h1 className="pt-[10px] pl-[30px] font-bold">DASHBOARD</h1>

          <div className="rounded-xl table-container border bg-card text-card-foreground shadow">
            <div className="button-container align-middle content-center">
              <h1 className="pb-[20px]">Registrations</h1>
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
                  <TableHead>Room</TableHead>
                  <TableHead>Check-In Date</TableHead>
                  <TableHead>Check-Out Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((rowData: Registration, index: number) => {
                  return (
                    <TableRow key={index} className="table-data-row">
                      <TableCell>{rowData.name}</TableCell>
                      <TableCell>{rowData.room}</TableCell>
                      <TableCell>{rowData.checkInDate}</TableCell>
                      <TableCell>{rowData.checkOutDate}</TableCell>
                      <TableCell className="cell-status-container">
                        <div className={rowData.status + "-status cell-status"}>
                          {rowData.status}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  )
}

// Basic Structure
// "use client"

// import React, { useEffect, useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// interface Registration {
//   id: string
//   name: string
//   room: string
//   checkInDate: string
//   checkOutDate: string
//   status: string
// }

// interface Room {
//   roomNumber: string
//   isEmpty: boolean
// }

// export default function RegistrationsPage() {
//   const [registrations, setRegistrations] = useState<Registration[]>([])
//   const [rooms, setRooms] = useState<Room[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchRegistrations = async () => {
//       try {
//         const response = await fetch("/api/registrations")
//         if (!response.ok) {
//           throw new Error("Network response was not ok")
//         }
//         const data: { registrations: Registration[], rooms: Room[] } = await response.json()
//         setRegistrations(data.registrations)
//         setRooms(data.rooms)
//       } catch (error: any) {
//         setError(error.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchRegistrations()
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
//           <CardTitle className="text-3xl font-semibold">Registrations Overview</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <h2 className="text-2xl font-semibold">Registered Guests</h2>
//           {registrations.map((registration) => (
//             <div key={registration.id}>
//               <p><strong>Name:</strong> {registration.name}</p>
//               <p><strong>Room:</strong> {registration.room}</p>
//               <p><strong>Check-in Date:</strong> {registration.checkInDate}</p>
//               <p><strong>Check-out Date:</strong> {registration.checkOutDate}</p>
//               <p><strong>Status:</strong> {registration.status}</p>
//             </div>
//           ))}
//           <h2 className="text-2xl font-semibold">Empty Rooms</h2>
//           {rooms.filter(room => room.isEmpty).map((room) => (
//             <div key={room.roomNumber}>
//               <p><strong>Room Number:</strong> {room.roomNumber}</p>
//             </div>
//           ))}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }