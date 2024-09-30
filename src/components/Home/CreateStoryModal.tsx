import React, { FormEvent, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import ImageUpload from "../ImageUpload";
import toast from "react-hot-toast";
import axios from "axios";
import useAuth from "@/Hooks/useAuth";
import Swal from "sweetalert2";
import useStory from "@/Hooks/useStory";
import { ImSpinner9 } from "react-icons/im";

interface StoryModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const imgbb_api_key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
const img_hosting_api = `https://api.imgbb.com/1/upload?key=${imgbb_api_key}`;

const CreateStoryModal: React.FC<StoryModalProps> = ({ isOpen, setIsOpen }) => {
  const { refetch } = useStory();
  const { user } = useAuth();
  const [imgLoading, setImgLoading] = useState(false);
  const [processing, setIsProcessing] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // handle image
  const handleImage = async (file: File | null) => {
    if (!file) return;
    const image = file;
    const formData = new FormData();
    formData.append("image", image);
    try {
      setImgLoading(true);
      const { data } = await axios.post(img_hosting_api, formData);
      setImgLoading(false);
      setImageUrl(data.data.display_url);
    } catch (error) {
      console.log(error);
      toast.error("Problem while uploading image!");
      setImgLoading(false);
    }
  };

  //create story
  const handleCreateStory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const caption = (form.elements.namedItem("caption") as HTMLInputElement)
      .value;
    const storyImage = imageUrl || null;
    if (!imageUrl && !caption) {
      return toast.error("Please Write your Story");
    }
    const storyInfo = {
      caption,
      storyImage,
      userId: user?._id,
      username: user?.username,
      name: user?.name,
      email: user?.email,
      image: user?.image,
      provider: user?.provider,
      role: user?.role,
    };
    try {
      setIsProcessing(true);
      const { data } = await axios.post(
        "/private/home/api/createStory",
        storyInfo
      );
      if (data?.uploaded) {
        setIsProcessing(false);
        Swal.fire({
          title: "Good job!",
          text: "Story Uploaded!",
          icon: "success",
        });
        refetch();
        setIsOpen(false);
      }
    } catch (error) {
      setIsProcessing(false);
      form.reset();
      if (error instanceof Error) {
        console.error("Post Error:", error);
        toast.error(error.message || "An error occurred");
      } else {
        console.error("Post Error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 w-full"
          onClose={() => {
            setIsOpen(false);
            setImageUrl(null);
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
                <DialogPanel className="w-full max-w-xl transform overflow-visible rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium text-center leading-6 text-main"
                  >
                    Your story will automatically removed after 24 hours
                  </DialogTitle>
                  <div className="mt-2 w-full">
                    {/* create story form/uploadImage/text */}
                    <ImageUpload
                      handleImage={handleImage}
                      setImageUrl={setImageUrl}
                    />
                    <form
                      onSubmit={handleCreateStory}
                      className="max-w-md mx-auto mt-2"
                    >
                      <input
                        type="text"
                        name="caption"
                        placeholder={"Story Caption"}
                        className="w-full py-2 bg-transparent border-b border-gray-300 focus:border-primary focus:outline-none placeholder-gray-400 transition-colors"
                      />
                      <hr className="my-5 " />
                      <div className="flex justify-center gap-4 items-center">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                          onClick={() => {
                            setIsOpen(false);
                            setImageUrl(null);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          disabled={imgLoading || processing}
                          type="submit"
                          className="disabled:bg-slate-200 disabled:cursor-not-allowed inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          //   onClick={() => setIsOpen(false)}
                        >
                          {!processing ? (
                            "Post"
                          ) : (
                            <ImSpinner9 size={20} className="animate-spin" />
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CreateStoryModal;
