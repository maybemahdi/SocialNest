/* eslint-disable @typescript-eslint/no-unused-vars */
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;

    const db = await connectDB();
    const postCollection = db.collection("posts");

    const totalPosts = await postCollection.countDocuments();
    const posts = await postCollection
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const hasMore = page * limit < totalPosts;

    return NextResponse.json({ posts, hasMore });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: "An error occurred while fetching posts.",
    });
  }
};
