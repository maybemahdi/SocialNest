// components/PrivateRoute.tsx
"use client";

import Loading from '@/components/Loading';
import useAuth from '@/Hooks/useAuth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            return router.push("/public/login");
        }
    }, [loading, user, router]);

    if (loading) return <Loading />;

    return <>{children}</>;
};

export default PrivateRoute;
