import React, { FormEvent, Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { MdCancel } from "react-icons/md";
import Image from "next/image";
import { X } from "lucide-react";
import ImageUpload from "../ImageUpload";
import axios from "axios";
import toast from "react-hot-toast";
import { ImSpinner9 } from "react-icons/im";
import Swal from "sweetalert2";
import usePost from "@/Hooks/usePost";

interface EditPostModalProps {
  editPostModalOpen: boolean;
  setEditPostModalOpen: (isOpen: boolean) => void;
  post: Post;
}
interface Post {
  _id: string;
  postImage: string;
  caption: string;
  createdAt: string;
  name: string;
  image: string;
  username: string;
  likes: Array<string>; // Assuming likes is an array of user IDs (strings)
  comments: Array<Comment>; // Assuming comments is an array of comment objects
}

interface Comment {
  _id: string;
  userImage: string;
  username: string;
  comment: string;
  replies: Array<Reply>;
  createdAt: string;
}

interface Reply {
  _id: string;
  userImage: string;
  username: string;
  comment: string;
  createdAt: string;
}

const imgbb_api_key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
const img_hosting_api = `https://api.imgbb.com/1/upload?key=${imgbb_api_key}`;

const EditPostModal: React.FC<EditPostModalProps> = ({
  editPostModalOpen,
  setEditPostModalOpen,
  post,
}) => {
  const { refetch } = usePost();
  const [visibleImage, setVisibleImage] = useState(
    post?.postImage ? true : false
  );
  const [imgLoading, setImgLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
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

  const handleUpdatePost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const caption =
      (form.elements.namedItem("caption") as HTMLInputElement).value || null;
    const postImage = !visibleImage ? imageUrl : post?.postImage;
    if (!postImage && !caption) {
      return toast.error("Please Write your Post");
    }
    try {
      setProcessing(true);
      const { data } = await axios.patch(
        `/private/home/api/updatePost/${post?._id}`,
        { caption, postImage }
      );
      if (data?.updated) {
        setProcessing(false);
        Swal.fire({
          title: "Good job!",
          text: "Post Updated!",
          icon: "success",
        });
        refetch();
        setEditPostModalOpen(false);
      } else {
        setProcessing(false);
        toast.error(data?.message || "Error While updating");
      }
    } catch (error) {
      setProcessing(false);
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
      <Transition appear show={editPostModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative w-full z-[1000]"
          onClose={() => {
            setEditPostModalOpen(false);
            setVisibleImage(true);
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
                  <form onSubmit={handleUpdatePost} className="w-full">
                    <div className="relative w-full flex flex-col justify-start items-start h-[500px] p-5 overflow-y-auto">
                      <h3 className="mb-5">Edit Your Post</h3>
                      <div className="flex items-center mb-4">
                        <Image
                          src={post?.image}
                          alt={`${post?.username}'s avatar`}
                          className="rounded-full h-11 w-11 object-cover"
                          objectFit="cover"
                          width={44}
                          height={44}
                        />
                        <div className="ml-3">
                          <h2 className="font-semibold text-gray-800 w-fit">
                            {post?.username}
                          </h2>
                        </div>
                      </div>
                      {post?.caption && (
                        <input
                          name="caption"
                          defaultValue={post?.caption}
                          placeholder="Write Post Caption"
                          className="w-full mb-2 resize-none py-2 bg-transparent border-b border-gray-300 focus:border-primary focus:outline-none placeholder-gray-400 transition-colors"
                        />
                      )}
                      {!post?.caption && (
                        <input
                          name="caption"
                          placeholder="Write Post Caption"
                          className="w-full mb-2 resize-none py-2 bg-transparent border-b border-gray-300 focus:border-primary focus:outline-none placeholder-gray-400 transition-colors"
                        />
                      )}
                      {post?.postImage && visibleImage && (
                        <div className="mb-4 relative">
                          <Image
                            src={post?.postImage}
                            alt="Post image"
                            width={500}
                            height={300}
                            layout="responsive"
                            className="rounded-md"
                          />
                          <button
                          type="button"
                            onClick={() => setVisibleImage(false)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1 hover:bg-red-600 transition duration-150 ease-in-out"
                            aria-label="Remove image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {!visibleImage && (
                        <ImageUpload
                          handleImage={handleImage}
                          setImageUrl={setImageUrl}
                        />
                      )}
                    </div>
                    <div className="absolute bottom-0 bg-white w-full p-2">
                      <button
                        disabled={imgLoading || processing}
                        type="submit"
                        className="disabled:bg-slate-200 disabled:cursor-not-allowed inline-flex justify-center w-full transition-all duration-300 rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        //   onClick={() => setIsOpen(false)}
                      >
                        {!processing ? (
                          "Update"
                        ) : (
                          <ImSpinner9 size={20} className="animate-spin" />
                        )}
                      </button>
                    </div>
                  </form>
                  <button
                    type="button"
                    className="inline-flex absolute top-1 right-3 justify-center border border-transparent rounded-full p-2 text-sm font-medium text-rose-500 hover:text-slate-300 transition-all duration-300"
                    onClick={() => {
                      setEditPostModalOpen(false);
                      setVisibleImage(true);
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

export default EditPostModal;
