import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';
import { FaPlusCircle } from 'react-icons/fa';
import CreateStoryModal from './CreateStoryModal';

interface StorySliderProps {
  user: User;
}
interface User {
  image: string;
}

const StorySlider: React.FC<StorySliderProps> = ({ user }) => {

  let [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-sm sm:max-w-sm md:max-w-md relative"
      >
        <CarouselContent>
          <CarouselItem className="basis-1/3">
            <div className="p-1">
              <Card className='cursor-pointer' onClick={() => {
                setIsOpen(true)
              }}>
                <CardContent className="flex flex-col aspect-square items-center justify-center p-0 relative">
                  <Image className='w-full h-full rounded-lg' src={user?.image} alt='addStory' height={298} width={300} />
                  <p className='absolute py-2 bottom-0 text-sm bg-white w-full text-center rounded-b-md'>Create Story</p>
                  <p className='absolute bottom-[20%] bg-white p-1 rounded-full'>
                    <FaPlusCircle className='text-main' size={30} />
                  </p>
                  <div className='absolute top-0 left-0 w-full h-full bg-black opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-md'></div>
                </CardContent>
              </Card>
            </div>
            {/* create story modal  */}
            <CreateStoryModal isOpen={isOpen} setIsOpen={setIsOpen} />
          </CarouselItem>
          {Array.from({ length: 10 }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/3">
              <div className="p-1">
                <Card className='cursor-pointer relative'>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                    <div className='absolute top-0 left-0 w-full h-full bg-black opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-md'></div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2" />
        <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2" />
      </Carousel>
    </div>
  );
};

export default StorySlider;
