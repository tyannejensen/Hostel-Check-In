// import { getTenantById } from "@/lib/data";
import React from "react";
import "@/styles/global.css";
import {
  BedDouble,
  CircleSlash2,
  CalendarCheck2,
  Pencil,
  Plus,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { noSSR } from "next/dynamic";
import { before } from "node:test";
import { Separator } from "@radix-ui/react-separator";

// TODO: determine how to show an 'view' and 'edit' in the url e.g. /tenants/1/view or /tenants/1/edit
// TODO: how can we have the edit and view pages be the same but the URL change upon state change?

//remove this line after uncommenting the fetch request in the fetchTenants function
const mockData = {
  id: "1",
  name: "John Doe",
  email: "test@gmail.com",
  dob: "01/01/1980",
  phoneNumber: "444-444-4444",
  address: "1234 Elm St",
  city: "Springfield",
  state: "IL",
  zip: "62704",
  reservationHistory: [
    {
      roomNumber: "444",
      checkInDate: "Jan 01, 2025",
      checkOutDate: "Jan 15, 2025",
    },
    {
      roomNumber: "444",
      checkInDate: "Jan 01, 2025",
      checkOutDate: "Jan 15, 2025",
    },
    {
      roomNumber: "444",
      checkInDate: "Jan 01, 2025",
      checkOutDate: "Jan 15, 2025",
    },
    {
      roomNumber: "444",
      checkInDate: "Jan 01, 2025",
      checkOutDate: "Jan 15, 2025",
    },
    {
      roomNumber: "444",
      checkInDate: "Jan 01, 2025",
      checkOutDate: "Jan 15, 2025",
    },
  ],
  transactionHistory: [
    {
      paymentHistory: [
        {
          date: "01/01/2025",
          amount: "$250.00",
          type: "credit",
        },
      ],
      notifications: [
        {
          date: "01/01/2025",
          message: "Payment received",
          user: "Luke Skywalker",
        },
      ],
    },
  ],
  notes: [
    {
      comment: "Broke the blinds in room 444. Will need to replace.",
      user: "Luke Skywalker",
      date: "01/01/2025",
    },
    {
      comment: "Broke the blinds in room 444. Will need to replace.",
      user: "Luke Skywalker",
      date: "01/01/2025",
    },
    {
      comment: "Broke the blinds in room 444. Will need to replace.",
      user: "Luke Skywalker",
      date: "01/01/2025",
    },
    {
      comment: "Broke the blinds in room 444. Will need to replace.",
      user: "Luke Skywalker",
      date: "01/01/2025",
    },
  ],
};
// __________________ This code is to help with the ScrollArea component __________________
// const tags = Array.from({ length: 50 }).map(
//   (_, i, a) => `v1.2.0-beta.${a.length - i}`
// )

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const fetchTenant = async (): Promise<any> => {
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

  const tenant = await fetchTenant();

  // TODO: create function to fetch the a tenant by id -> add function to data.ts file
  // const tenant = await getTenantById(id)

  return (
    <>
      {tenant ? (
        // if tenant exists show the tenant details
        <div className="p-[30px]">
          <div className="">
            <div className="w rounded-xl border bg-card text-card-foreground shadow">
              <div>
                <h1 className="pt-[10px] pl-[30px] font-bold">{tenant.name}</h1>
                <p className="pl-[30px] pb-1">{tenant.email}</p>
                <p className="pl-[30px] pb-[40px]">{tenant.phoneNumber}</p>
                <div className="flex flex-row justify-around pb-[50px]">
                  <div className="flex flex-col gap-24">
                    <Card className=" rounded-md border p-4">
                      <CardTitle className="flex flex-row items-center justify-between">
                        <div className="flex justify-between items-center pb-3 w-full">
                          <p>DETAILS</p>
                          <Pencil className="" />
                        </div>
                      </CardTitle>
                      <div className="h-[200px] items-center rounded-md border p-4">
                        <CardContent className="items-center pt-3 flex align-center justify-center">
                          <div className="w-[300px]">
                            <div className="flex flex-row gap-4 pb-4 justify-between">
                              <h2 className="font-bold pr-12">Name:</h2>
                              <div>
                                <p>{tenant.name}</p>
                              </div>
                            </div>
                            <div className="flex flex-row gap-4 pb-4 justify-between">
                              <h2 className="font-bold pr-14">DOB:</h2>
                              <div>
                                <p>{tenant.dob}</p>
                              </div>
                            </div>
                            <div className="flex flex-row gap-4 pb-4 justify-between">
                              <h2 className="font-bold pr-8">Address:</h2>
                              <div>
                                <p className="">{tenant.address}</p>
                                <div className="">
                                  <p>{`${tenant.city}, ${tenant.state}`}</p>
                                  <p>{tenant.zip}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>

                    <Card className=" rounded-md border p-4">
                      <CardTitle className="flex flex-row items-center justify-between">
                        <div className="flex justify-between items-center pb-3 w-full">
                          <p>NOTES</p>
                          <Plus />
                        </div>
                      </CardTitle>
                      <ScrollArea className="h-[200px] rounded-md border p-4">
                        <CardContent>
                          {mockData.notes.map((note: any, index: number) => {
                            return (
                              <div className="p-1">
                                <div className="border rounded-xl p-1 -ml-7 -mr-7 text-start text-wrap">
                                  {note.comment}
                                  <div>
                                    <p className="text-wrap text-end text-sm">{`${note.user} - ${note.date}`}</p>
                                  </div>
                                </div>
                                <Separator className="my-2" />
                              </div>
                            );
                          })}
                        </CardContent>
                      </ScrollArea>
                    </Card>
                  </div>
                  <div className="flex flex-col gap-24">
                    <Card className=" rounded-md border p-4">
                      <CardTitle className="flex flex-row items-center justify-between">
                        <div className="flex justify-between items-center pb-3 w-full">
                          <p>RESERVATION HISTORY</p>
                          <Plus />
                        </div>
                      </CardTitle>
                      <ScrollArea className="h-[200px] rounded-md border p-4">
                        <CardContent>
                          {mockData.reservationHistory.map(
                            (reservation: any, index: number) => {
                              return (
                                <div className="p-1">
                                  <div className="border rounded-xl p-1 -ml-7 -mr-7 text-start text-wrap">
                                    {`${mockData.name} stayed in ${reservation.roomNumber} 
                                    from ${reservation.checkInDate} to ${reservation.checkOutDate}`}
                                  </div>
                                  <Separator className="my-2" />
                                </div>
                              );
                            }
                          )}
                        </CardContent>
                      </ScrollArea>
                    </Card>
                    <Card className=" rounded-md border p-4">
                      <CardTitle className="flex flex-row items-center justify-between">
                        <div className="flex justify-between items-center pb-3 w-full">
                          <p>TRANSACTION HISTORY</p>
                          <Plus />
                        </div>
                      </CardTitle>
                      <ScrollArea className="h-[200px] rounded-md border p-4">
                        <CardContent>
                          {mockData.reservationHistory.map(
                            (reservation: any, index: number) => {
                              return (
                                <div className="p-1">
                                  <div>
                                    <div className="dark-circle"></div>
                                    <div className="tran-his-table border rounded-xl p-1 mt-3 -ml-7 -mr-7 text-start text-wrap">
                                      {`${mockData.name} stayed in ${reservation.roomNumber} 
                                    from ${reservation.checkInDate} to ${reservation.checkOutDate}`}
                                    </div>
                                  </div>
                                  <Separator className="my-2" />
                                </div>
                              );
                            }
                          )}
                        </CardContent>
                      </ScrollArea>
                    </Card>
                  </div>
                </div>
              </div>
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
