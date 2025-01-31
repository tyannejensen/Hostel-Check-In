// import { getTenantById } from "@/lib/actions/user.actions"

// TODO: determine how to show an 'view' and 'edit' in the url e.g. /tenants/1/view or /tenants/1/edit
// TODO: how can we have the edit and view pages be the same but the URL change upon state change?

export default async function Page(props: { params: Promise<{ id: string }> }) {
	const params = await props.params
	const id = params.id
	// TODO: create function to fetch the a tenant by id -> add function to data.ts file
	// const tenant = await getTenantById(id)

	return (
		<div>
			<h1>Reservation</h1>
			<p>Manage reservations</p>
		</div>
	)
}
