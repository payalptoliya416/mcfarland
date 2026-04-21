'use client'

import { isLoggedIn } from "@/api/authToken";
import UserFooter from "@/components/user/UserFooter";
import UserHeader from "@/components/user/UserHeader";
import UserDashboardNav from "@/components/user/UserDashboardNav";
import Loader from "@/components/common/Loader";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  // 🔐 Auth Check
  useEffect(() => {
    if (window.location.pathname.startsWith("/user/signin")) {
      setCheckingAuth(false);
      return;
    }

    if (!isLoggedIn()) {
      const currentUrl =
        window.location.pathname + window.location.search;

      router.push(
        `/user/signin?returnUrl=${encodeURIComponent(currentUrl)}`
      );
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

const normalize = (url: string) =>
  url.replace(/\/+$/, "");

const handleNavigate = useCallback(
  (url: string) => {
    const current = normalize(pathname);
    const target = normalize(url);

    if (current === target) return; 

    setIsNavigating(true);
    router.push(url);
  },
  [pathname, router]
);

  if (checkingAuth) return null;

  return (
    <div className="min-h-screen flex flex-col">

      <UserHeader onNavigate={handleNavigate} />

      <main className="flex-1 relative">
        {isNavigating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
            <Loader />
          </div>
        )}
        {!isNavigating && children}
      </main>

      <UserFooter />
    </div>
  );
}