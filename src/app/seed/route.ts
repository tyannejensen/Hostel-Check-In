import { dbConnect } from "@/lib/db"
import { User } from "@/models/User.model"
import { users } from "@/utils/test-data"

async function seedUsers() {
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
		await dbConnect() // Connect to the database
		await seedUsers() // Seed users
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
