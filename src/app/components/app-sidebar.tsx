import Image from "next/image"
import { Bed, LayoutDashboard, UsersRound } from "lucide-react"

import {
	Sidebar,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"

import { signOut } from "@/lib/auth"
import { PowerIcon } from "@heroicons/react/24/outline"

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
]

export function AppSidebar() {
	return (
		<Sidebar className="sidebar">
			<div>
				<Image
					className="p-4 mb-[30px]"
					src="/assets/photos/devTech.png"
					width={300}
					height={300}
					alt="devTech co logo"
				/>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem className="p-3 font-semibold" key={item.title}>
							<SidebarMenuButton className="nav-item" asChild>
								<a href={item.url}>
									<item.icon />
									<span>{item.title}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}

					<SidebarMenuItem className="p-3 font-semibold">
						<SidebarMenuButton className="nav-item" asChild>
							<a
								onClick={async () => {
									"use server"
									await signOut({ redirectTo: "/" })
								}}
							>
								<PowerIcon />
								<span>Sign Out</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</div>
		</Sidebar>
	)
}
