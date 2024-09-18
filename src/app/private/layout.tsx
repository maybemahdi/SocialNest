// app/protected/layout.tsx
"use client"
import React, { useEffect } from 'react';
import { Poppins } from 'next/font/google';
import AuthProvider from '@/providers/AuthProvider';
import Nav from '@/components/Nav';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loading from '@/components/Loading';
import useAuth from '@/Hooks/useAuth';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '700', '800', '900'],
});

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const {loading} = useAuth()
  const router = useRouter();

  useEffect(() => {
    if (status === "loading" || loading) return;
    if (status === "unauthenticated") {
      router.push("/public/login");
    }
  }, [status, router, loading]);

  if (status === "loading" || loading) return <Loading />;
  return (
    <html lang="en" className="bg-white">
      <body className={poppins.className}>
        <Toaster />
        <AuthProvider>
          <Nav />
          <div className="w-[95%] mx-auto mt-5">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
