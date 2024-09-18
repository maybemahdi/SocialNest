"use client";

import Link from "next/link";
import { FaBarsStaggered } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { AiFillHome } from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoLogOut, IoNotificationsSharp } from "react-icons/io5";
import toast from "react-hot-toast";

const Nav: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  // console.log(session)

  const navLinks = [
    { name: "Home", path: "/private/home" },
    { name: "Friends", path: "/private/friends" },
    { name: "Profile", path: "/private/profile" },
    { name: "Notifications", path: "/private/notifications" },
  ]

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
        toast.success("Log Out Successful")
        await signOut({ callbackUrl: "/public/login" });
      }
    });
  };

  return (
    <nav className="w-full md:py-3 py-2 bg-white shadow-md sticky top-0">
      <div className="flex justify-between items-center mx-auto w-[95%] py-4">
        <div>
          <Link href="/private/home" className="font-bold text-xl text-secondary">
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
                    pathname === link.path
                      ? "text-secondary"
                      : "text-slate-500"
                  }
                >
                  {link.name === "Home" && <AiFillHome size={30} />}
                  {link.name === "Friends" && <FaUserFriends size={30} />}
                  {link.name === "Profile" && <CgProfile size={30} />}
                  {link.name === "Notifications" && <IoNotificationsSharp size={30} />}
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
                  ? "bg-secondary text-sm text-white px-4 py-2 rounded-md"
                  : "bg-secondary text-sm text-white px-4 py-2 rounded transition-all duration-300"
              }
            >
              Login
            </Link>
          ) : (
            <button
              title="Log Out"
              onClick={handleSignOut}
              className="px-4 py-2 rounded-md bg-secondary text-sm text-white transition-all duration-300"
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
        className={`lg:hidden transition-all duration-300 ${open ? "max-h-96" : "max-h-0"
          } overflow-hidden`}
      >
        <ul className="flex flex-col gap-4 items-start pl-[22px] py-2 bg-white border-t border-gray-200">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                className={
                  pathname === link.path
                    ? "text-secondary font-bold"
                    : "text-black hover:text-secondary transition-all duration-300"
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
                  ? "bg-secondary text-sm text-white px-8 py-2 rounded-md"
                  : "bg-secondary text-sm text-white px-8 py-2 rounded transition-all duration-300"
              }
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleSignOut}
              className="px-12 py-2 rounded-md bg-secondary text-sm text-white transition-all duration-300"
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
