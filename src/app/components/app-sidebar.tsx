import Image from "next/image";
import { Bed, LayoutDashboard, UsersRound } from "lucide-react";

import {
  Sidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { signOut } from "@/lib/auth";
import { PowerIcon } from "@heroicons/react/24/outline";

// Menu items. Dashboard, Reservations, Tenants
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Reservations",
    url: "/dashboard/reservations",
    icon: Bed,
  },
  {
    title: "Tenants",
    url: "/dashboard/tenants",
    icon: UsersRound,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="sidebar">
      <div>
        <Image
          className="p-4"
          src="/assets/photos/devTech.png"
          width={300}
          height={300}
          alt="devTech co logo"
        />
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem
              className="p-3 font-semibold
"
              key={item.title}
            >
              <SidebarMenuButton className="nav-item" asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
              <PowerIcon className="w-6" />
              <div className="hidden md:block">Sign Out</div>
            </button>
          </form>
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}
