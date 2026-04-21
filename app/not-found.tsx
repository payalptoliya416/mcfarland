'use client';

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F9] text-center px-4">
      <h1 className="text-[120px] font-bold text-green leading-none">404</h1>

      <h2 className="text-3xl font-semibold text-[#333] mt-4">
        Page Not Found
      </h2>

      <p className="text-[#666] mt-3 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link
        href="/"
        className="mt-6 inline-block bg-green text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
