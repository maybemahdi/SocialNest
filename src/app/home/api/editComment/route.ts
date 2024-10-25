import { connectDB } from "@/lib/connectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const PATCH = async (request: Request) => {
  const { commentId, postId, comment } = await request.json();
  const db = await connectDB();
  try {
    const postCollection = db.collection("posts");
    const result = await postCollection.updateOne(
      { _id: new ObjectId(postId), "comments._id": new ObjectId(commentId) },
      { $set: { "comments.$.comment": comment } }
    );
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Comment not found or could not be updated" },
        { status: 404 }
      );
    }

    const updatedPost = await postCollection.findOne(
      { _id: new ObjectId(postId) },
      { projection: { comments: 1 } }
    );

    return NextResponse.json(
      {
        message: "Comment updated successfully",
        comments: updatedPost?.comments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PATCH request:", error);
    return NextResponse.json(
      { message: "Something Went Wrong" },
      { status: 500 }
    );
  }
};
