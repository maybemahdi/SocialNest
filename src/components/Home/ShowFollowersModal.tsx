import useAuth from "@/Hooks/useAuth";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import Link from "next/link";
import React, { Fragment } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { SlUserFollow, SlUserFollowing } from "react-icons/sl";

interface Followers {
  followers: Array<string>;
  showFollowers: boolean;
  setShowFollowers: (showFollowers: boolean) => void;
}

const ShowFollowersModal: React.FC<Followers> = ({
  followers,
  setShowFollowers,
  showFollowers,
}) => {
  const { user } = useAuth();
  return (
    <>
      <Transition appear show={showFollowers} as={Fragment}>
        <Dialog
          as="div"
          className="relative w-full z-[1000]"
          onClose={() => {
            setShowFollowers(false);
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
                      <h3 className="mb-5">Follower</h3>
                      {followers?.map((follower, idx: number) => (
                        <div
                          key={idx}
                          className="flex w-full items-center gap-4 bg-slate-200 rounded p-2 mb-2"
                        >
                          <Link
                            href={`/private/user/${follower}`}
                            className="flex-1 text-left text-main hover:underline transition duration-300"
                          >
                            {follower}
                          </Link>
                          {user?.username === follower && (
                            <FaUserCircle
                            title="You"
                              size={23}
                              className="text-main"
                            />
                          )}
                          {user?.following.includes(follower) && (
                            <SlUserFollowing
                              size={23}
                              className="text-blue-500 cursor-pointer"
                            />
                          )}
                          {!user?.following.includes(follower) && user?.username !== follower && (
                            <SlUserFollow
                              size={23}
                              className="text-blue-500 cursor-pointer"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="inline-flex absolute top-1 right-3 justify-center border border-transparent rounded-full p-2 text-sm font-medium text-rose-500 hover:text-slate-300 transition-all duration-300"
                    onClick={() => {
                      setShowFollowers(false);
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

export default ShowFollowersModal;
