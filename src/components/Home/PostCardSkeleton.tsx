"use client"
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton"

const PostCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full mx-auto p-4">
            <div className="flex items-center mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="ml-3 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
            <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-48 w-full rounded-md mb-4" />
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
            </div>
        </div>
    );
};

export default PostCardSkeleton;