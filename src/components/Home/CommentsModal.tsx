import useAuth from "@/Hooks/useAuth";
import useGoProfile from "@/Hooks/useGoProfile";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { Send } from "lucide-react";
import Image from "next/image";
import React, { FormEvent, Fragment, useState } from "react";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { FaReply } from "react-icons/fa6";
import { ImCancelCircle, ImSpinner9 } from "react-icons/im";
import { MdCancel } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";

interface CommentsModalProps {
  comments: Array<Comment>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setComments: (comments: Comment[]) => void;
  postId: string;
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

const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  setIsOpen,
  comments,
  setComments,
  postId,
}) => {
  const [processing, setProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [commentForEdit, setCommentForEdit] = useState<Comment | null>(null);
  const { user } = useAuth();
  const goProfile = useGoProfile();

  // post a comment
  const handleComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const comment = (form.elements.namedItem("comment") as HTMLInputElement)
      .value;
    const commentInfo = {
      comment,
      userImage: user?.image,
      username: user?.username,
      replies: [],
    };
    try {
      setProcessing(true);
      const { data } = await axios.put("/private/home/api/createComment", {
        commentInfo,
        postId,
      });
      if (data?.message === "Comment added successfully") {
        form.reset();
        setProcessing(false);
        setComments([...comments, data?.newComment]);
        toast.success(data?.message);
      }
      if (data?.status === "Post not found or comment not added") {
        setProcessing(false);
        toast.error(data?.message);
      }
    } catch (error) {
      setProcessing(false);
      form.reset();
      if (error instanceof Error) {
        console.error("Comment Error:", error);
        toast.error(error.message || "An error occurred");
      } else {
        console.error("Comment Error:", error);
        toast.error("An unexpected error occurred");
      }
    }
  };
  //delete a comment
  const handleDeleteComment = async (id: string, postId: string) => {
    try {
      const { data } = await axios.delete(`/private/home/api/deleteComment`, {
        data: { postId, commentId: id },
      });
      if (data?.message === "Comment deleted successfully") {
        toast?.success("Comment Deleted");
        setComments(data?.comments);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("An error occurred while deleting the comment.");
    }
  };
  // edit a comment
  const handleEditComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const comment = (form.elements.namedItem("comment") as HTMLInputElement)
      .value;
    try {
      setProcessing(true);
      const { data } = await axios.patch("/private/home/api/editComment", { postId, commentId: commentForEdit?._id, comment });
      if (data?.message === "Comment updated successfully") {
        form.reset()
        toast.success("Your Comment has been updated")
        setProcessing(false)
        setIsEditing(false)
        setComments(data?.comments);
        setCommentForEdit(null)
      }
    } catch (error) {
      setProcessing(false);
      console.error("Error updating comment:", error);
      toast.error("An error occurred while updating the comment.");
    }
  }
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative w-full z-[1000]"
          onClose={() => {
            setIsOpen(false);
            setIsEditing(false);
            setProcessing(false);
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
                    <div className="relative w-full flex flex-col justify-start items-start h-[500px] p-5 overflow-y-auto">
                      <h3 className="mb-5">Comments</h3>
                      <div className="flex flex-col items-start justify-start gap-4 w-full py-4 bg-white rounded-md">
                        {comments
                          ?.sort(
                            (a, b) =>
                              new Date(b.createdAt).getTime() -
                              new Date(a.createdAt).getTime()
                          )
                          ?.map((comment, idx) => (
                            <div
                              className="flex shadow-md items-center gap-3 w-full bg-gray-50 p-3 rounded-lg"
                              key={idx}
                            >
                              {/* User Image */}
                              <Image
                                onClick={() => {
                                  goProfile(comment?.username);
                                }}
                                className="cursor-pointer object-cover rounded-full h-[44px] w-[44px]"
                                objectFit="cover"
                                alt="User Profile"
                                height={44}
                                width={44}
                                src={comment?.userImage}
                              />
                              {/* Comment Content */}
                              <div className="flex flex-col gap-1 text-main w-full">
                                {/* Username */}
                                <div className="flex justify-between items-center">
                                  <p
                                    onClick={() => {
                                      goProfile(comment?.username);
                                    }}
                                    className="cursor-pointer font-semibold text-sm text-gray-800"
                                  >
                                    {comment?.username}
                                  </p>
                                  {/* Timestamp */}
                                  <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(
                                      new Date(comment?.createdAt),
                                      {
                                        addSuffix: true,
                                      }
                                    )}
                                  </span>
                                </div>
                                {/* Comment Text */}
                                <div className="flex justify-between items-center">
                                  <p className="text-sm text-gray-700 text-left">
                                    {comment?.comment}
                                  </p>
                                  {/* edit/delete */}
                                  <div className="flex gap-3">
                                    {comment?.username === user?.username && (
                                      <>
                                        <button
                                          disabled={isEditing || processing}
                                          className="disabled:cursor-not-allowed"
                                        >
                                          <FaRegEdit
                                            onClick={() => {
                                              setIsEditing(true);
                                              setCommentForEdit(
                                                comment
                                              );
                                            }}
                                            title="Edit your comment"
                                            className="cursor-pointer transition duration-300 hover:text-blue-500"
                                          />
                                        </button>
                                        <button
                                          disabled={isEditing || processing}
                                          className="disabled:cursor-not-allowed"
                                        >
                                          <RiDeleteBinLine
                                            title="Delete your comment"
                                            onClick={() =>
                                              handleDeleteComment(
                                                comment?._id,
                                                postId
                                              )
                                            }
                                            className="cursor-pointer transition duration-300  hover:text-rose-500"
                                          />
                                        </button>
                                      </>
                                    )}
                                    <button
                                      disabled={isEditing || processing}
                                      className="disabled:cursor-not-allowed"
                                    >
                                      <FaReply
                                        title="Reply to this Comment"
                                        className="cursor-pointer transition duration-300  hover:text-blue-500"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                      {!isEditing ? (
                        <form
                          onSubmit={handleComment}
                          className="w-[90%] mx-auto mt-2 flex items-center absolute bottom-5 bg-slate-200 rounded-full px-3"
                        >
                          <textarea
                            name="comment"
                            placeholder={"Write your Comment"}
                            rows={1}
                            required
                            className="flex-1 w-full resize-none py-2 bg-transparent rounded-lg focus:border-primary focus:outline-none placeholder-gray-400 transition-colors"
                          />
                          <button
                            disabled={processing}
                            type="submit"
                            className="cursor-pointer flex justify-center gap-4 items-center bg-slate-100 p-1 rounded-full"
                          >
                            {!processing ? (
                              <Send size={20} className="text-blue-500" />
                            ) : (
                              <ImSpinner9 size={20} className="animate-spin" />
                            )}
                          </button>
                        </form>
                      ) : (
                        <form
                          onSubmit={handleEditComment}
                          className="w-[90%] absolute bottom-5 mx-auto mt-2 flex items-center bg-slate-200 rounded-full px-3"
                        >
                          <textarea
                            name="comment"
                            defaultValue={commentForEdit?.comment}
                            placeholder="Edit Your Comment"
                            rows={1}
                            required
                            className="flex-1 w-full resize-none py-2 bg-transparent rounded-lg focus:border-primary focus:outline-none placeholder-gray-400 transition-colors"
                          />
                          <button
                            disabled={processing}
                            type="submit"
                            className="cursor-pointer flex justify-center gap-4 items-center bg-slate-100 p-1 rounded-full"
                          >
                            {!processing ? (
                              <Send size={20} className="text-blue-500" />
                            ) : (
                              <ImSpinner9 size={20} className="animate-spin" />
                            )}
                          </button>
                          <button
                            disabled={processing}
                            className="ml-1 cursor-pointer flex justify-center gap-4 items-center bg-slate-100 p-1 rounded-full"
                          >
                            <ImCancelCircle
                              onClick={() => setIsEditing(false)}
                              size={20}
                              className="text-rose-500"
                            />
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="inline-flex absolute top-1 right-3 justify-center border border-transparent rounded-full p-2 text-sm font-medium text-rose-500 hover:text-slate-300 transition-all duration-300"
                    onClick={() => {
                      setIsOpen(false);
                      setProcessing(false);
                      setIsEditing(false);
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

export default CommentsModal;
