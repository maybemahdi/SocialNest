// app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/providers/AuthProvider";
import PrivateRoute from "@/lib/PrivateRoute";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "SocialNest",
  description: "A Social Media App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-white">
      <body className={poppins.className}>
        <Toaster />
        <AuthProvider>
          <PrivateRoute>
            <div>//////</div>
            {children}
          </PrivateRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
