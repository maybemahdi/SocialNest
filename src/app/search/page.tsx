"use client";
import useGoProfile from "@/Hooks/useGoProfile";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import { IoSearch } from "react-icons/io5";

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const goProfile = useGoProfile();
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    setSearch(form.search.value);
  };
  const { data: allUserData } = useQuery({
    queryKey: ["allUserData", search],
    queryFn: async () => {
      const { data } = await axios.get("/home/api/allUserData", {
        params: { search },
      });
      return data;
    },
    enabled: !!search,
  });
  return (
    <div
      style={{ minHeight: "calc(100vh - 115px)", top: "106px" }}
      className="overflow-y-auto w-full rounded min-h-screen sticky"
    >
      <form onSubmit={handleSearch} className="w-full relative">
        <input
          type="text"
          name="search"
          placeholder="Search..."
          className="border border-[#e5eaf2] py-3 pl-4 pr-[65px] outline-none w-full rounded-md"
        />

        <button
          type="submit"
          className="bg-gray-300 text-gray-500 absolute top-0 right-0 h-full px-5 flex items-center justify-center rounded-r-md cursor-pointer transition-all duration-300 hover:bg-gray-400 group"
        >
          <IoSearch className="text-[1.3rem]  group-hover:text-gray-200" />
        </button>
      </form>

      <div className="flex flex-col items-center gap-4 my-5 max-w-md">
        {allUserData?.map((user, idx) => (
          <div
            key={idx}
            onClick={() => goProfile(user?.username)}
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
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
