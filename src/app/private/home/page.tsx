import Center from '@/components/Home/Center';
import LeftSide from '@/components/Home/LeftSide';
import RightSide from '@/components/Home/RightSide';
import React from 'react';

export const metadata = {
    title: "SocialNst | Home",
};

const Page: React.FC = () => {
    return (
        <div className="grid grid-cols-5 justify-center gap-6">
            <div className="col-span-1"><LeftSide /></div>
            <div className="col-span-3"><Center /></div>
            <div className="col-span-1"><RightSide /></div>
        </div>
    );
};

export default Page;