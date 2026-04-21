"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAdminToken } from "@/api/admin/adminAuth";
import Loader from "@/components/common/Loader";
import AdminSidebar from "@/adminpanel/AdminSidebar";
import AdminHeader from "@/adminpanel/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    const token = getAdminToken();

    if (!token) {
      router.push("/admin");
    } else {
      setReady(true);
    }
  }, [router]);

  useEffect(() => {
    setPageLoading(false);
  }, [pathname]);

  if (!ready) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#F9F9F9]">
      <div className="hidden lg:block py-5 pl-5">
        <AdminSidebar onNavigateStart={() => setPageLoading(true)} />
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
              onNavigateStart={() => setPageLoading(true)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 overflow-hidden p-3 md:p-5 relative">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto relative">
          {pageLoading ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <Loader />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
