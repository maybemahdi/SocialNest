import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { email: string } }
) => {
  const db = await connectDB();
  const userCollection = db.collection("users");
  const { email } = params;
  try {
    const user = await userCollection.findOne(
      { email },
      { projection: { _id: 0, password: 0 } }
    );
    if (!user) {
      return NextResponse.json({ error: "No User Exist" }, { status: 401 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log(error);
  }
};
