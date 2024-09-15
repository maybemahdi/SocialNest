"use client"
import Loading from '@/components/Loading';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

const Page: React.FC = () => {
    const router = useRouter();
    const { status } = useSession();
    const [isLoading, setIsLoading] = useState(false)

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;
        const newUser = { name, email, password };

        try {
            setIsLoading(true)
            const { data } = await axios.post(`/public/register/api`, newUser);
            console.log(data);
            if (data?.created) {
                toast.success("Account Created Successfully");
                // Automatically sign the user in after successful sign-up
                const result = await signIn("credentials", {
                    redirect: false,
                    email: newUser.email,
                    password: newUser.password,
                });
                if (result?.error) {
                    setIsLoading(false)
                    toast.error("Signing Failed, Try Logging In");
                } else {
                    // Redirect to the desired page after successful login
                    setIsLoading(false)
                    form.reset();
                    router.push("/private/home");
                }
            }
        } catch (error: unknown) {
            setIsLoading(false)
            form.reset();
            if (error instanceof Error) {
                console.error("Registration Error:", error);
                toast.error(error.message || "An error occurred");
            } else {
                console.error("Registration Error:", error);
                toast.error("An unexpected error occurred");
            }
        }
    };

    const handleSocialSignIn = async (provider: string) => {
        await signIn(provider, { callbackUrl: "/private/home" });
    };

    if(isLoading || status === "loading") {
        return <Loading />
    }

    if (status === "authenticated") {
        router.push("/private/home");
    }
    return (
        <div
            style={{ minHeight: "calc(100vh - 115px)" }}
            className="flex flex-col items-center justify-center"
        >
            <div className="rounded shadow-md md:w-[30%] w-full mx-auto p-5">
                <h3 className="text-2xl text-center mb-5">Register</h3>
                <form onSubmit={handleRegister} className="flex flex-col gap-3">
                    <input
                        type="text"
                        name="name"
                        className="w-full border p-3 rounded"
                        placeholder="Enter Your Name"
                        required
                    />
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
                    <button className="w-full bg-gray-700 rounded text-white p-2">
                        Register
                    </button>
                </form>
                <p className="text-base my-3 text-center">
                    Already have an Account?{" "}
                    <span>
                        <Link className="text-blue-500 cursor-pointer" href={"/public/login"}>
                            Login Here
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
                    className="w-full text-gray-600 border hover:text-white hover:bg-gray-600 transition-all duration-300 border-gray-600 rounded p-2"
                >
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

export default Page;