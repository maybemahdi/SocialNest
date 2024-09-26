/* eslint-disable @typescript-eslint/no-unused-vars */
import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const db = await connectDB();
    const postCollection = db.collection("posts");
    const posts = await postCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(posts);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
};
