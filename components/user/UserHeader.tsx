"use client";

import Image from "next/image";
import Link from "next/link";
import { IoChevronDown } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { MdChevronRight } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import UserDashboardNav from "./UserDashboardNav";
import { usePathname, useRouter } from "next/navigation";
import { clearToken } from "@/api/authToken";
import { useEffect, useRef, useState, useMemo } from "react";
import { HiBars3BottomRight, HiMiniMinus, HiMiniPlus } from "react-icons/hi2";
import { getAllCategories, getSettingsByKeysFooter } from "@/api/categoryActions";
import { getUserProfile } from "@/api/user/profile";
import FullPageLoader from "./FullPageLoader";

type NavItem = {
  name: string;
  path: string;
  submenu?: NavItem[];
};

const inventoryGroups: Record<string, string[]> = {
  Loaders: ["Skid Steer Loaders", "Backhoe Loaders", "Wheel Loaders"],
  Excavators: ["Mini Excavators", "Track Excavators", "Wheel Excavators"],
  Telehandlers: [],
  "Earthmoving Equipment": ["Graders", "Dozers", "Dumpers", "Rollers"],
  "Farm Tractors": [],
};

const slugify = (text: string) =>
  (text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function MobileNavItem({
  item,
  router,
  closeMenu,
  level = 0,
  resetKey,
  pathname,
  slugify,
  handleNavigate,
}: {
  item: NavItem;
  router: any;
  closeMenu: () => void;
  level?: number;
  resetKey: number;
  pathname: string;
  slugify: (text: string) => string;
  handleNavigate: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const hasChildren = (item.submenu?.length ?? 0) > 0;
  useEffect(() => {
    setOpen(false);
  }, [resetKey]);
  const isActive =
    pathname === item.path || pathname.startsWith(item.path + "/");

  let href = item.path;
  if (level === 1 && hasChildren) {
    const categories = item.submenu
      ?.map((sub) => sub.path.split("category=")[1])
      .filter(Boolean)
      .join(",");
    href = `/inventory?category=${categories}`;
  } else if (!hasChildren && item.path === "#") {
    href = `/inventory?category=${slugify(item.name)}`;
  }

  return (
    <li>
      <div
        className="flex justify-between items-center w-full"
        style={{ paddingLeft: `${level * 14 + 8}px` }}
      >
        <Link
          href={href}
          onClick={(e) => {
            if (pathname === href) {
              e.preventDefault();
              closeMenu();
              return;
            }
            handleNavigate(href);
            closeMenu();
          }}
          className={`
            flex-1 text-left py-2 px-2 font-medium rounded-md transition cursor-pointer
            ${
              isActive
                ? "text-orange font-semibold bg-orange/10"
                : level === 0
                  ? "text-gray-800 text-base"
                  : "text-gray-600 text-sm"
            }
            hover:bg-orange/10 hover:text-orange
          `}
        >
          {item.name}
        </Link>

        {hasChildren && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(!open);
            }}
            className="px-2 hover:text-orange cursor-pointer"
          >
            {open ? <HiMiniMinus /> : <HiMiniPlus />}
          </button>
        )}
      </div>

      {hasChildren && open && (
        <ul className="mt-1 flex flex-col gap-1">
          {item.submenu?.map((sub) => (
            <MobileNavItem
              key={sub.path}
              item={sub}
              router={router}
              closeMenu={closeMenu}
              level={level + 1}
              resetKey={resetKey}
              pathname={pathname}
              slugify={slugify}
              handleNavigate={handleNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

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

  // Category and Dropdown states
  const [headerCategories, setHeaderCategories] = useState<any[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [disableHover, setDisableHover] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [clickedGroup, setClickedGroup] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const refreshCategories = async () => {
      try {
        const res = await getAllCategories();
        if (res?.success && res.data && isMounted) {
          setHeaderCategories(res.data);
        }
      } catch {
        // keep empty array fallback
      }
    };
    refreshCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest(".dropdown-parent")) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const inventorySubmenu: NavItem[] = useMemo(() => {
    const groupedMenus: NavItem[] = [];

    Object.entries(inventoryGroups).forEach(([groupName, children]) => {
      const matched = headerCategories.filter((cat) => {
        const name = cat?.category_name?.trim()?.toLowerCase() || "";
        return children.some((child) => child.trim().toLowerCase() === name);
      });

      const directCategory = headerCategories.find(
        (cat) =>
          (cat?.category_name?.trim()?.toLowerCase() || "") ===
          groupName.trim().toLowerCase(),
      );

      if (matched.length === 0 && !directCategory) {
        return;
      }

      groupedMenus.push({
        name: groupName,
        path: `/inventory?category=${slugify(groupName)}`,
        submenu:
          matched.length > 0
            ? matched.map((cat) => ({
                name: cat.category_name,
                path: `/inventory?category=${slugify(cat.category_name || "")}`,
              }))
            : undefined,
      });
    });

    const dynamicCategories: NavItem[] = [];

    headerCategories.forEach((cat) => {
      const categoryName = cat?.category_name?.trim()?.toLowerCase() || "";
      if (!categoryName) return;

      const isGrouped = Object.entries(inventoryGroups).some(
        ([groupName, children]) => {
          if (groupName.trim().toLowerCase() === categoryName) {
            return true;
          }

          return children.some(
            (child) => child.trim().toLowerCase() === categoryName,
          );
        },
      );

      if (!isGrouped) {
        dynamicCategories.push({
          name: cat.category_name,
          path: `/inventory?category=${slugify(cat.category_name || "")}`,
        });
      }
    });

    return [...groupedMenus, ...dynamicCategories];
  }, [headerCategories]);

  const navItems: NavItem[] = useMemo(
    () => [
      { name: "Home", path: "/" },
      {
        name: "Inventory",
        path: "/inventory",
        submenu: inventorySubmenu,
      },
      { name: "About Us", path: "/about-us" },
      { name: "Services", path: "/services" },
      { name: "FAQ", path: "/faq" },
      { name: "Contact Us", path: "/contact-us" },
    ],
    [inventorySubmenu],
  );

  const handleNavigate = (url: string) => {
    if (onNavigate) {
      onNavigate(url);
    } else {
      router.push(url);
    }
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    setResetKey((prev) => prev + 1);
  };

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
    localStorage.removeItem("license_submitted");
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

  // Click-time auth URL builder
  const getAuthUrl = (base: "/user/signin" | "/signup"): string => {
    if (typeof window === "undefined") return base;
    const currentPathname = window.location.pathname.replace(/\/$/, "");
    const params = new URLSearchParams(window.location.search);
    const existingReturnUrl = params.get("returnUrl");
    const onAuthPage =
      currentPathname === "/signup" ||
      currentPathname.startsWith("/user/signin");
    const destination =
      onAuthPage && existingReturnUrl
        ? existingReturnUrl
        : !onAuthPage
          ? window.location.pathname + window.location.search
          : "";
    return destination && destination !== "/" && destination !== "/user"
      ? `${base}?returnUrl=${encodeURIComponent(destination)}`
      : base;
  };

  if (!isHeaderReady) {
    return <FullPageLoader />;
  }

  return (
    <>
      <div className="border-b border-border">
        <div className="mx-auto flex justify-between items-center py-3 md:py-5 px-4 md:px-[60px]">
          <Link href="/">
            {settings?.dark_logo && (
              <Image
                src={`${settings.dark_logo}`}
                alt="Logo"
                width={0}
                height={0}
                sizes="100vw"
                unoptimized
                className="w-[100px] sm:w-[120px] lg:w-auto h-auto"
              />
            )}
          </Link>
          {!isSigninPage && isLicense !== null && isLicense !== 1 && (
            <div className="bg-[#FFF4F4] text-[#D83B3B] text-center py-2 px-4 text-xs md:text-sm font-medium hidden lg:block">
              You need to verify your account in order to be able to place bids
              and buy it now . To complete account verification{" "}
              <Link
                href="/user/profile"
                className="underline hover:text-red-700 transition-colors"
              >
                click here
              </Link>
            </div>
          )}
          {/* Desktop & Tablet Navbar */}
          {isSigninPage && (
            <>
              <ul className="hidden lg:flex justify-center items-center gap-8 md:gap-12">
                {navItems.map((item) => {
                  const hasSubmenu = (item.submenu?.length ?? 0) > 0;
                  return (
                    <li
                      key={item.path}
                      className="relative dropdown-parent flex items-center gap-1"
                      onMouseEnter={() => {
                        if (disableHover) return;
                        setOpenDropdown(item.name);
                      }}
                      onMouseLeave={() => {
                        setOpenDropdown(null);
                        setActiveGroup(null);
                        setClickedGroup(null);
                      }}
                    >
                      <Link
                        href={item.path}
                        onClick={(e) => {
                          if (pathname === item.path) {
                            e.preventDefault();
                            return;
                          }
                          handleNavigate(item.path);
                        }}
                        className={`
                          text-base relative flex items-center gap-1
                          after:content-[''] after:absolute after:-bottom-1
                          after:left-1/2 after:-translate-x-1/2
                          after:h-1 after:w-0
                          after:bg-[linear-gradient(180deg,#F2671C00_0%,#F2671C_50%,#F2671C00_100%)]
                          after:transition-all after:duration-300
                          hover:after:w-8 hover:text-orange transition-all duration-300 cursor-pointer
                          ${
                            item.path === "/"
                              ? pathname === "/"
                                ? "text-orange font-bold after:w-8"
                                : "text-gray font-medium"
                              : pathname.startsWith(item.path)
                                ? "text-orange font-bold after:w-8"
                                : "text-gray font-medium"
                          }
                        `}
                      >
                        {item.name}
                      </Link>

                      {hasSubmenu && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setOpenDropdown(
                              openDropdown === item.name ? null : item.name,
                            );
                          }}
                          className={`hover:text-orange transition mt-1 cursor-pointer ${
                            pathname.startsWith(item.path)
                              ? "text-orange font-bold"
                              : "text-gray font-medium"
                          }`}
                        >
                          <IoIosArrowDown size={14} />
                        </button>
                      )}

                      {hasSubmenu && (
                        <div
                          className={`
                            absolute left-0 top-full mt-3 w-[250px]
                            bg-white shadow-xl rounded-xl z-[999]
                            transition-all duration-300
                            ${
                              openDropdown === item.name && !disableHover
                                ? "opacity-100 visible"
                                : "opacity-0 invisible"
                            }
                          `}
                        >
                          <ul className="py-3">
                            {item.submenu?.map((group, index) => {
                              const hasGroupSubmenu = (group.submenu?.length ?? 0) > 0;
                              const isOpen = activeGroup === group.name;
                              const url = hasGroupSubmenu
                                ? `/inventory?category=${group.submenu
                                    ?.map((sub: any) => sub.path.split("category=")[1])
                                    .filter(Boolean)
                                    .join(",")}`
                                : group.path;
                              return (
                                <li
                                  key={`${group.name}-${group.path}-${index}`}
                                  className="relative px-4 py-2 hover:bg-gray-50 text-left"
                                  onMouseEnter={() => {
                                    setActiveGroup(group.name);
                                  }}
                                  onMouseLeave={() => {
                                    if (clickedGroup !== group.name) {
                                      setActiveGroup(null);
                                    }
                                  }}
                                >
                                  <Link
                                    href={url}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (pathname === url) {
                                        e.preventDefault();
                                      } else {
                                        handleNavigate(url);
                                      }
                                      setDisableHover(true);
                                      setOpenDropdown(null);
                                      setActiveGroup(null);
                                      setClickedGroup(null);
                                      setTimeout(() => {
                                        setDisableHover(false);
                                      }, 300);
                                    }}
                                    className="w-full flex items-center justify-between font-medium text-[#1D1B1A] hover:text-orange text-left cursor-pointer"
                                  >
                                    {group.name}
                                    {hasGroupSubmenu && (
                                      <MdChevronRight
                                        size={20}
                                        className="text-gray-400"
                                      />
                                    )}
                                  </Link>

                                  {hasGroupSubmenu && (
                                    <ul
                                      className={`
                                        absolute top-0 left-full ml-2
                                        w-[220px]
                                        bg-white shadow-xl rounded-xl
                                        py-3
                                        transition-all duration-300 cursor-pointer
                                        ${
                                          isOpen
                                            ? "opacity-100 visible"
                                            : "opacity-0 invisible"
                                        }
                                      `}
                                    >
                                      {group.submenu?.map((subItem: any) => (
                                        <li key={subItem.path} className="text-left">
                                          <Link
                                            href={subItem.path}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (pathname === subItem.path) {
                                                e.preventDefault();
                                              } else {
                                                handleNavigate(subItem.path);
                                              }
                                              setOpenDropdown(null);
                                              setActiveGroup(null);
                                              setClickedGroup(null);
                                            }}
                                            className="block w-full px-4 py-2 text-left text-base font-medium text-[#1D1B1A] hover:bg-gray-50 hover:text-orange cursor-pointer"
                                          >
                                            {subItem.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          {isSigninPage ? (
            <>
              <div>
                <Link
                  href={getAuthUrl("/signup")}
                  onClick={(e) => {
                    if (pathname === getAuthUrl("/signup")) {
                      e.preventDefault();
                    } else {
                      handleNavigate(getAuthUrl("/signup"));
                    }
                  }}
                  className="hidden lg:flex items-center justify-center text-white bg-green py-[12px] px-[25px] rounded-[62px] text-base leading-[16px] cursor-pointer h-[40px]"
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
                      <Link
                        href="/user/profile"
                        onClick={(e) => {
                          if (pathname === "/user/profile") {
                            e.preventDefault();
                          } else {
                            handleMenuNavigate("/user/profile");
                          }
                        }}
                        className="w-full text-left px-4 py-2 text-[14px] hover:bg-gray-100 cursor-pointer flex items-center gap-2 block"
                      >
                        Profile
                      </Link>

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
            onClick={handleCloseMenu}
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
            px-2 py-5 transition-transform duration-300 overflow-y-auto
            ${isMenuOpen ? "sidebar-open" : "sidebar-closed"}
          `}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseMenu}
              className="absolute top-5 right-5 text-gray-700 text-2xl cursor-pointer"
            >
              ✕
            </button>

            <ul className="flex flex-col gap-2 mt-10">
              {navItems.map((item) => (
                <MobileNavItem
                  key={item.path}
                  item={item}
                  router={router}
                  closeMenu={handleCloseMenu}
                  resetKey={resetKey}
                  pathname={pathname}
                  slugify={slugify}
                  handleNavigate={handleNavigate}
                />
              ))}

              <Link
                href={getAuthUrl("/signup")}
                onClick={(e) => {
                  if (pathname === getAuthUrl("/signup")) {
                    e.preventDefault();
                    handleCloseMenu();
                  } else {
                    handleCloseMenu();
                    handleNavigate(getAuthUrl("/signup"));
                  }
                }}
                className="block lg:hidden text-white bg-green py-[14px] px-[22px] rounded-lg text-base leading-[16px] cursor-pointer text-center mt-4"
              >
                Sign up
              </Link>
            </ul>
          </div>
        </div>
      </div>
      {!isSigninPage && isLicense !== null && isLicense !== 1 && (
        <div className="bg-[#FFF4F4] text-[#D83B3B] text-center py-2 px-4 text-xs md:text-sm font-medium block lg:hidden">
          You need to verify your account in order to be able to place bids and
          buy it now . To complete account verification{" "}
          <Link
            href="/user/profile"
            className="underline hover:text-red-700 transition-colors"
          >
            click here
          </Link>
        </div>
      )}
      {!isSigninPage && <UserDashboardNav onNavigate={onNavigate} />}
    </>
  );
}

export default UserHeader;
