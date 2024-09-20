import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from '../ui/card';

const StorySlider = () => {
  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-sm sm:max-w-sm md:max-w-md relative"
      >
        <CarouselContent>
          {Array.from({ length: 10 }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
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
