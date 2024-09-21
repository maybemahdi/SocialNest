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
    console.log(storyInfo);
    await storyCollection?.insertOne({...storyInfo, createdAt: Date.now()});
    return NextResponse.json({ message: "Story Uploaded", uploaded: true }, { status: 200 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Something Went Wrong" },
      { status: 500 }
    );
  }
};
