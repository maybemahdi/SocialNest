import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const db = await connectDB();
  const userCollection = db.collection("users");
  try {
    const users = await userCollection
      .find(
        {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { name: { $regex: search, $options: "i" } },
          ],
        },
        {
          projection: {
            password: 0,
            email: 0,
            provider: 0,
            role: 0,
            followers: 0,
            following: 0,
          }, // Exclude sensitive fields
        }
      )
      .toArray();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
