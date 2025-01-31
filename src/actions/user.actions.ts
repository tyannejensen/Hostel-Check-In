'use server';

import { dbConnect } from "@/lib/db";
import { User } from "@/models/User.model";

await dbConnect();
// register user function
export async function registerUser(
    prevState: string | undefined,
    formData: FormData
  ) {
    console.log(formData);
  
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log(firstName, lastName, email, password);
  
    if (!firstName || !lastName || !email || !password) {
      return "Please fill in all fields";
    }
  
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      role: "admin",
    });
    
    await newUser.save();
  
    return "User created successfully";
  }
  