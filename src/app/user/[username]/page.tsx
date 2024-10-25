/* eslint-disable @next/next/no-img-element */
"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import useAuth from "@/Hooks/useAuth";
import { RiLiveFill, RiVerifiedBadgeFill } from "react-icons/ri";
import PostCardSkeleton from "@/components/Home/PostCardSkeleton";
import usePost from "@/Hooks/usePost";
import PostCard from "@/components/Home/PostCard";
import { IoMdPhotos } from "react-icons/io";
import CreatePostModal from "@/components/Home/CreatePostModal";
import Image from "next/image";
import { ImSpinner9 } from "react-icons/im";
import ShowFollowersModal from "@/components/Home/ShowFollowersModal";
import ShowFollowingModal from "@/components/Home/ShowFollowingModal";
import Swal from "sweetalert2";

const SingleUserPage = () => {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const { username } = params;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const {
    posts,
    isLoading: isPostsLoading,
    fetchNextPage,
    hasNextPage,
  } = usePost();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Effect to handle Intersection Observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
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

  useEffect(() => {
    document.title = `${username}`;
  }, [username]);
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const { data } = await axios.get(`/api/user/${username}`);
      if (data?.message === "User not found") {
        toast.error("User not found");
        return router.push("/");
      }
      setIsFollowed(currentUser?.following.includes(username));
      setFollowersCount(data?.followers?.length || 0);
      setFollowers(data?.followers || []);
      setFollowing(data?.following || []);
      return data;
    },
  });

  // handle do Follow / do unFollow toggling
  const handleFollowToggling = async () => {
    setToggling(true);
    const { data } = await axios.patch(`/api/followToggling`, {
      visitorUsername: currentUser?.username,
      toProfile: user?.username,
    });
    console.log(data);
    if (data?.followers) {
      setToggling(false);
      setFollowersCount(data?.followers?.length);
      setFollowers(data?.followers || []);
      setIsFollowed(data?.isFollowed);
    }
  };

  if (isLoading) return <Loading />;
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="relative mb-12">
        <img
          src="https://i.ibb.co.com/QCvjSKW/Mc8k-W4x9-Q3a-RR3-Rk-P5-Im-IMG-4417.jpg"
          alt="Cover"
          className="w-full h-48 object-cover rounded-lg"
        />
        <Avatar className="absolute bottom-0 left-4 transform translate-y-1/2 w-24 h-24 border-4 border-white object-cover">
          <AvatarImage src={user?.image} className="object-cover" />
          <AvatarFallback className="font-bold">
            {username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-1">
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              {user?.role === "admin" && (
                <RiVerifiedBadgeFill
                  title="Verified"
                  size={22}
                  className="text-blue-500"
                />
              )}
            </div>
            <p className="text-gray-600">@{username}</p>
          </div>
          {currentUser?.username === user?.username ? (
            <Button className="bg-main">Edit Profile</Button>
          ) : (
            <Button onClick={handleFollowToggling} className="bg-main">
              {!toggling && isFollowed && "Unfollow"}
              {!toggling && !isFollowed && "Follow"}
              {toggling && <ImSpinner9 size={20} className="animate-spin" />}
            </Button>
          )}
        </div>
        <p className="mb-4">{user?.bio || "No Bio Yet"}</p>
        <div className="flex space-x-4 text-gray-600">
          {followersCount > 0 ? (
            <span
              onClick={() => setShowFollowers(true)}
              className="cursor-pointer"
            >
              <strong>{followersCount}</strong> Followers
            </span>
          ) : (
            <span className="cursor-pointer">
              <strong>{followersCount}</strong> Followers
            </span>
          )}
          {following?.length > 0 ? (
            <span
              onClick={() => {
                if (currentUser?.username === user?.username) {
                  setShowFollowing(true);
                } else {
                  Swal.fire({
                    title: "OOPS!",
                    text: "That thing is Private?",
                    icon: "error",
                  });
                }
              }}
              className="cursor-pointer"
            >
              <strong>{user?.following?.length}</strong> Following
            </span>
          ) : (
            <span>
              <strong>{user?.following?.length}</strong> Following
            </span>
          )}
        </div>
      </div>

      {/* create post section  */}
      {currentUser?.username === user?.username && (
        <>
          <div className="bg-white shadow-md rounded-md flex flex-col gap-3 p-3 md:px-8 m:py-3 w-full mx-auto mb-5">
            <div className="flex items-center justify-center gap-5">
              <Image
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
                {/* eslint-disable-next-line react/no-unescaped-entities */}
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
        </>
      )}

      <div className="my-3 flex flex-col items-center gap-5 w-full mx-auto">
        {!isPostsLoading ? (
          posts?.pages
            .flatMap((page) => page.posts)
            .filter((post) => post?.userId === currentUser?._id)
            .map((post) => <PostCard key={post?._id} post={post} user={user} />)
        ) : (
          <PostCardSkeleton />
        )}
        {hasNextPage && (
          <div ref={loadMoreRef} style={{ height: "1px", background: "red" }} />
        )}
      </div>
      <ShowFollowersModal
        setShowFollowers={setShowFollowers}
        showFollowers={showFollowers}
        followers={followers}
      />
      <ShowFollowingModal
        setShowFollowing={setShowFollowing}
        showFollowing={showFollowing}
        following={following}
      />
    </div>
  );
};

export default SingleUserPage;
