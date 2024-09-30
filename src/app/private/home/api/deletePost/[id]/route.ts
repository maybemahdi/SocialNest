import { connectDB } from "@/lib/connectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const db = await connectDB();
  const postCollection = db.collection("posts");
  try {
    const filter = { _id: new ObjectId(id) };
    const result = await postCollection.deleteOne(filter);
    if (result.deletedCount > 0) {
      return NextResponse.json(
        { message: "Post Deleted Successfully" },
        { status: 200 }
      );
    } else {
        return NextResponse.json(
            { message: "Post Not Found" },
            { status: 404 }
          );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error or ID not found" },
      { status: 500 }
    );
  }
};
