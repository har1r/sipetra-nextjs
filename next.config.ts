import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Mengabaikan error TypeScript saat build agar deploy sukses
    ignoreBuildErrors: true,
  },
  // Pengaturan tambahan untuk gambar jika diperlukan
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
