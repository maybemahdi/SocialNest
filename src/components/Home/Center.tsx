/* eslint-disable react/no-unescaped-entities */
"use client"
import useAuth from '@/Hooks/useAuth';
import useGoProfile from '@/Hooks/useGoProfile';
import Image from 'next/image';
import React from 'react';
import { IoMdPhotos } from 'react-icons/io';
import { RiLiveFill } from 'react-icons/ri';
import StorySlider from './StorySlider';

const Center = () => {
    const { user } = useAuth();
    const goProfile = useGoProfile()
    return (
        <div className='w-full rounded flex flex-col items-center'>
            {/* post section */}
            <div className='bg-white shadow-md rounded-md flex flex-col gap-3 p-3 md:px-8 m:py-3 md:w-3/4 w-full mx-auto'>
                <div className='flex items-center justify-center gap-5'>
                    <Image onClick={goProfile} className='rounded-full' src={user?.image} height={30} width={40} alt='PFP' />
                    <p className='bg-slate-100 hover:bg-slate-200 transition-all duration-300 rounded-3xl px-4 py-2 flex-1 text-gray-400 cursor-pointer'>What's on your mind, {user?.name}?</p>
                </div>
                <hr />
                <div className='flex items-center gap-5'>
                    <div className='flex items-center gap-2 p-2 hover:bg-slate-200 transition-all duration-300 rounded-md cursor-pointer'>
                        <IoMdPhotos className='text-green-700' size={30} />
                        <p className='text-base text-[#16423C] font-medium'>Photo/Video</p>
                    </div>
                    <div title='Coming Soon' className='flex items-center gap-2 p-2 hover:bg-slate-200 transition-all duration-300 rounded-md cursor-not-allowed'>
                        <RiLiveFill className='text-rose-500' size={30} />
                        <p className='text-base text-[#16423C] font-medium'>Go live</p>
                    </div>
                </div>
            </div>
            {/* story section  */}
            <div className='my-3'>
                <StorySlider />
            </div>
        </div>
    );
};

export default Center;