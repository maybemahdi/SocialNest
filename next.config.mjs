/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // This matches any HTTPS domain
      },
      {
        protocol: "http",
        hostname: "**", // This matches any HTTP domain
      },
    ],
  },
};

export default nextConfig;
