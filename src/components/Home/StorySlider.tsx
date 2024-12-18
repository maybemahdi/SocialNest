// StorySlider.tsx
import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { FaPlusCircle } from "react-icons/fa";
import CreateStoryModal from "./CreateStoryModal";
import useStory from "@/Hooks/useStory";
import { Skeleton } from "../ui/skeleton";
import ShowStoryModal from "./ShowStoryModal";

interface StorySliderProps {
  user: User;
}
interface User {
  _id: string;
  image: string;
  email: string;
  username: string;
}
interface CurrentStory {
  storyImage: string;
  caption: string;
  image: string;
  name: string;
  createdAt: string;
}
interface Story {
  email: string;
  userId: string;
  username: string;
  storyImage: string;
  caption: string;
  name: string;
  image: string;
  createdAt: string;
}

const StorySlider: React.FC<StorySliderProps> = ({ user }) => {
  const { stories, isLoading } = useStory();
  const [isOpen, setIsOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [currentStory, setCurrentStory] = useState<CurrentStory>({
    storyImage: "",
    caption: "",
    image: "",
    name: "",
    createdAt: "",
  });

  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-sm md:max-w-lg relative"
      >
        <CarouselContent>
          <CarouselItem className="basis-1/3 md:basis-1/4">
            <div className="p-1">
              <div
                className="cursor-pointer"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <CardContent className="min-h-[125px] flex flex-col aspect-square items-center justify-center p-0 relative">
                  {!user?.image ? (
                    <div className="p-1">
                      <Card>
                        <CardContent className="min-h-[125px] flex flex-col aspect-square items-center justify-center p-0 relative">
                          <Skeleton className="h-full w-full rounded-lg" />
                          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-md"></div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <Image
                      className="w-full h-full rounded-lg object-cover"
                      src={user?.image}
                      alt="addStory"
                      height={300}
                      width={300}
                    />
                  )}
                  <p className="absolute py-2 bottom-0 text-sm bg-white w-full text-center rounded-b-md">
                    Create Story
                  </p>
                  <p className="absolute bottom-[20%] bg-white p-1 rounded-full">
                    <FaPlusCircle className="text-main" size={30} />
                  </p>
                  <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-md"></div>
                </CardContent>
              </div>
            </div>
            {/* create story modal  */}
            <CreateStoryModal isOpen={isOpen} setIsOpen={setIsOpen} />
          </CarouselItem>
          {!isLoading &&
            stories
              ?.filter((story: Story) => story?.userId === user?._id)
              .map((story: Story, index: number) => (
                <CarouselItem key={index} className="basis-1/3 md:basis-1/4">
                  <div className="p-1">
                    <div
                      onClick={() => {
                        setIsStoryOpen(true);
                        setCurrentStory(story);
                      }}
                      className="cursor-pointer relative"
                    >
                      <CardContent className="min-h-[125px] flex flex-col aspect-square items-center justify-center p-0 relative">
                        {story?.storyImage && story?.caption && (
                          <>
                            <Image
                              className="w-full h-full rounded-lg object-cover"
                              src={story?.storyImage}
                              alt="addStory"
                              height={300}
                              width={300}
                            />
                            <p className="absolute bottom-0 py-1 bg-white w-full text-center text-main">
                              {story?.caption}
                            </p>
                            <div className="absolute top-2 left-2 flex items-center gap-1">
                              <Image
                                className="rounded-full border-2 border-blue-500 object-cover"
                                alt="user-photo"
                                src={story?.image}
                                height={20}
                                width={20}
                              />
                              <p className="text-white text-[10px] text-shadow-lg font-semibold">
                                {story?.name}
                              </p>
                            </div>
                          </>
                        )}
                        {story?.storyImage && !story?.caption && (
                          <>
                            <Image
                              className="w-full h-full rounded-lg object-cover"
                              src={story?.storyImage}
                              alt="addStory"
                              height={300}
                              width={300}
                            />
                            <div className="absolute top-2 left-2 flex items-center gap-1">
                              <Image
                                className="rounded-full border-2 border-blue-500 object-cover"
                                alt="user-photo"
                                src={story?.image}
                                height={20}
                                width={20}
                              />
                              <p className="text-white text-[10px] text-shadow-lg font-semibold">
                                {story?.name}
                              </p>
                            </div>
                          </>
                        )}
                        {!story?.storyImage && story?.caption && (
                          <>
                            <div className="bg-main rounded-lg flex items-center justify-center h-full w-full">
                              <p className="px-4 text-center text-sm text-white font-bold">
                                {story?.caption}
                              </p>
                            </div>
                            <div className="absolute top-2 left-2 flex items-center gap-1">
                              <Image
                                className="rounded-full border-2 border-blue-500 object-cover"
                                alt="user-photo"
                                src={story?.image}
                                height={20}
                                width={20}
                              />
                              <p className="text-white text-[10px] text-shadow-lg font-semibold">
                                {story?.name}
                              </p>
                            </div>
                          </>
                        )}
                        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-md"></div>
                      </CardContent>
                    </div>
                  </div>
                  <ShowStoryModal
                    isStoryOpen={isStoryOpen}
                    setIsStoryOpen={setIsStoryOpen}
                    currentStory={currentStory}
                  />
                </CarouselItem>
              ))}
          {!isLoading &&
            stories
              ?.filter((story: Story) => story?.username !== user?.username)
              .map((story: Story, index: number) => (
                <CarouselItem key={index} className="basis-1/3 md:basis-1/4">
                  <div className="p-1">
                    <Card
                      onClick={() => {
                        setIsStoryOpen(true);
                        setCurrentStory(story);
                      }}
                      className="cursor-pointer relative"
                    >
                      <CardContent className="min-h-[125px] flex flex-col aspect-square items-center justify-center p-0 relative">
                        {story?.storyImage && story?.caption && (
                          <>
                            <Image
                              className="w-full h-full rounded-lg object-cover"
                              src={story?.storyImage}
                              alt="addStory"
                              height={300}
                              width={300}
                            />
                            <p className="absolute bottom-0 py-1 bg-white w-full text-center text-main">
                              {story?.caption}
                            </p>
                            <div className="absolute top-2 left-2 flex items-center gap-1">
                              <Image
                                className="rounded-full cursor-pointer h-[20px] w-[20px] object-cover"
                                alt="user-photo"
                                src={story?.image}
                                objectFit="cover"
                                height={20}
                                width={20}
                              />
                              <p className="text-white text-[10px] text-shadow-lg font-semibold">
                                {story?.name}
                              </p>
                            </div>
                          </>
                        )}
                        {story?.storyImage && !story?.caption && (
                          <>
                            <Image
                              className="w-full h-full rounded-lg object-cover"
                              src={story?.storyImage}
                              alt="addStory"
                              height={300}
                              width={300}
                            />
                            <div className="absolute top-2 left-2 flex items-center gap-1">
                              <Image
                                className="rounded-full cursor-pointer h-[20px] w-[20px] object-cover"
                                alt="user-photo"
                                src={story?.image}
                                objectFit="cover"
                                height={20}
                                width={20}
                              />
                              <p className="text-white text-[10px] text-shadow-lg font-semibold">
                                {story?.name}
                              </p>
                            </div>
                          </>
                        )}
                        {!story?.storyImage && story?.caption && (
                          <>
                            <div className="bg-main rounded-lg flex items-center justify-center h-full w-full">
                              <p className="px-4 text-center text-sm text-white font-bold">
                                {story?.caption}
                              </p>
                            </div>
                            <div className="absolute top-2 left-2 flex items-center gap-1">
                              <Image
                                className="rounded-full cursor-pointer h-[20px] w-[20px] object-cover"
                                alt="user-photo"
                                src={story?.image}
                                objectFit="cover"
                                height={20}
                                width={20}
                              />
                              <p className="text-white text-[10px] text-shadow-lg font-semibold">
                                {story?.name}
                              </p>
                            </div>
                          </>
                        )}
                        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-md"></div>
                      </CardContent>
                    </Card>
                  </div>
                  <ShowStoryModal
                    isStoryOpen={isStoryOpen}
                    setIsStoryOpen={setIsStoryOpen}
                    currentStory={currentStory}
                  />
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
