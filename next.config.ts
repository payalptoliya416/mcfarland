/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
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

  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
