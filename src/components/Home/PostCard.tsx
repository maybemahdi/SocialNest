"use client";
import React from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Heart, Link, MessageCircle } from "lucide-react";

interface PostProps {
    post: Post;
}

interface Post {
    _id: string;
    postImage: string;
    caption: string;
    createdAt: string;
    name: string;
    image: string;
    userName: string;
    likes: number;
    commentsCount: number;
}

const PostCard: React.FC<PostProps> = ({ post }) => {
    const timeAgo = formatDistanceToNow(new Date(post?.createdAt), {
        addSuffix: true,
    });
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full mx-auto">
            <div className="p-4">
                <div className="flex items-center mb-4">
                    <Image
                        src={post?.image}
                        alt={`${post?.userName}'s avatar`}
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <div className="ml-3">
                        <h2 className="font-semibold text-gray-800">{post?.userName}</h2>
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
                    <button className="flex items-center space-x-2 hover:text-blue-500 transition">
                        <Heart size={20} />
                        <span>{post?.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-blue-500 transition">
                        <MessageCircle size={20} />
                        <span>{post?.commentsCount}</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-blue-500 transition">
                        <Link size={20} />
                        <span className="sr-only">Copy Link</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
