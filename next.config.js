/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // It's better to fix type errors than ignore them
    // ignoreBuildErrors: true,
  },
  eslint: {
    // It's better to fix linting errors than ignore them
    // ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
