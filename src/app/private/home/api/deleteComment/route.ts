import { connectDB } from "@/lib/connectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

interface Comment {
  _id: ObjectId;
  userImage: string;
  username: string;
  comment: string;
  replies: Array<Reply>;
  createdAt: string;
}

interface Reply {
  _id: ObjectId;
  userImage: string;
  username: string;
  comment: string;
  createdAt: string;
}

interface Post {
  _id: ObjectId;
  comments: Comment[];
}

export const DELETE = async (request: Request) => {
  const { postId, commentId }: { postId: string; commentId: string } =
    await request.json();
  const db = await connectDB();
  try {
    const postCollection = db.collection<Post>("posts");
    const result = await postCollection.updateOne(
      { _id: new ObjectId(postId) },
      { $pull: { comments: { _id: new ObjectId(commentId) } } }
    );
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Comment not found or could not be deleted" },
        { status: 404 }
      );
    }

    const updatedPost = await postCollection.findOne(
        { _id: new ObjectId(postId) },
        { projection: { comments: 1 } }
      );

    return NextResponse.json(
      { message: "Comment deleted successfully", comments: updatedPost?.comments },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE request:", error);
    return NextResponse.json(
      { message: "Something Went Wrong" },
      { status: 500 }
    );
  }
};
