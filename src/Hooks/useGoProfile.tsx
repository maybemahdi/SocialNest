"use client"
import { useRouter } from 'next/navigation';

const useGoProfile = () => {
    const router = useRouter();

    const goProfile = () => {
        router.push("/private/profile");
    };

    return goProfile;
};

export default useGoProfile;