"use client";
import useAuth from "@/Hooks/useAuth";
import useGoProfile from "@/Hooks/useGoProfile";
import Image from "next/image";
import React from "react";

const RightSide: React.FC = () => {
  const { user } = useAuth();
  const goProfile = useGoProfile();

  return (
    <div
      style={{ minHeight: "calc(100vh - 115px)", top: "106px" }}
      className="sticky overflow-y-auto flex flex-col text-main w-full"
    >
      <h3 className="text-[16px] font-semibold mb-3">Your Profile and Pages</h3>
      <div
        onClick={goProfile}
        className="bg-slate-100 hover:bg-slate-300 transition-all duration-300 cursor-pointer rounded-md w-full px-3 py-2 flex items-center gap-4"
      >
        <Image
          className="rounded-full cursor-pointer h-[30px] w-[30px] object-cover"
          src={user?.image}
          objectFit="cover"
          alt="PFP"
          height={30}
          width={30}
        />
        <p className="font-medium">{user?.name}</p>
      </div>
    </div>
  );
};

export default RightSide;
