"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import {
  FaTachometerAlt,
  FaBoxes,
  FaTags,
  FaUsers,
  FaGavel,
  FaCogs,
  FaShoppingCart,
  FaTrophy,
} from "react-icons/fa";
import Link from "next/link";

const menu = [
  { label: "Dashboard", icon: FaTachometerAlt, href: "/admin/dashboard" },
  { label: "User Management", icon: FaUsers, href: "/admin/user-management" },
  { label: "Machinery", icon: FaBoxes, href: "/admin/machinery" },
  { label: "Category", icon: FaTags, href: "/admin/category" },
  { label: "Bidding", icon: FaGavel, href: "/admin/bidding" },
  { label: "Orders", icon: FaShoppingCart, href: "/admin/orders" },
  { label: "Won User", icon: FaTrophy, href: "/admin/won-user" },
  { label: "Settings", icon: FaCogs, href: "/admin/settings" },
];

export default function AdminSidebar({
  mobile = false,
  onItemClick,
  onNavigateStart,
}: {
  mobile?: boolean;
  onItemClick?: () => void;
  onNavigateStart?: () => void;
}) {
  const pathname = usePathname();
  const { settings } = useSettings();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // clear pending once pathname actually changes
  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  return (
    <aside
      className={`
        w-[270px]
        bg-white
        flex flex-col
        border border-border
        ${mobile ? "h-screen rounded-none" : "h-full rounded-[14px]"}
      `}
    >
      {/* LOGO (FIXED) */}
      <div className="flex items-center justify-center py-1 shrink-0">
        <Link href="/">
          {settings?.dark_logo && (
            <Image
              src={`${settings.dark_logo}`}
              alt="logo"
              height={42}
              width={120}
              loading="eager"
              priority
              className="h-[77px] w-auto"
            />
          )}
        </Link>
      </div>

      <div className="border-t border-border mx-[10px] shrink-0" />

      {/* MENU (SCROLLABLE) */}
      <nav className="flex-1 overflow-y-auto mt-[20px] px-[10px] pb-4">
        <div className="flex flex-col gap-[6px]">
          {menu.map((item, index) => {
            const Icon = item.icon;
            const currentPath = pathname.replace(/\/$/, "");
            const targetPath = item.href.replace(/\/$/, "");

            const isActive =
              pendingHref === item.href ||
              (!pendingHref &&
                (currentPath === targetPath ||
                  currentPath.startsWith(targetPath + "/")));

            return (
              <Link
                key={index}
                href={item.href}
                onClick={() => {
                  setPendingHref(item.href);
                  if (mobile && onItemClick) onItemClick();
                }}
                className={`
                  flex items-center gap-[10px]
                  px-4 py-[11px]
                  rounded-[10px]
                  text-base font-medium
                  transition-all group cursor-pointer
                  ${
                    isActive
                      ? "gradient-btn text-white"
                      : "text-seclightgray hover:bg-green hover:text-white"
                  }
                `}
              >
                <Icon
                  className={`text-base group-hover:text-white ${
                    isActive ? "text-white" : "text-seclightgray"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
