import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/category/:slug*",
        destination: "/categories/:slug*",
        permanent: true
      },
      {
        source: "/product/:slug*",
        destination: "/products/:slug*",
        permanent: true
      }
    ];
  },
  typedRoutes: false,
};

export default nextConfig;
