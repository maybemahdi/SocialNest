// app/public/layout.tsx
"use client"
import React, { useEffect, useState } from 'react';
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
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null; // Render nothing on the server to prevent mismatches (hydration error)
  }
  return (
    <html lang="en" className="bg-white">
      <body className={poppins.className}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
