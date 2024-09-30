import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  { params }: { params: { username: string } }
) => {
  const { username } = params;
  const db = await connectDB();
  const user = await db
    .collection("users")
    .findOne({ username }, { projection: { _id: 0, password: 0 } });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
};
