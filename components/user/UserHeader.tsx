"use client";

import Image from "next/image";
import Link from "next/link";
import { IoChevronDown } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import UserDashboardNav from "./UserDashboardNav";
import { usePathname, useRouter } from "next/navigation";
import { clearToken } from "@/api/authToken";
import { useEffect, useRef, useState } from "react";
import { HiBars3BottomRight } from "react-icons/hi2";
import { getSettingsByKeysFooter } from "@/api/categoryActions";
import { getUserProfile } from "@/api/user/profile";
import FullPageLoader from "./FullPageLoader";

function UserHeader({ onNavigate }: { onNavigate?: (url: string) => void }) {
  const router = useRouter();
  const rawPath = usePathname();
  const pathname = String(rawPath);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const isSigninPage =
    pathname === "/user/signin" || pathname.startsWith("/user/signin/");
  const [userName, setUserName] = useState<string>("User");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Inventory", path: "/inventory" },
    { name: "About Us", path: "/about-us" },
    { name: "Services", path: "/services" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact Us", path: "/contact-us" },
  ];
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [menuLoading, setMenuLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<any>(null);
  const [isHeaderReady, setIsHeaderReady] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [isLicense, setIsLicense] = useState<number | null>(null);

  const getUserNameFromStorage = () => {
    if (typeof window === "undefined") return "User";

    const user = localStorage.getItem("userdata");
    if (!user) return "User";

    try {
      const parsedUser = JSON.parse(user);
      const first = parsedUser.first_name?.trim() || "";
      const last = parsedUser.last_name?.trim() || "";

      const fullName = `${first} ${last}`.trim();
      return fullName || "User";
    } catch {
      return "User";
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await getSettingsByKeysFooter();
        if (res.success) {
          setSettings(res.data);
        }
      } finally {
        setSettingsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleLogout = () => {
    setOpen(false);
    clearToken();
    localStorage.removeItem("userdata");
    router.push("/user/signin");
  };

  useEffect(() => {
    const updateUser = () => {
      setUserName(getUserNameFromStorage());
      setUserLoading(false);
    };

    const fetchProfile = async () => {
      try {
        if (!isSigninPage) {
          const res = await getUserProfile();
          if (res.status && res.data) {
            setIsLicense(res.data.is_license);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    updateUser();
    fetchProfile();
    window.addEventListener("user-login", updateUser);
    window.addEventListener("user-login", fetchProfile);

    return () => {
      window.removeEventListener("user-login", updateUser);
      window.removeEventListener("user-login", fetchProfile);
    };
  }, [isSigninPage]);

  // useEffect(() => {
  //   const updateUser = () => {
  //     const user = localStorage.getItem("userdata");

  //     if (user) {
  //       try {
  //         const parsedUser = JSON.parse(user);
  //         const fullName =
  //           `${parsedUser.first_name ?? ""} ${parsedUser.last_name ?? ""}`.trim();
  //         setUserName(fullName);
  //       } catch {
  //         setUserName("");
  //       }
  //     } else {
  //       setUserName("");
  //     }

  //     setUserLoading(false);
  //   };

  //   updateUser();
  //   window.addEventListener("user-login", updateUser);

  //   return () => {
  //     window.removeEventListener("user-login", updateUser);
  //   };
  // }, []);
  useEffect(() => {
    if (!settingsLoading && !userLoading) {
      setIsHeaderReady(true);
    }
  }, [settingsLoading, userLoading]);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setIsMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
    setMenuLoading(false);
  }, [pathname]);

const handleMenuNavigate = (path: string) => {
  onNavigate?.(path);  
  setTimeout(() => {
    setOpen(false);  
  }, 0);
};

  if (!isHeaderReady) {
    return <FullPageLoader />;
  }

  return (
    <>
      <div className="bg-[#FFFBF3]">
        <div className="container-custom mx-auto flex justify-between items-center py-[14px] sm:gap-2">
          <Link href="/">
            {settings?.dark_logo && (
              <Image
                src={`${settings.dark_logo}`}
                alt="Logo"
                height={52}
                width={130}
                loading="eager"
                priority
              />
            )}
          </Link>
          {!isSigninPage && isLicense !== null && isLicense !== 1 && (
          <div className="bg-[#FFF4F4] text-[#D83B3B] text-center py-2 px-4 text-xs md:text-sm font-medium hidden lg:block">
            You need to verify your account in order to be able to place bids and buy it now . To complete account verification{" "}
            <Link href="/user/profile" className="underline hover:text-red-700 transition-colors">
              click here
            </Link>
          </div>
          )}
          {/* Desktop & Tablet Navbar */}
          {isSigninPage && (
            <>
              <ul className="hidden lg:flex justify-center items-center gap-8 md:gap-12">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <button onClick={() => onNavigate?.(item.path)}
                      className={`
                text-base relative
                after:content-[''] after:absolute after:-bottom-1
                after:left-1/2 after:-translate-x-1/2
                after:h-1 after:w-0
                  after:bg-[linear-gradient(180deg,#FFAD0100_0%,#FFAD01_50%,#FFAD0100_100%)]
                after:transition-all after:duration-300
                hover:after:w-8 hover:text-orange transition-all duration-300
                ${
                  item.path === "/"
                    ? pathname === "/"
                      ? "text-orange font-bold after:w-8"
                      : "text-gray-700 font-medium"
                    : pathname.startsWith(item.path)
                      ? "text-orange font-bold after:w-8"
                      : "text-gray-700 font-medium"
                }
              `}
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {isSigninPage ? (
            <>
              <div>
                <Link
                  href="/signup"
                  className="hidden lg:block text-gray bg-green py-[14px] px-[22px] rounded-lg text-base leading-[16px] cursor-pointer"
                >
                  Sign Up
                </Link>
                <button
                  ref={buttonRef}
                  className="lg:hidden focus:outline-none"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <HiBars3BottomRight size={36} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 sm:gap-5">
              {/* <div className="bg-white w-[42px] h-[42px] justify-center items-center rounded-full flex cursor-pointer">
          <PiBellRinging size={20} />
        </div> */}
              {/* <div className="bg-white w-[42px] h-[42px] justify-center items-center rounded-full flex cursor-pointer">
          <GoQuestion size={20} />
        </div> */}

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="bg-white rounded-full px-1 py-[4px] flex items-center gap-3 shadow-sm md:pe-3 cursor-pointer"
                >
                  <Image
                    src="/assets/user.png"
                    width={36}
                    height={36}
                    alt="user"
                    className="rounded-full"
                    priority
                  />
                  <span className="text-para font-medium text-[16px] hidden md:block">
                    {userName || "User"}
                  </span>
                  <IoChevronDown
                    size={18}
                    className="text-gray-600 hidden md:block"
                  />
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100"
                    >
                      <button
                        disabled={menuLoading}
                        onClick={() => handleMenuNavigate("/user/profile")}
                        className="w-full text-left px-4 py-2 text-[14px] hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      >
                        {menuLoading ? "Profile..." : "Profile"}
                      </button>

                      <div className="border-t my-1" />

                      <button
                        onClick={() => {
                          setOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-[14px] text-red-600 hover:bg-red-50  cursor-pointer"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
        {/* Mobile Menu */}
        <div
          ref={sidebarRef}
          className={`lg:hidden ${isMenuOpen ? "block" : "hidden"}`}
        >
          {/* Overlay */}
          <div
            onClick={() => setIsMenuOpen(false)}
            className={`lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300
            ${
              isMenuOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }
          `}
          ></div>
          {/* Sidebar Menu */}
          <div
            ref={menuRef}
            className={`
            lg:hidden fixed top-0 left-0 h-full w-[260px] bg-white shadow-xl z-[100]
            px-6 py-8 transition-transform duration-300 overflow-y-auto
            ${isMenuOpen ? "sidebar-open" : "sidebar-closed"}
          `}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-5 right-5 text-gray-700 text-2xl"
            >
              ✕
            </button>

            <ul className="flex flex-col gap-6 mt-10">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`
            block text-lg font-medium transition-all duration-300
            relative pb-1
            after:content-[''] after:absolute after:left-0 after:bottom-0
            after:h-[3px] after:w-0 after:bg-orange after:rounded
            hover:after:w-8 hover:text-orange
            ${
              item.path === "/"
                ? pathname === "/"
                  ? "text-orange font-bold after:w-8"
                  : "text-gray-700"
                : pathname.startsWith(item.path)
                  ? "text-orange font-bold after:w-8"
                  : "text-gray-700"
            }
          `}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

              <Link
                href="/signup"
                className="block lg:hidden text-white bg-green py-[14px] px-[22px] rounded-lg text-base leading-[16px] cursor-pointer text-center"
              >
                Sign up
              </Link>
            </ul>
          </div>
        </div>
      </div>
       {!isSigninPage && isLicense !== null && isLicense !== 1 && (
          <div className="bg-[#FFF4F4] text-[#D83B3B] text-center py-2 px-4 text-xs md:text-sm font-medium block lg:hidden">
            You need to verify your account in order to be able to place bids and buy it now . To complete account verification{" "}
            <Link href="/user/profile" className="underline hover:text-red-700 transition-colors">
              click here
            </Link>
          </div>
        )}
      {!isSigninPage && <UserDashboardNav  onNavigate={onNavigate}  />}
    </>
  );
}

export default UserHeader;
