import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

interface StoryInfo {
  email: string;
  currentStories: unknown;
  caption: string;
  name?: string;
}

export const POST = async (request: Request) => {
  try {
    const storyInfo: StoryInfo = await request.json();
    const db = await connectDB();
    const storyCollection = db.collection("stories");
    await storyCollection?.insertOne({
      ...storyInfo,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    await storyCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    return NextResponse.json(
      { message: "Story Uploaded", uploaded: true },
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
