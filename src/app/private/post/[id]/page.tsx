"use client"
import PostCard from "@/components/Home/PostCard";
import Loading from "@/components/Loading";
import useAuth from "@/Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const SinglePostPage = () => {
    const params = useParams();
    const { id } = params;
    const { user } = useAuth()

    const { data: post, isLoading } = useQuery({
        queryKey: ["singlePost"],
        queryFn: async () => {
            const { data } = await axios.get(`/api/post/${id}`);
            return data;
        }
    })

    useEffect(() => {
        document.title = isLoading ? "SocialNest | Loading" : `${post?.caption}`;
    }, [post?.caption, isLoading]);

    if (isLoading) return <Loading />
    return (
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center">
            <PostCard post={post} user={user} />
        </div>
    );
};

export default SinglePostPage;
