/** @type {import('next').NextConfig} */
const isExport = process.env.NODE_ENV === "production";

const nextConfig = {
  ...(isExport ? { output: "export" } : {}),

  ...(!isExport
    ? {
        async rewrites() {
          return [
            {
              source: "/inventory/:category",
              destination: "/inventory",
            },
            {
              source: "/inventory/:path*",
              destination: "/inventory?category=:path*",
            },
            {
              source: "/inventory/:category/:make/:model/:auction_id",
              destination: "/inventory",
            },
            {
              source: "/checkout/:category/:make/:model/:auction_id",
              destination: "/checkout",
            },
            {
              source: "/confirmation/:category/:make/:model/:auction_id",
              destination: "/confirmation",
            },
            {
              source: "/sale-agreement/:category/:make/:model/:auction_id",
              destination: "/sale-agreement",
            },
          ];
        },
      }
    : {}),

  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

export default nextConfig;