"use client";
import React, { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Link, MessageCircle } from "lucide-react";
import { RiHeartFill, RiHeartLine } from "react-icons/ri";
import axios from "axios";
import ShowLikersModal from "./ShowLikersModal";
import { useRouter } from "next/navigation";

interface PostProps {
  post: Post;
  user: User;
}

interface User {
  username: string;
}

interface Post {
  _id: string;
  postImage: string;
  caption: string;
  createdAt: string;
  name: string;
  image: string;
  username: string;
  likes: Array<string>; // Assuming likes is an array of user IDs (strings)
  comments: Array<Comment>; // Assuming comments is an array of comment objects
}

interface Comment {
  _id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

const PostCard: React.FC<PostProps> = ({ post, user }) => {
  const [likes, setLikes] = useState<string[]>(post.likes);
  const isLiked = likes?.includes(user?.username);
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const timeAgo = formatDistanceToNow(new Date(post?.createdAt), {
    addSuffix: true,
  });


  const handleLikeToggle = async () => {
    try {
      const { data } = await axios.put(`/private/home/api/handleLikeToggle`, {
        username: user?.username,
        postId: post?._id,
      });

      if (data.message === "Post liked") {
        const updatedLikes = [...likes, user.username];
        setLikes(updatedLikes);
      } else if (data.message === "Like removed") {
        const updatedLikes = likes.filter((like: string) => like !== user.username);
        setLikes(updatedLikes);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const goUserprofile = () => {
    router.push(`/private/${post?.username}`)
  }
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full mx-auto">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <Image
            onClick={goUserprofile}
            src={post?.image}
            alt={`${post?.username}'s avatar`}
            className="rounded-full cursor-pointer h-11 w-11 object-cover"
            objectFit="cover"
            width={44}
            height={44}
          />
          <div className="ml-3">
            <h2 onClick={goUserprofile} className="font-semibold text-gray-800 cursor-pointer w-fit">{post?.username}</h2>
            <p className="text-xs text-gray-500">{timeAgo}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{post?.caption}</p>
        {post?.postImage && (
          <div className="mb-4">
            <Image
              src={post?.postImage}
              alt="Post image"
              width={500}
              height={300}
              layout="responsive"
              className="rounded-md"
            />
          </div>
        )}
        <div className="flex gap-6 justify-start items-center text-gray-500">
          <button className="flex cursor-default items-center space-x-2 hover:text-blue-500 transition duration-500">
            {isLiked ? (
              <RiHeartFill
                onClick={handleLikeToggle}
                size={23}
                className="text-rose-500 cursor-pointer"
              />
            ) : (
              <RiHeartLine
                onClick={handleLikeToggle}
                size={23}
                className="text-gray-500 hover:text-rose-500 cursor-pointer"
              />
            )}
            <span onClick={() => {
              setIsOpen(true);
            }} className="text-main cursor-pointer">{likes.length > 0 ? likes.length : ""}</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-blue-500 transition">
            <MessageCircle size={20} />
            <span>{post?.comments?.length > 0 && post?.comments?.length}</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-blue-500 transition">
            <Link size={20} />
            <span className="sr-only">Copy Link</span>
          </button>
        </div>
        <ShowLikersModal likes={likes} username={post.username} isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  );
};

export default PostCard;
