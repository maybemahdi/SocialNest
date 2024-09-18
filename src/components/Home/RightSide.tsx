"use client"
import useAuth from '@/Hooks/useAuth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const RightSide: React.FC = () => {
    const { user } = useAuth()
    const router = useRouter()
    const goProfile = () => {
        router.push("/private/profile")
    }
    return (
        <div style={{ minHeight: "calc(100vh - 115px)", top: "106px" }} className='sticky overflow-y-auto flex flex-col text-secondary'>
            <h3 className='text-lg font-semibold mb-3'>Your Profile and Pages</h3>
            <div onClick={goProfile} className='bg-slate-100 hover:bg-slate-300 transition-all duration-300 cursor-pointer rounded w-full px-3 py-2 flex justify-between items-center'>
                <Image className='rounded-full' src={user?.image} alt='PFP' height={30} width={30} />
                <p className='font-semibold'>{user?.name}</p>
            </div>
        </div>
    );
};

export default RightSide;