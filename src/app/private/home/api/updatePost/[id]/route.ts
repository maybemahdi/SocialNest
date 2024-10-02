import { connectDB } from "@/lib/connectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

interface UpdateInfo {
    caption: string | null;
    postImage: string | null;
}

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const updateInfo: UpdateInfo = await request.json();
  const db = await connectDB();
  const postCollection = db.collection("posts");
  try {
    const filter = { _id: new ObjectId(id) };
    const updatePost = {
        $set: {
          caption: updateInfo?.caption,
          postImage: updateInfo?.postImage,
        }
    }
    const result = await postCollection?.updateOne(filter, updatePost);
    if(result.modifiedCount > 0){
        return NextResponse.json({message: "Post Updated", updated: true}, {status: 200})
    }else{
        return NextResponse.json({message: "Post not Update", updated: false}, {status: 200})
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error or ID not found" },
      { status: 500 }
    );
  }
};
