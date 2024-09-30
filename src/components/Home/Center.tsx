/* eslint-disable react-hooks/exhaustive-deps */
// center.tsx
"use client";
import useAuth from "@/Hooks/useAuth";
import useGoProfile from "@/Hooks/useGoProfile";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { IoMdPhotos } from "react-icons/io";
import { RiLiveFill } from "react-icons/ri";
import StorySlider from "./StorySlider";
import CreatePostModal from "./CreatePostModal";
import PostCard from "./PostCard";
import PostCardSkeleton from "./PostCardSkeleton";
import usePost from "@/Hooks/usePost";

interface Post {
  _id: string;
  postImage: string;
  caption: string;
  createdAt: string;
  name: string;
  image: string;
  username: string;
  likes: Array<string>;
  comments: Array<Comment>;
}

interface Comment {
  _id: string;
  userImage: string;
  username: string;
  comment: string;
  replies: Array<Reply>;
  createdAt: string;
}

interface Reply {
  _id: string;
  userImage: string;
  username: string;
  comment: string;
  createdAt: string;
}

const Center = () => {
  const { user } = useAuth();
  const goProfile = useGoProfile();
  const [isOpen, setIsOpen] = useState(false);

  const { posts, isLoading, fetchNextPage, hasNextPage } = usePost();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Effect to handle Intersection Observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };
  
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        console.log("Loading more posts...");
        fetchNextPage();
      }
    }, options);
  
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
  
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, fetchNextPage]);
  


  return (
    <div className="w-full rounded flex flex-col">
      {/* create post section */}
      <div className="bg-white shadow-md rounded-md flex flex-col gap-3 p-3 md:px-8 m:py-3 md:w-[70%] w-full mx-auto">
        <div className="flex items-center justify-center gap-5">
          <Image
            onClick={() => goProfile(user?.username)}
            className="rounded-full cursor-pointer h-11 w-11 object-cover"
            src={user?.image}
            objectFit="cover"
            width={44}
            height={44}
            alt="PFP"
          />
          <p
            onClick={() => {
              setIsOpen(true);
            }}
            className="flex-1 bg-slate-100 hover:bg-slate-200 transition-all duration-300 rounded-3xl px-4 py-2 text-gray-400 cursor-pointer"
          >
            What's on your mind, {user?.name}?
          </p>
        </div>
        <hr />
        <div className="flex items-center gap-5">
          <div
            onClick={() => {
              setIsOpen(true);
            }}
            className="flex items-center gap-2 p-2 hover:bg-slate-200 transition-all duration-300 rounded-md cursor-pointer"
          >
            <IoMdPhotos className="text-green-700" size={30} />
            <p className="text-base text-main font-medium">Photo/Video</p>
          </div>
          <div
            title="Coming Soon"
            className="flex items-center gap-2 p-2 hover:bg-slate-200 transition-all duration-300 rounded-md cursor-not-allowed"
          >
            <RiLiveFill className="text-rose-500" size={30} />
            <p className="text-base text-main font-medium">Go live</p>
          </div>
        </div>
      </div>
      {/* create story modal  */}
      <CreatePostModal isOpen={isOpen} setIsOpen={setIsOpen} />
      {/* create story and see other's story section  */}
      <div className="my-3 md:w-[70%] w-full mx-auto">
        <StorySlider user={user} />
      </div>
      <div className="my-3 flex flex-col items-center gap-5 md:w-[70%] w-full mx-auto">
        {!isLoading ? (
          posts?.pages.flatMap((page) => page.posts).map((post:Post) => (
            <PostCard key={post?._id} post={post} user={user} />
          ))
        ) : (
          <PostCardSkeleton />
        )}
        {hasNextPage && <div ref={loadMoreRef} style={{ height: '1px', background: 'red' }} />}
      </div>
    </div>
  );
};

export default Center;
