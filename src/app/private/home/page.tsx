import Center from '@/components/Home/Center';
import LeftSide from '@/components/Home/LeftSide';
import RightSide from '@/components/Home/RightSide';
import React from 'react';

export const metadata = {
    title: "SocialNest | Home",
};

const Page: React.FC = () => {
    return (
        <div className="grid grid-cols-5 justify-center gap-6">
            <div className="col-span-1 hidden md:flex"><LeftSide /></div>
            <div className="md:col-span-3 col-span-5"><Center /></div>
            <div className="col-span-1 hidden md:flex"><RightSide /></div>
        </div>
    );
};

export default Page;