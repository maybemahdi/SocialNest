import { connectDB } from "@/lib/connectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
  const { id } = params;

  const db = await connectDB();
  const post = await db.collection("posts").findOne({ _id: new ObjectId(id) });

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
};
