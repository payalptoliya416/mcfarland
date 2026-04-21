"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";

type MenuItem = {
  name: string;
  href: string;
  icon: string;
};

export default function UserDashboardNav({
  onNavigate,
}: {
  onNavigate?: (url: string) => void;
}) {
  const pathname = usePathname();

  const menu: MenuItem[] = [
    { name: "Dashboard", href: "/user", icon: "/assets/nav1.svg" },
    { name: "My Bids", href: "/user/bids", icon: "/assets/nav2.svg" },
    { name: "Inventory", href: "/inventory", icon: "/assets/nav9.svg" },
    { name: "My Buy Orders", href: "/user/orders", icon: "/assets/nav3.svg" },
    { name: "My Won Bids", href: "/user/won-bids", icon: "/assets/nav6.svg" },
  ];

  const handleNavigate = (url: string) => {
    if (pathname === url) return; // ❌ same path → no loader
    onNavigate?.(url);            // ✅ let Layout control navigation
  };

  return (
    <nav className="bg-green w-full py-3">
      <div className="container-custom mx-auto">
        <div className="flex items-center gap-1 xl:gap-5 xl:px-6 justify-start lg:justify-center overflow-x-auto flex-nowrap scrollbar-hide scroll-smooth">
          {menu.map((item) => {
            const active =
              item.href === "/user"
                ? pathname === "/user" || pathname === "/user/"
                : pathname.startsWith(item.href);

            return (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.href)}
                className={`
                  text-white
                  rounded-lg
                  transition-all duration-200
                  whitespace-nowrap
                  cursor-pointer
                  ${active ? "bg-white/20" : "hover:bg-white/10"}
                `}
              >
                <div className="flex items-center h-9 px-4">
                  <Image
                    src={item.icon}
                    alt=""
                    width={16}
                    height={16}
                    className="block shrink-0"
                  />
                  <span className="ml-2 text-[15px] font-medium leading-none">
                    {item.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}