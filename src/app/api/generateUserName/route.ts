import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

interface ReqData {
    name: string;
}

export const POST = async (request: Request) => {
  try {
    const data: ReqData = await request.json();
    const {name} = data;
    const db = await connectDB();
    const userCollection = db.collection("users");

    let isUnique = false;
    let username = "";

    // Keep generating a username until a unique one is found
    while (!isUnique) {
      // Remove spaces and make lowercase
      const baseName = name.toLowerCase().replace(/\s+/g, "");

      // Generate a random number between 100 and 999
      const randomNumber = Math.floor(100 + Math.random() * 900);

      // Combine base name with random number
      username = `${baseName}${randomNumber}`;

      // Check if the username already exists in the database
      const existingUser = await userCollection.findOne({ username });

      // If no user exists with this username, mark it as unique
      if (!existingUser) {
        isUnique = true;
      }
    }

    return NextResponse.json({ username }, {status: 200});
  } catch (error) {
    return NextResponse.json({ message: "Not Allowed" }, {status: 405});
  }
};
