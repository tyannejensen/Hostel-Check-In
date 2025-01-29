import bcrypt from 'bcrypt';
import { dbConnect } from '@/utils/db';
import User from '@/lib/definitions';

await dbConnect();

async function seedUsers() {
  const users = [
    // Add your user data here
    { name: 'John Doe', email: 'john@example.com', password: 'password123' },
    // Add more users as needed
  ];

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = new User({
        name: user.name,
        email: user.email,
        password: hashedPassword,
      });
      return newUser.save();
    }),
  );

  return insertedUsers;
}

export async function GET() {
  try {
    await seedUsers();
    return new Response(JSON.stringify({ message: 'Database seeded successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return new Response(JSON.stringify({ message: 'Error seeding database' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}