// app/protected/layout.tsx
import React from 'react';
import { Poppins } from 'next/font/google';
import AuthProvider from '@/providers/AuthProvider';
import Nav from '@/components/Nav';
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '700', '800', '900'],
});

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
