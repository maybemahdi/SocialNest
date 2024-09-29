"use client"
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

const SingleUserPage = () => {
    const params = useParams();
    const { username } = params;
    useEffect(() => {
        document.title = `SocialNest | ${username}`;
    }, [username]);
    return (
        <div>
            <h1>User Profile for {username}</h1>
        </div>
    );
};

export default SingleUserPage;