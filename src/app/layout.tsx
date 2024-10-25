// app/protected/layout.tsx
"use client";
import React from "react";
import "./globals.css";
import { Poppins } from "next/font/google";
import AuthProvider from "@/providers/AuthProvider";
import Nav from "@/components/Nav";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Toaster />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Nav />
            <div className="w-[95%] mx-auto mt-5">{children}</div>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
