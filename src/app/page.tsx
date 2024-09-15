// app/page.tsx
"use client";

import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


const HomePage: React.FC = () => {

  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "authenticated") {
      router.push("/private/home");
    } else {
      router.push("/public/login");
    }
  }, [status, router]);

  return <Loading />;
};

export default HomePage;
