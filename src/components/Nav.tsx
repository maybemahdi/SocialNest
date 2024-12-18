"use client";

import Link from "next/link";
import { FaBarsStaggered } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { AiFillHome } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import {
  IoLogOut,
  IoNotificationsSharp,
  IoSettingsSharp,
} from "react-icons/io5";
import toast from "react-hot-toast";
import usePost from "@/Hooks/usePost";
import useStory from "@/Hooks/useStory";
import useAuth from "@/Hooks/useAuth";
import { LuSearch } from "react-icons/lu";

const Nav: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { data: session } = useSession();
  const { user } = useAuth();
  const pathname = usePathname();
  const { refetch: postRefetch } = usePost();
  const { refetch: storyRefetch } = useStory();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Profile", path: `/user/${user?.username}` },
    { name: "Setting", path: "/setting" },
    { name: "Notifications", path: "/notifications" },
    { name: "Search", path: "/search" },
  ];

  const handleSignOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Sign Out!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        toast.success("Log Out Successful");
        await signOut({ callbackUrl: "/public/login" });
      }
    });
  };

  const handleRefetch = async () => {
    try {
      await postRefetch();
      await storyRefetch();
    } catch (error) {
      console.error("Refetch error:", error);
    }
  };

  return (
    <nav className="w-full md:py-3 py-2 bg-white shadow-md sticky top-0 z-[100]">
      <div className="flex justify-between items-center mx-auto w-[95%] py-4">
        <div>
          <Link
            onClick={handleRefetch}
            href="/"
            className="font-bold text-xl text-main"
          >
            SocialNest
          </Link>
        </div>
        <div className="hidden lg:flex">
          <ul className="flex gap-20 items-center justify-center">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={
                    pathname === link.path ? "text-main" : "text-slate-500"
                  }
                >
                  {link.name === "Home" && (
                    <AiFillHome onClick={handleRefetch} size={30} />
                  )}
                  {link.name === "Profile" && <CgProfile size={30} />}
                  {link.name === "Setting" && <IoSettingsSharp size={30} />}
                  {link.name === "Notifications" && (
                    <IoNotificationsSharp size={30} />
                  )}
                  {link.name === "Search" && <LuSearch size={30} />}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden lg:block">
          {!session ? (
            <Link
              href={"/login"}
              className={
                pathname === "/login"
                  ? "bg-main text-sm text-white px-4 py-2 rounded-md"
                  : "bg-main text-sm text-white px-4 py-2 rounded transition-all duration-300"
              }
            >
              Login
            </Link>
          ) : (
            <button
              title="Log Out"
              onClick={handleSignOut}
              className="px-4 py-2 rounded-md bg-main text-sm text-white transition-all duration-300"
            >
              <IoLogOut />
            </button>
          )}
        </div>
        <div className="lg:hidden">
          <button onClick={() => setOpen(!open)} aria-label="Toggle Menu">
            {!open ? <FaBarsStaggered size={20} /> : <RxCross2 size={25} />}
          </button>
        </div>
      </div>
      <div
        className={`lg:hidden transition-all duration-300 ${
          open ? "max-h-96" : "max-h-0"
        } overflow-hidden`}
      >
        <ul className="flex flex-col gap-4 items-start pl-[22px] py-2 bg-white border-t border-gray-200">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                className={
                  pathname === link.path
                    ? "text-main font-bold"
                    : "text-black hover:text-main transition-all duration-300"
                }
                onClick={() => setOpen(false)} // Close menu on link click
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="px-[20px] py-2">
          {!session ? (
            <Link
              href={"/login"}
              className={
                pathname === "/login"
                  ? "bg-main text-sm text-white px-8 py-2 rounded-md"
                  : "bg-main text-sm text-white px-8 py-2 rounded transition-all duration-300"
              }
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleSignOut}
              className="px-12 py-2 rounded-md bg-main text-sm text-white transition-all duration-300"
            >
              <IoLogOut size={25} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
