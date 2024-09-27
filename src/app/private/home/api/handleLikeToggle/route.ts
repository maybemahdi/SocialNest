import { connectDB } from "@/lib/connectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const PUT = async (request: Request) => {
  try {
    const { username, postId } = await request.json();
    const db = await connectDB();
    const postCollection = db.collection("posts");
    const filter = { _id: new ObjectId(postId) };
    const post = await postCollection.findOne(filter);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    const alreadyLiked = post.likes.includes(username);
    if (alreadyLiked) {
      // If the user has already liked, remove the like
      await postCollection.updateOne(filter, { $pull: { likes: username } });
      return NextResponse.json({ message: "Like removed" },{status: 200});
    } else {
      // Otherwise, add the like
      await postCollection.updateOne(filter, { $push: { likes: username } });
      return NextResponse.json({ message: "Post liked" }, {status: 200});
    }
  } catch (error) {
    console.error("Error in PUT request:", error);
    return NextResponse.json(
      { message: "Something Went Wrong" },
      { status: 500 }
    );
  }
};
