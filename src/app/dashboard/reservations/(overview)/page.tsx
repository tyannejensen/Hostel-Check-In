"use client"

import React, { useEffect, useState } from "react"
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
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-white to-violet-950 text-black font-sans">
      <Card className="w-[800px] p-6 rounded-lg shadow-lg bg-white text-black text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">Registrations Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <h2 className="text-2xl font-semibold">Registered Guests</h2>
          {registrations.map((registration) => (
            <div key={registration.id}>
              <p><strong>Name:</strong> {registration.name}</p>
              <p><strong>Room:</strong> {registration.room}</p>
              <p><strong>Check-in Date:</strong> {registration.checkInDate}</p>
              <p><strong>Check-out Date:</strong> {registration.checkOutDate}</p>
              <p><strong>Status:</strong> {registration.status}</p>
            </div>
          ))}
          <h2 className="text-2xl font-semibold">Empty Rooms</h2>
          {rooms.filter(room => room.isEmpty).map((room) => (
            <div key={room.roomNumber}>
              <p><strong>Room Number:</strong> {room.roomNumber}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}