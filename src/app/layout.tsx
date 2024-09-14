import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  // Adjust subsets as needed
  display: "swap", // Improve performance
  // Add other options like weight, variable if required
  weight: ["300", "400", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "SocialNest",
  description: "A Social Media App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <body className={poppins.className}>
        <Toaster/>
        <AuthProvider>
          <Nav />
          <div className="">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
