"use client"
import { useParams } from 'next/navigation';
import React from 'react';

const Page = () => {
    const params = useParams();
    const { username } = params;
    return (
        <div>
            <h1>User Profile for {username}</h1>
        </div>
    );
};

export default Page;