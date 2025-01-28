import React from "react"

// These styles apply to every route in the application
import "@/styles/global.css"

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	)
}
