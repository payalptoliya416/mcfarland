"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminToken } from "@/api/admin/adminAuth";
import Loader from "@/components/common/Loader";
import AdminSidebar from "@/adminpanel/AdminSidebar";
import AdminHeader from "@/adminpanel/AdminHeader";

const ADMIN_ROUTES = [
  "/admin/dashboard",
  "/admin/machinery",
  "/admin/machinery/add",
  "/admin/category",
  "/admin/category/add",
  "/admin/user-management",
  "/admin/user-management/add",
  "/admin/user-management/user-license",
  "/admin/bidding",
  "/admin/bidding/bidding-list",
  "/admin/orders",
  "/admin/won-user",
  "/admin/won-user/won-user-details",
  "/admin/settings",
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!getAdminToken()) {
      router.replace("/admin/");
      return;
    }

    ADMIN_ROUTES.forEach((route) => router.prefetch(route));
  }, [router]);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#F9F9F9]">
      <div className="hidden lg:block py-5 pl-5">
        <AdminSidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-screen w-[270px] bg-white">
            <AdminSidebar
              mobile
              onItemClick={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 overflow-hidden p-3 md:p-5 relative">
        <Suspense fallback={<div className="h-[72px]" />}>
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        </Suspense>

        <main className="flex-1 overflow-y-auto relative">
          <Suspense
            fallback={
              <div className="flex justify-center items-center min-h-[40vh]">
                <Loader />
              </div>
            }
          >
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
