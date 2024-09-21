/* eslint-disable @typescript-eslint/no-unused-vars */
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const db = await connectDB();
    const storyCollection = db.collection("stories");
    const stories = await storyCollection.find().toArray();
    return NextResponse.json(stories);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
};
