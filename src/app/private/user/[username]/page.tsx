/* eslint-disable @next/next/no-img-element */
"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import useAuth from "@/Hooks/useAuth";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import PostCardSkeleton from "@/components/Home/PostCardSkeleton";
import usePost from "@/Hooks/usePost";
import PostCard from "@/components/Home/PostCard";

const SingleUserPage = () => {
    const params = useParams();
    const { user: currentUser } = useAuth();
    const { username } = params;
    const router = useRouter();

    const { posts, isLoading: isPostsLoading, fetchNextPage, hasNextPage } = usePost();
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
            return data;
        },
    });
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
                    <AvatarImage src={user?.image} />
                    <AvatarFallback className="font-bold">{username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-1">
                            <h1 className="text-2xl font-bold">{user?.name}</h1>
                            {user?.role === "admin" && <RiVerifiedBadgeFill title="Verified" size={22} className="text-blue-500" />}
                        </div>
                        <p className="text-gray-600">@{username}</p>
                    </div>
                    {currentUser?.username === user?.username ? (
                        <Button>Edit Profile</Button>
                    ) : (
                        <Button>Follow</Button>
                    )}
                </div>
                <p className="mb-4">{user?.bio || "Developer"}</p>
                <div className="flex space-x-4 text-gray-600">
                    <span>
                        <strong>{user?.followers}</strong> Followers
                    </span>
                    <span>
                        <strong>{user?.following}</strong> Following
                    </span>
                </div>
            </div>
            <div className="my-3 flex flex-col items-center gap-5 w-full mx-auto">
                {!isPostsLoading ? (
                    posts?.pages.flatMap((page) => page.posts).filter(post => post?.username === user?.username).map((post) => (
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

export default SingleUserPage;
