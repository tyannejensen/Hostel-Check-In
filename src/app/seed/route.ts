import { dbConnect } from "@/lib/db"
import { User } from "@/models/User.model"

await dbConnect()

async function seedUsers() {
	const users = [
		// Add your user data here
		{
			firstName: "John",
			lastName: "Doe",
			email: "john@example.com",
			password: "password123",
			role: "admin",
		},
		{
			firstName: "Jane",
			lastName: "Doe",
			email: "jane@example.com",
			password: "password123",
			role: "admin",
		},
		{
			firstName: "Alice",
			lastName: "Smith",
			email: "alice@example.com",
			password: "password123",
			role: "admin",
		}, // Additional user
		// Add more users as needed
	]

	// Drop the existing collection
	await User.collection.drop()

	const insertedUsers = await Promise.all(
		users.map(async (user) => {
			const newUser = new User({
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				password: user.password, // No manual hashing here
				role: user.role,
			})
			return newUser.save()
		})
	)

	return insertedUsers
}

export async function GET() {
	try {
		await seedUsers()
		return new Response(
			JSON.stringify({ message: "Database seeded successfully" }),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		)
	} catch (error) {
		console.error("Error seeding database:", error)
		return new Response(JSON.stringify({ message: "Error seeding database" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		})
	}
}
