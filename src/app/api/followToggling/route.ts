import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

interface UserDocument {
  username: string;
  followers: string[];
  following: string[];
}

export const PATCH = async (request: Request) => {
  const { visitorUsername, toProfile } = await request.json();
  const db = await connectDB();
  const userCollection = db.collection("users");
  try {
    const visitor = await userCollection.findOne<UserDocument>({
      username: visitorUsername,
    });
    const to = await userCollection.findOne<UserDocument>({
      username: toProfile,
    });

    if (!visitor) {
      return NextResponse.json({ message: "Your username isn't registered" });
    }
    if (!to) {
      return NextResponse.json({ message: "User not Found" });
    }

    const alreadyFollowed = visitor.following.includes(toProfile);

    if (alreadyFollowed) {
      // Remove follow
      await userCollection.updateOne(
        { username: visitorUsername },
        { $pull: { following: toProfile } }
      );
      await userCollection.updateOne(
        { username: toProfile },
        { $pull: { followers: visitorUsername } }
      );
      const updatedUser = await userCollection.findOne<UserDocument>({
        username: toProfile,
      });
      if (!updatedUser) {
        return NextResponse.json(
          { message: "User not found after update" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          message: "Follow removed",
          followers: updatedUser.followers,
          isFollowed: false,
        },
        { status: 200 }
      );
    } else {
      // Add follow
      await userCollection.updateOne(
        { username: visitorUsername },
        { $push: { following: toProfile } }
      );
      await userCollection.updateOne(
        { username: toProfile },
        { $push: { followers: visitorUsername } }
      );
      const updatedUser = await userCollection.findOne<UserDocument>({
        username: toProfile,
      });
      if (!updatedUser) {
        return NextResponse.json(
          { message: "User not found after update" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          message: "Follow added",
          followers: updatedUser.followers,
          isFollowed: true,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error or ID not found" },
      { status: 500 }
    );
  }
};
