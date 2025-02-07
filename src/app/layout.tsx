// These styles apply to every route in the application
import React from "react"
import "@/styles/global.css"

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<body>{children}</body>
		</html>
	)
}
