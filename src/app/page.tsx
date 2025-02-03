"use client"
import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default function Page() {
	const router = useRouter()
	const handleGetStarted = () => {
		router.push("/login/")
	}

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-white to-violet-950 text-black font-sans">
			<Card className="w-[400px] p-6 rounded-lg shadow-lg bg-white text-black text-center">
				<CardHeader>
					<CardTitle className="text-3xl font-semibold">
						Welcome to the Hostel Management Application
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<Image
						src="/assets/photos/devTech.png"
						alt="Development Technologies"
						width={200}
						height={100}
						className="mx-auto"
					/>
					<p className="text-base sm:text-lg leading-relaxed opacity-90">
						Streamline your hostel management with easy bookings, seamless check-ins,
						automated renewals, and real-time insights. Stay organized and focus on
						what matters most—providing an exceptional guest experience.
					</p>
					<Button
						onClick={handleGetStarted}
						className="text-lg px-5 py-2.5 font-medium w-full"
					>
						Get Started
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}