// app/public/layout.tsx
import React from 'react';
import { Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '700', '800', '900'],
});

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-white">
      <body className={poppins.className}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
