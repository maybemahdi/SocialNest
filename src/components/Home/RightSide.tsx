"use client"
import useAuth from '@/Hooks/useAuth';
import Image from 'next/image';
import React from 'react';

const RightSide: React.FC = () => {
    const { user } = useAuth()
    console.log(user)
    return (
        <div style={{ minHeight: "calc(100vh - 115px)", top: "106px"}} className='sticky overflow-y-auto flex flex-col'>
            <div className='bg-slate-200 hover:bg-slate-300 transition-all duration-300 cursor-pointer rounded w-full px-3 py-2 flex justify-between items-center'>
                <Image src={user?.image} alt='PFP' height={30} width={30} />
                <p className='text-secondary font-semibold'>{user?.name}</p>
            </div>
        </div>
    );
};

export default RightSide;