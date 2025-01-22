import SideNav from "@/ui/dashboard/sidenav"

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<main>
			<SideNav />
			<section>{children}</section>
		</main>
	)
}
