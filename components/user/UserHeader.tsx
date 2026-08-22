"use client";

import Image from "next/image";
import Link from "next/link";
import { IoChevronDown } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import UserDashboardNav from "./UserDashboardNav";
import { usePathname, useRouter } from "next/navigation";
import { clearToken, isLoggedIn } from "@/api/authToken";
import { useEffect, useMemo, useRef, useState } from "react";
import { HiBars3BottomRight, HiMiniMinus, HiMiniPlus } from "react-icons/hi2";
import { getSettingsByKeysFooter, getAllCategories } from "@/api/categoryActions";
import { getUserProfile } from "@/api/user/profile";
import FullPageLoader from "./FullPageLoader";
import { Category } from "@/api/data";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { MdChevronRight } from "react-icons/md";

type NavItem = {
  name: string;
  path: string;
  submenu?: NavItem[];
};

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

  return (
    <li>
      <div
        className="flex justify-between items-center w-full"
        style={{ paddingLeft: `${level * 14 + 8}px` }}
      >
        <button
          onClick={() => {
            if (level === 1 && hasChildren) {
              const categories = item.submenu
                ?.map((sub) => sub.path.split("category=")[1])
                .filter(Boolean)
                .join(",");

              handleNavigate(`/inventory?category=${categories}`);

              closeMenu();
              return;
            }
            if (!hasChildren) {
              let url = item.path;
              if (item.path === "#") {
                url = `/inventory?category=${slugify(item.name)}`;
              }
              handleNavigate(url);
              closeMenu();
              return;
            }

            handleNavigate(item.path);
            closeMenu();
          }}
          className={`
            flex-1 text-left py-2 px-2 font-medium rounded-md transition
            ${
              isActive
                ? "text-orange font-semibold bg-orange/10"
                : level === 0
                  ? "text-gray-800 text-base"
                  : "text-gray-600 text-sm"
            }
            hover:bg-orange/10 hover:text-orange cursor-pointer
          `}
        >
          {item.name}
        </button>

        {hasChildren && level !== 0 && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(!open);
            }}
            className="px-2 hover:text-orange"
          >
            {open ? <HiMiniMinus /> : <HiMiniPlus />}
          </button>
        )}

        {hasChildren && level === 0 && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(!open);
            }}
            className="px-2 hover:text-orange"
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

function UserHeader({ onNavigate }: { onNavigate?: (url: string) => void }) {
  const router = useRouter();
  const rawPath = usePathname();
  const pathname = String(rawPath);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const isSigninPage =
    pathname === "/user/signin" || pathname.startsWith("/user/signin/");
  const [userName, setUserName] = useState<string>("User");
  const [loggedIn, setLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [resetKey, setResetKey] = useState(0);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [clickedGroup, setClickedGroup] = useState<string | null>(null);
  const [headerCategories, setHeaderCategories] = useState<Category[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [disableHover, setDisableHover] = useState(false);

  const handleNavigate = (url: string) => {
    if (onNavigate) {
      onNavigate(url);
    } else {
      router.push(url);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const refreshCategories = async () => {
      try {
        const res = await getAllCategories();
        if (res?.success && res.data && isMounted) {
          setHeaderCategories(res.data);
        }
      } catch {
        // keep the current categories as a fallback
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
        return children.some(
          (child) => child.trim().toLowerCase() === name,
        );
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

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, [pathname]);

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    setResetKey((prev) => prev + 1);
  };

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
      {/* Account Verification Announcement Banner */}
      {!isSigninPage && isLicense !== null && isLicense !== 1 && (
        <div className="bg-[#FFF4F4] text-[#D83B3B] text-center py-2 px-4 text-xs md:text-sm font-medium w-full border-b border-[#ffd2d2]">
          You need to verify your account in order to be able to place bids
          and buy it now. To complete account verification{" "}
          <Link
            href="/user/profile"
            className="underline hover:text-red-700 transition-colors"
          >
            click here
          </Link>
        </div>
      )}

      <div className="border-b border-border">
        <div className="mx-auto flex justify-between items-center py-5 px-10 md:px-[60px]">
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

          {/* Desktop & Tablet Navbar */}
          <ul className="hidden lg:flex justify-center items-center gap-5 xl:gap-[50px]">
            {navItems.map((item) => (
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
                    e.preventDefault();
                    handleNavigate(item.path);
                  }}
                  className={`text-base font-medium cursor-pointer relative overflow-hidden
                before:absolute before:left-0 before:bottom-0 before:h-[2px]
                before:w-full before:origin-left before:scale-x-0
                before:bg-orange before:transition-transform before:duration-300
                hover:before:scale-x-100 hover:text-orange
                ${
                  item.path === "/"
                    ? pathname === "/"
                      ? "text-orange font-bold before:scale-x-100"
                      : "text-[#1D1B1A]"
                    : pathname.startsWith(item.path)
                      ? "text-orange font-bold before:scale-x-100"
                      : "text-[#1D1B1A]"
                }`}
                >
                  {item.name}
                </Link>

                {(item.submenu?.length ?? 0) > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setOpenDropdown(
                        openDropdown === item.name ? null : item.name,
                      );
                    }}
                    className={`hover:text-orange transition mt-1 ${
                      item.path === "/"
                        ? pathname === "/"
                          ? "text-orange font-bold"
                          : "text-[#1D1B1A] hover:text-orange"
                        : pathname.startsWith(item.path)
                          ? "text-orange font-bold"
                          : "text-[#1D1B1A] hover:text-orange"
                    }`}
                  >
                    <IoIosArrowDown size={14} />
                  </button>
                )}

                {(item.submenu?.length ?? 0) > 0 && (
                  <div
                    className={`
                    absolute left-0 top-full mt-3 w-[250px]
                    bg-white shadow-xl rounded-xl z-[999]
                    transition-all duration-300
                    ${
                      openDropdown === item.name && !disableHover
                        ? "opacity-100 visible"
                        : disableHover
                          ? "opacity-0 invisible"
                          : "opacity-0 invisible "
                    }
                  `}
                  >
                    <ul className="py-3">
                      {item.submenu?.map((group, index) => {
                        const hasSubmenu = (group.submenu?.length ?? 0) > 0;
                        const isOpen = activeGroup === group.name;
                        const url = hasSubmenu
                          ? `/inventory?category=${group.submenu
                              ?.map((sub) => sub.path.split("category=")[1])
                              .filter(Boolean)
                              .join(",")}`
                          : group.path;
                        return (
                          <li
                            key={`${group.name}-${group.path}-${index}`}
                            className="relative px-4 py-2 hover:bg-gray-50"
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

                                setDisableHover(true);
                                setOpenDropdown(null);
                                setActiveGroup(null);
                                setClickedGroup(null);

                                setTimeout(() => {
                                  setDisableHover(false);
                                }, 300);
                              }}
                              className="w-full flex items-center justify-between font-medium text-[#1D1B1A] hover:text-orange"
                            >
                              {group.name}

                              {hasSubmenu && (
                                <MdChevronRight
                                  size={20}
                                  className="text-gray-400"
                                />
                              )}
                            </Link>

                            {hasSubmenu && (
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
                                {group.submenu?.map((subItem) => (
                                  <li key={subItem.path}>
                                    <Link
                                      href={subItem.path}
                                      onClick={() => {
                                        setOpenDropdown(null);
                                        setActiveGroup(null);
                                        setClickedGroup(null);
                                      }}
                                      className="block w-full px-4 py-2 text-left text-base font-medium text-[#1D1B1A] hover:bg-gray-50 hover:text-orange"
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
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {isSigninPage ? (
              <button
                onClick={() => handleNavigate(getAuthUrl("/signup"))}
                className="hidden lg:block text-white bg-green py-[12px] px-[25px] rounded-[62px] text-base leading-[16px] cursor-pointer h-[40px]"
              >
                Sign Up
              </button>
            ) : (
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
                        className="w-full text-left px-4 py-2 text-[14px] text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              ref={buttonRef}
              className="lg:hidden focus:outline-none cursor-pointer text-orange"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <HiBars3BottomRight size={36} />
            </button>
          </div>
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
                ? "opacity-100 pointer-events-auto z-[2]"
                : "opacity-0 pointer-events-none"
            }
          `}
          ></div>
          {/* Sidebar Menu */}
          <div
            ref={menuRef}
            className={`
            lg:hidden fixed top-0 left-0 h-full w-[260px] bg-white shadow-xl z-[100]
            px-3 pb-8 pt-3 transition-transform duration-300 overflow-y-auto
            ${isMenuOpen ? "sidebar-open" : "sidebar-closed"}
          `}
          >
            <Link href="/">
              <Image
                src={settings?.dark_logo || "/assets/dark_logo.png"}
                alt={settings?.company_name || "Logo"}
                width={0}
                height={0}
                sizes="100vw"
                unoptimized
                onError={(e) => {
                  e.currentTarget.src = "/assets/dark_logo.png";
                }}
                className="w-[70px] sm:w-[70px] lg:w-auto h-auto"
              />
            </Link>
            <button
              onClick={handleCloseMenu}
              className="absolute top-2 right-2 text-white text-2xl bg-orange rounded-full p-[2px] cursor-pointer"
            >
              <IoClose size={20} />
            </button>

            <ul className="flex flex-col gap-2 mt-6">
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
            </ul>
            {loggedIn ? (
              <Link
                href="/user"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate("/user");
                  handleCloseMenu();
                }}
                className="mt-6 block text-center text-green bg-white border border-green py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:bg-orange hover:text-white hover:border-orange cursor-pointer"
              >
                Dashboard
              </Link>
            ) : (
              <div className="">
                {/* <button
                  onClick={() => {
                    handleNavigate(getAuthUrl("/user/signin"));
                    handleCloseMenu();
                  }}
                  className="mt-6 block text-center text-green bg-white border border-green py-3 px-6 rounded-lg font-semibold w-full transition-all duration-300 hover:bg-orange hover:text-white hover:border-orange cursor-pointer"
                >
                  Sign In
                </button> */}
                <button
                  onClick={() => {
                    handleNavigate(getAuthUrl("/signup"));
                    handleCloseMenu();
                  }}
                  className="mt-2 block text-center text-green bg-white border border-green py-3 px-6 rounded-lg font-semibold w-full transition-all duration-300 hover:bg-orange hover:text-white hover:border-orange cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {!isSigninPage && <UserDashboardNav onNavigate={onNavigate} />}
    </>
  );
}

export default UserHeader;
