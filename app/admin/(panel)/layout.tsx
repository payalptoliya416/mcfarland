"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminToken } from "@/api/admin/adminAuth";
import Loader from "@/components/common/Loader";
import AdminSidebar from "@/adminpanel/AdminSidebar";
import AdminHeader from "@/adminpanel/AdminHeader";
import { SettingsProvider } from "@/contexts/SettingsContext";

// All admin routes — prefetch on layout mount so navigation feels instant
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.push("/admin");
    } else {
      setReady(true);
      // Prefetch all admin pages in background after login confirmed
      ADMIN_ROUTES.forEach((route) => router.prefetch(route));
    }
  }, [router]);

  if (!ready) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <SettingsProvider>
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
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto relative">
            {children}
          </main>
        </div>
      </div>
    </SettingsProvider>
  );
}
