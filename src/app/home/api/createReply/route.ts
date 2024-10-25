import { connectDB } from "@/lib/connectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const PUT = async (request: Request) => {
  const { replyInfo, commentId, postId } = await request.json();
  const db = await connectDB();
  try {
    const postCollection = db.collection("posts");
    const newReply = {
      ...replyInfo,
      _id: new ObjectId(),
      createdAt: new Date().toISOString(),
    };
    const updateResult = await postCollection.updateOne(
      {
        _id: new ObjectId(postId),
        "comments._id": new ObjectId(commentId),
      },
      {
        $push: { "comments.$.replies": newReply }, // Push the new reply into the replies array of the matched comment
      }
    );

    if (updateResult.modifiedCount === 1) {
      const updatedPost = await postCollection?.findOne({
        _id: new ObjectId(postId),
      });
      return NextResponse.json(
        {
          message: "Reply added successfully",
          updatedComments: updatedPost?.comments,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Comment not found or reply not added" },
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
