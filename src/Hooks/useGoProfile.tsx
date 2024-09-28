"use client"
import { useRouter } from 'next/navigation';


const useGoProfile = () => {
    const router = useRouter();

    const goProfile = (username : string) => {
        router.push(`/private/user/${username}`);
    };

    return goProfile;
};

export default useGoProfile;