// ShowStoryModal.tsx
import React, { Fragment } from "react";
import { formatDistanceToNow } from "date-fns";
import { MdCancel } from "react-icons/md";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import Image from "next/image";

interface ShowStoryModalProps {
  isStoryOpen: boolean;
  setIsStoryOpen: (isOpen: boolean) => void;
  currentStory: CurrentStory;
}

interface CurrentStory {
  storyImage: string;
  caption: string;
  image: string;
  name: string;
  createdAt: string;
}

const ShowStoryModal: React.FC<ShowStoryModalProps> = ({
  isStoryOpen,
  setIsStoryOpen,
  currentStory,
}) => {
  const timeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return formatDistanceToNow(date, { addSuffix: true });
  };
  return (
    <>
      <Transition appear show={isStoryOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative w-full z-[1000]"
          onClose={() => {
            setIsStoryOpen(false);
          }}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-visible rounded-2xl bg-white align-middle shadow-xl transition-all relative">
                  <div className="w-full">
                    {currentStory?.caption && currentStory?.storyImage && (
                      <>
                        <Image
                          className="relative w-full h-full rounded-2xl"
                          alt="Story-Image"
                          src={currentStory?.storyImage}
                          height={300}
                          width={300}
                        />
                        <p className="text-left absolute bottom-0 bg-white w-full p-3 rounded-b-2xl font-semibold">
                          {currentStory?.caption}
                        </p>
                        <div className="absolute top-4 left-4 flex items-center justify-center gap-2">
                          <Image
                            className="rounded-full border-2 border-blue-500 object-cover"
                            alt="user-photo"
                            src={currentStory?.image}
                            height={30}
                            width={30}
                          />
                          <p className="text-white text-[16px] text-shadow-lg font-semibold">
                            {currentStory?.name}
                          </p>
                          <p className="text-white mt-[7px] text-[8px] text-shadow-lg font-normal">
                            {currentStory?.createdAt &&
                              timeAgo(currentStory.createdAt)}
                          </p>
                        </div>
                      </>
                    )}
                    {!currentStory?.caption && currentStory?.storyImage && (
                      <>
                        <Image
                          className="relative w-full h-full rounded-2xl"
                          alt="Story-Image"
                          src={currentStory?.storyImage}
                          height={300}
                          width={300}
                        />
                        <div className="absolute top-4 left-4 flex items-center justify-center gap-2">
                          <Image
                            className="rounded-full border-2 border-blue-500 object-cover"
                            alt="user-photo"
                            src={currentStory?.image}
                            height={30}
                            width={30}
                          />
                          <p className="text-white text-[16px] text-shadow-lg font-semibold">
                            {currentStory?.name}
                          </p>
                          <p className="text-white mt-[7px] text-[8px] text-shadow-lg font-normal">
                            {currentStory?.createdAt &&
                              timeAgo(currentStory.createdAt)}
                          </p>
                        </div>
                      </>
                    )}
                    {currentStory?.caption && !currentStory?.storyImage && (
                      <div className="relative flex items-center justify-center text-white bg-main h-[300px] p-3 rounded-2xl font-semibold text-center">
                        <p className="text-xl">{currentStory?.caption}</p>
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <Image
                            className="rounded-full border-2 border-blue-500 object-cover"
                            alt="user-photo"
                            src={currentStory?.image}
                            height={30}
                            width={30}
                          />
                          <p className="text-white text-[16px] text-shadow-lg font-semibold">
                            {currentStory?.name}
                          </p>
                          <p className="text-white mt-[7px] text-[8px] text-shadow-lg font-normal">
                            {currentStory?.createdAt &&
                              timeAgo(currentStory.createdAt)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="inline-flex absolute top-1 right-1 justify-center border border-transparent rounded-full p-2 text-sm font-medium text-rose-500 hover:text-slate-200 transition-all duration-300"
                    onClick={() => {
                      setIsStoryOpen(false);
                    }}
                  >
                    <MdCancel size={30} />
                  </button>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ShowStoryModal;
