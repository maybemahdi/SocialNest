import { connectDB } from "@/lib/connectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const PUT = async (request: Request) => {
  const { commentInfo, postId } = await request.json();
  const db = await connectDB();
  try {
    const filter = { _id: new ObjectId(postId) };
    const postCollection = db.collection("posts");
    const newComment = {
      ...commentInfo,
      _id: new ObjectId(),
      createdAt: new Date().toISOString(),
    };
    const updateResult = await postCollection.updateOne(filter, {
      $push: { comments: newComment },
    });

    if (updateResult.modifiedCount === 1) {
      return NextResponse.json(
        { message: "Comment added successfully", newComment },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Post not found or comment not added" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error in PUT request:", error);
    return NextResponse.json(
      { message: "Something Went Wrong" },
      { status: 500 }
    );
  }
};
