import React from "react";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white font-[Poppins]">
      <div className="text-center space-y-6 max-w-lg">
        <h1 className="text-3xl font-semibold tracking-wide leading-snug sm:text-4xl">
          Welcome to the Hostel Management Application
        </h1>
        <p className="text-base sm:text-lg leading-relaxed opacity-90">
          Seamlessly manage bookings, monitor facilities, and enhance your
          guests' experience all in one place.
        </p>
        <div className="space-x-4">
          <Button asChild className="text-lg px-5 py-2.5 font-medium">
            <a href="/login">Login</a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-black text-lg px-5 py-2.5 font-medium"
          >
            <a href="/register">Register</a>
          </Button>
        </div>
      </div>
    </div>
  );
}