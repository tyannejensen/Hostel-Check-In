"use client";
import React, { useEffect, useState } from "react";
import "@/styles/global.css";
import { Pencil, Plus, Ellipsis, Link, UserRoundPlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";
import { Button } from "react-day-picker";
import { DayPickerProvider, DayPicker } from "react-day-picker";
import { getTenantById } from "@/actions/tenant.actions";
import { mock } from "node:test";
import { IUser } from "@/lib/types/interfaces";
import { useParams } from "next/navigation";

// TODO: determine how to show an 'view' and 'edit' in the url e.g. /tenants/1/view or /tenants/1/edit
// TODO: how can we have the edit and view pages be the same but the URL change upon state change?

//remove this line after uncommenting the fetch request in the fetchTenants function
// const mockData = {
//   id: "1",
//   name: "John Doe",
//   email: "test@gmail.com",
//   dob: "01/01/1980",
//   phoneNumber: "444-444-4444",
//   address: "1234 Elm St",
//   city: "Springfield",
//   state: "IL",
//   zip: "62704",
//   reservationHistory: [
//     {
//       roomNumber: "444",
//       checkInDate: "Jan 01, 2025",
//       checkOutDate: "Jan 15, 2025",
//     },
//     {
//       roomNumber: "444",
//       checkInDate: "Jan 01, 2025",
//       checkOutDate: "Jan 15, 2025",
//     },
//     {
//       roomNumber: "444",
//       checkInDate: "Jan 01, 2025",
//       checkOutDate: "Jan 15, 2025",
//     },
//     {
//       roomNumber: "444",
//       checkInDate: "Jan 01, 2025",
//       checkOutDate: "Jan 15, 2025",
//     },
//     {
//       roomNumber: "444",
//       checkInDate: "Jan 01, 2025",
//       checkOutDate: "Jan 15, 2025",
//     },
//   ],
//   transactionHistory: [
//     {
//       paymentHistory: [
//         {
//           date: "01/01/2025",
//           amount: "$250.00",
//           type: "credit",
//         },
//       ],
//       notifications: [
//         {
//           date: "01/01/2025",
//           message: "Payment received",
//           user: "Luke Skywalker",
//         },
//       ],
//     },
//   ],
//   notes: [
//     {
//       comment: "Broke the blinds in room 444. Will need to replace.",
//       user: "Luke Skywalker",
//       date: "01/01/2025",
//     },
//     {
//       comment: "Broke the blinds in room 444. Will need to replace.",
//       user: "Luke Skywalker",
//       date: "01/01/2025",
//     },
//     {
//       comment: "Broke the blinds in room 444. Will need to replace.",
//       user: "Luke Skywalker",
//       date: "01/01/2025",
//     },
//     {
//       comment: "Broke the blinds in room 444. Will need to replace.",
//       user: "Luke Skywalker",
//       date: "01/01/2025",
//     },
//   ],
// };
// __________________ This code is to help with the ScrollArea component __________________
// const tags = Array.from({ length: 50 }).map(
//   (_, i, a) => `v1.2.0-beta.${a.length - i}`
// )

interface PhoneNumber {
  countryCode: string;
  number: string;
  isMobile: boolean;
  isPrimary: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

interface Room {
  roomNumber: string;
  id: string;
}

interface Note {
  content: string;
  createdBy: {
    firstName: string;
    lastName: string;
    id: string;
  };
  createdAt: string;
  updatedAt: string;
  id: string;
}

interface Booking {
  bookedBy: string;
  createdBy: string;
  roomId: Room;
  checkIn: string;
  checkOut: string;
  status: string;
  depositAmount: number;
  depositReturned: boolean;
  depositReturnAmount: number;
  payments: string[];
  notes: Note[];
  history: any[];
  createdAt: string;
  updatedAt: string;
  id: string;
}

interface Tenant {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumbers: PhoneNumber[];
  bookings: Booking[];
  paymentMethods: string[];
  tags: string[];
  createdBy: string;
  fullname: string;
  id: string;
}

const notes = [
  {
    content: "Broke the blinds in room 444. Will need to replace.",
    createdBy: {
      firstName: "Luke",
      lastName: "Skywalker",
      id: "1",
    },
    createdAt: "01/01/2025",
    updatedAt: "01/01/2025",
    id: "1",
  },
  {
    content: "Broke the blinds in room 444. Will need to replace.",
    createdBy: {
      firstName: "Luke",
      lastName: "Skywalker",
      id: "1",
    },
    createdAt: "01/01/2025",
    updatedAt: "01/01/2025",
    id: "1",
  },
  {
    content: "Broke the blinds in room 444. Will need to replace.",
    createdBy: {
      firstName: "Luke",
      lastName: "Skywalker",
      id: "1",
    },
    createdAt: "01/01/2025",
    updatedAt: "01/01/2025",
    id: "1",
  },
  {
    content: "Broke the blinds in room 444. Will need to replace.",
    createdBy: {
      firstName: "Luke",
      lastName: "Skywalker",
      id: "1",
    },
    createdAt: "01/01/2025",
    updatedAt: "01/01/2025",
    id: "1",
  },
];

export default function Page() {
  const { id } = useParams();
  // console.log(id); for debugging
  // const notes = tenant.bookings.flatMap((booking: any) => booking.notes);
  const [tenant, setTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        console.log(id);
        const tenantDetails: any = await getTenantById(id ?? "");
        console.log(tenantDetails);
        // Mock data for now

        // Simulate network delay
        setTenant(tenantDetails);
      } catch (error: any) {
        // setError(error.message);
      } finally {
        // setLoading(false);
      }
    };

    fetchTenant();
  }, [id]);
  // console.log(notes); for debugging

  // mockData.reservationHistory = tenant.bookings.map((booking: any) => {
  //   return {
  //     roomNumber: booking.roomId.roomNumber,
  //     checkInDate: booking.checkIn,
  //     checkOutDate: booking.checkOut,
  //   };
  // });

  // const fetchTenant = async (): Promise<any> => {
  //   let result = null;
  //   // TODO: replace with actual fetch request
  //   // result = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then((res) => res.json());
  //   // mock return data

  //   // After uncommenting the above code delete this result assignment
  //   result = new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve(mockData);
  //     }, 200);
  //   }).then((data) => {
  //     return data;
  //   });

  //   return result;
  // };

  // TODO: create function to fetch the a tenant by id -> add function to data.ts file
  // const tenant = await getTenantById(id)

  return (
    <>
      {tenant ? (
        // if tenant exists show the tenant details
        <div className="text-[var(--text)] p-[30px]">
          <div className="rounded-md border bg-card text-card-foreground shadow p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-[var(--dark-button)] font-bold">
                  {tenant.fullname}
                </h1>
                {/* <p>{tenant.email}</p>
                <p>
                  {tenant?.phoneNumbers?.find((phone: any) => phone.isPrimary)
                    ?.number ?? "N/A"}
                </p> */}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card className="bg-[var(--highlight)] rounded-md border p-4">
                <CardTitle className="flex flex-row items-center justify-between">
                  <div className="flex justify-between items-center pb-3 w-full">
                    <p className="font-bold text-[var(--text)]">DETAILS</p>
                    <Pencil className="text-[var(--text)]" />
                  </div>
                </CardTitle>
                <ScrollArea className="h-[200px] bg-[var(--light)] rounded-md border p-4">
                  <CardContent>
                    <div className="p-1">
                      <div className="flex flex-row pb-4 ">
                        <h2 className="text-[var(--text)] font-bold pr-12">
                          Email:
                        </h2>
                        <div>
                          <p className="pl-[50px] text-[var(--dark-button)]">
                            {tenant.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-1">
                      <div className="flex flex-row pb-4 ">
                        <h2 className="text-[var(--text)] font-bold pr-12">
                          Phone:
                        </h2>
                        <div>
                          <div className="pl-[50px] text-[var(--dark-button)]">
                            <p>
                              {tenant?.phoneNumbers?.find(
                                (phone: any) => phone.isPrimary
                              )?.number ?? "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* <div className="flex flex-row pb-4">
                        <h2 className="font-bold pr-14 text-[var(--text)]">
                          DOB:
                        </h2>
                        <div>
                          <p className="pl-[50px] text-[var(--dark-button)]">
                            {tenant.dob || "N/A"}
                          </p>
                        </div>
                      </div> */}
                      {/* <div className="flex flex-row pb-4">
                        <h2 className="font-bold text-[var(--text)] pr-8">
                          Address:
                        </h2>
                        <div>
                          <p className="pl-[50px] text-[var(--dark-button)]">
                            {tenant.address}
                          </p>
                          <div>
                            <p className="pl-[50px] text-[var(--dark-button)]">
                              {`${tenant.city}, ${tenant.state}`}
                            </p>
                            <p className="pl-[50px] text-[var(--dark-button)]">
                              {tenant.zip}
                            </p>
                          </div>
                        </div>
                        <Separator className="my-2" />
                      </div> */}
                    </div>
                  </CardContent>
                </ScrollArea>
              </Card>

              <Card className="bg-[var(--dark-button)] rounded-md border p-4">
                <CardTitle className="flex flex-row items-center justify-between">
                  <div className="flex justify-between items-center pb-3 w-full">
                    <p className="font-bold text-[var(--light)]">NOTES</p>
                    <Plus className="text-[var(--light)]" />
                  </div>
                </CardTitle>
                <ScrollArea className="h-[200px] bg-[var(--light)] rounded-md border p-4">
                  <CardContent>
                    {notes && notes.length > 0 ? (
                      notes.map((notes: any, index: number) => {
                        return (
                          <div className="p-4 w-full mx-20" key={index}>
                            <div className="-ml-[100px] text-[var(--text)] mr-[100px]">
                              {` "${notes.content}" `}
                              <div>
                                <p className="text-wrap text-[var(--dark-button)] text-end text-sm">{`${notes.createdBy.firstName} ${notes.createdBy.lastName}- ${notes.createdAt}`}</p>
                              </div>
                            </div>
                            <Separator className="my-2" />
                          </div>
                        );
                      })
                    ) : (
                      <div>
                        <p>No notes found</p>
                      </div>
                    )}
                  </CardContent>
                </ScrollArea>
              </Card>
            </div>{" "}
            <div className="grid grid-cols-1 gap-6 mt-6">
              <Card className="bg-[var(--dark-button)] rounded-md border p-4">
                <CardTitle className="flex flex-row items-center justify-between">
                  <div className="flex justify-between items-center pb-3 w-full">
                    <p className="font-bold text-[var(--light)]">
                      RESERVATION HISTORY
                    </p>
                  </div>
                </CardTitle>
                <ScrollArea className="h-[200px] bg-[var(--light)] text-[var(--text)] rounded-md border p-4">
                  <CardContent>
                    {tenant.bookings && tenant.bookings.length > 0 ? (
                      tenant.bookings.map((booking: any, index: number) => {
                        return (
                          <div className="p-1" key={index}>
                            <div>
                              <div className="border rounded-md p-2 -ml-4 -mr-4 text-start text-wrap">
                                {`${tenant.fullname} stayed in Room #${booking.roomId.roomNumber} 
                                from ${booking.checkIn} to ${booking.checkOut}`}
                              </div>
                            </div>
                            <Separator className="my-2" />
                          </div>
                        );
                      })
                    ) : (
                      <div>
                        <p>No reservations found</p>
                      </div>
                    )}
                  </CardContent>
                </ScrollArea>
              </Card>

              <Card className="min-w-3xs bg-[var(--highlight)] rounded-md border p-4">
                <CardTitle className="flex flex-wrap flex-row items-center justify-between">
                  <div className="flex justify-between items-center pb-3 w-full">
                    <p className="font-bold">TRANSACTION HISTORY</p>
                  </div>
                </CardTitle>
                <ScrollArea className="h-[200px] bg-[var(--light)] rounded-md border p-4">
                  <CardContent>
                    {tenant.bookings && tenant.bookings.length > 0 ? (
                      tenant.bookings.map((booking: any, index: number) => {
                        return (
                          <div key={index}>
                            <div className="flex flex-wrap items-center border rounded-md space-x-4">
                              <Skeleton className="h-12 w-12 dark-circle rounded-full" />
                              <div className="-mt-5 pr-5 mb-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                                {`${tenant.fullname} stayed in Room #${booking.roomId.roomNumber} 
                                from ${booking.checkIn} to ${booking.checkOut}`}
                              </div>
                              <div className="flex flex-wrap absolute right-20">
                                <Ellipsis />
                              </div>
                            </div>
                            <Separator className="my-2" />
                          </div>
                        );
                      })
                    ) : (
                      <div>
                        <p>No Transactions Found</p>
                      </div>
                    )}
                  </CardContent>
                </ScrollArea>
              </Card>
            </div>
          </div>
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
