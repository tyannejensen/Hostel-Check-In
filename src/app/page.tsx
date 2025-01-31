'use client';
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  const router = useRouter();
  const handleUserLogin = () => {
    router.push("/login/");
  };
  const handleAdminLogin = () => {
    router.push("/login/");
  };
  const handleRegister = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-white to-violet-950 text-black font-sans">
      <Card className="w-[400px] p-6 rounded-lg shadow-lg bg-white text-black">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-semibold">Welcome to the Hostel Management Application</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-base sm:text-lg leading-relaxed opacity-90">
            Seamlessly manage bookings, monitor facilities, and enhance your guests' experience all in one place.
          </p>
          <h2 className="text-xl font-medium">Login</h2>
          <div className="border border-gray-300 rounded-lg p-4 space-y-2">
            <Button onClick={handleUserLogin} className="text-lg px-5 py-2.5 font-medium w-full">
              User Login
            </Button>
            <Button onClick={handleUserLogin} className="text-lg px-5 py-2.5 font-medium w-full">
              Admin Login
            </Button>
          </div>
          <h2 className="text-xl font-medium">Register new user</h2>
          <div className="border border-gray-300 rounded-lg p-4 mt-4">
            <Button onClick={handleUserLogin} className="text-lg px-5 py-2.5 font-medium w-full">
              Register
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




// import React from "react";
// import { Button } from "@/components/ui/button";

// export default function Page() {
//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white font-[Poppins]">
//       <div className="text-center space-y-6 max-w-lg">
//         <h1 className="text-3xl font-semibold tracking-wide leading-snug sm:text-4xl">
//           Welcome to the Hostel Management Application
//         </h1>
//         <p className="text-base sm:text-lg leading-relaxed opacity-90">
//           Seamlessly manage bookings, monitor facilities, and enhance your
//           guests' experience all in one place.
//         </p>
//         <div className="space-x-4">
//           <Button asChild className="text-lg px-5 py-2.5 font-medium">
//             <a href="/login">Login</a>
//           </Button>
//           <Button
//             asChild
//             variant="outline"
//             className="text-white border-white hover:bg-white hover:text-black text-lg px-5 py-2.5 font-medium"
//           >
//             <a href="/register">Register</a>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }