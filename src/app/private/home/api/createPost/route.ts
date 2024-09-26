import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

interface PostInfo {
  email: string;
  currentStories: unknown;
  caption: string;
  name?: string;
}

export const POST = async (request: Request) => {
  try {
    const postInfo: PostInfo = await request.json();
    const db = await connectDB();
    const postCollection = db.collection("posts");
    await postCollection?.insertOne({
      ...postInfo,
      createdAt: new Date(),
    });
    return NextResponse.json(
      { message: "Post Uploaded", uploaded: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Something Went Wrong" },
      { status: 500 }
    );
  }
};
