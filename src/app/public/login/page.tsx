"use client"
import Loading from "@/components/Loading";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";


const Page: React.FC = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)
    const [extraLoading, setExtraLoading] = useState(true)
    const { status } = useSession();

    useEffect(() => {
        document.title = status === "authenticated" ? "Redirecting..." : "SocialNest | Login";
    }, [status]);

    useEffect(() => {
        if (status === "loading") {
            return;
        }
        if (status === "authenticated") {
            router.push("/private/home");
        } else {
            setExtraLoading(false);
        }
    }, [status, router]);

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true)
        const form = e.target as HTMLFormElement;
        const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        console.log(res);
        if (res?.status === 401) {
            setIsLoading(false)
            form.reset();
            return toast.error("Wrong Credentials");
        }
        if (res?.status === 200) {
            toast.success("Login Successful");
            form.reset();
            router.push("/");
            setIsLoading(false)
        }
    };

    const handleSocialSignIn = async (provider: string) => {
        await signIn(provider, { callbackUrl: "/private/home" });
    };

    if (status === "loading" || isLoading || extraLoading) {
        return <Loading />
    }
    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen text-main"
        >
            <div className="rounded shadow-md md:w-[30%] w-full mx-auto p-5">
                <h3 className="text-2xl text-center mb-5">Login</h3>
                <form onSubmit={handleLogin} className="flex flex-col gap-3">
                    <input
                        type="email"
                        name="email"
                        className="w-full border p-3 rounded"
                        placeholder="Enter Your Email"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        className="w-full border p-3 rounded"
                        placeholder="Enter Your Password"
                        required
                    />
                    <p className="text-[10px] ml-1 cursor-pointer">Forget Password?</p>
                    <button className="w-full bg-main rounded text-white p-2">
                        Login
                    </button>
                </form>
                <p className="text-base my-3 text-center">
                    New to SocialNest?{" "}
                    <span>
                        <Link className="text-blue-500 cursor-pointer" href={"/public/register"}>
                            Create an Account
                        </Link>
                    </span>
                </p>
                <div className="flex items-center my-3">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500">Or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <button
                    onClick={() => handleSocialSignIn("google")}
                    className="w-full text-gray-600 border hover:text-white hover:bg-main transition-all duration-300 border-gray-600 rounded p-2"
                >
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

export default Page;
