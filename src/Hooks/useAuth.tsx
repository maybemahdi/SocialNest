"use client"
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { signOut, useSession } from "next-auth/react";

const useAuth = () => {
    const { data: session, status } = useSession();

    const { data: user, refetch, isLoading } = useQuery({
        queryKey: ["user"],
        enabled: !!session?.user,
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/api/getCurrentUser/${session?.user?.email}`)
                return data;
            } catch (error) {
                if (error instanceof AxiosError && error.response?.status === 401) {
                    await signOut({ callbackUrl: "/public/login" }); // Log the user out
                }
                throw error;
            }
        }
    })

    return {
        user,
        loading: status === 'loading' || isLoading,
        refetch,
    };
};

export default useAuth;
