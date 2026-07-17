"use client";

import { isLoggedIn } from "@/api/authToken";
import { Category } from "@/api/data";
import {
  getAllCategories,
  getSettingsByKeysFooter,
} from "@/api/categoryActions";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { HiBars3BottomRight, HiMiniMinus, HiMiniPlus } from "react-icons/hi2";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { MdChevronRight } from "react-icons/md";
import Loader from "./Loader";

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

function Header({
  categories,
  settings: settingsProp,
}: {
  categories: Category[];
  settings: any;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const returnUrl = query ? `${pathname}?${query}` : pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const [resetKey, setResetKey] = useState(0);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [clickedGroup, setClickedGroup] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [headerCategories, setHeaderCategories] =
    useState<Category[]>(categories);

  // Client-side fetch to ensure logo URL works on live (same pattern as AdminSidebar)
  const [settings, setSettings] = useState<any>(settingsProp);

  useEffect(() => {
    setHeaderCategories(categories);
  }, [categories]);

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
  }, [pathname]);

  useEffect(() => {
    getSettingsByKeysFooter().then((res) => {
      if (res.success && res.data) {
        setSettings(res.data);
      }
    });
  }, []);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  useEffect(() => {
    const handleComplete = () => {
      setIsNavigating(false);
    };

    window.addEventListener("popstate", handleComplete);

    return () => {
      window.removeEventListener("popstate", handleComplete);
    };
  }, []);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [disableHover, setDisableHover] = useState(false);

  const handleNavigate = (url: string) => {
    if (pathname !== url) {
      setIsNavigating(true);
      router.push(url);

      setTimeout(() => {
        setIsNavigating(false);
      }, 2000);
    }
  };

  // Click-time auth URL builder — reads window.location at click, no stale state
  const getAuthUrl = (base: "/user/signin" | "/signup"): string => {
    if (typeof window === "undefined") return base;
    const currentPathname = window.location.pathname.replace(/\/$/, "");
    const params = new URLSearchParams(window.location.search);
    const existingReturnUrl = params.get("returnUrl"); // auto-decoded
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
      const matched = headerCategories.filter((cat) =>
        children.some(
          (child) =>
            child.trim().toLowerCase() ===
            cat.category_name.trim().toLowerCase(),
        ),
      );

      const directCategory = headerCategories.find(
        (cat) =>
          cat.category_name.trim().toLowerCase() ===
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
                path: `/inventory?category=${slugify(cat.category_name)}`,
              }))
            : undefined,
      });
    });

    const dynamicCategories: NavItem[] = [];

    headerCategories.forEach((cat) => {
      const categoryName = cat.category_name.trim().toLowerCase();

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
          path: `/inventory?category=${slugify(cat.category_name)}`,
        });
      }
    });

    return [...groupedMenus, ...dynamicCategories];
  }, [headerCategories, slugify]);

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

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    setResetKey((prev) => prev + 1);
  };
  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, [pathname]);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    if (pathname) {
      setCurrentPath(pathname);
    }
  }, [pathname]);

  const hasBgImage = useMemo(() => {
    if (!currentPath) return false;

    if (currentPath === "/inventory" || currentPath === "/inventory/") {
      return false;
    }

    return (
      currentPath.startsWith("/inventory") ||
      currentPath.startsWith("/signup") ||
      currentPath.startsWith("/confirmation") ||
      currentPath.startsWith("/sale-agreement") ||
      currentPath.startsWith("/checkout")
    );
  }, [currentPath]);

  return (
    <>
      {isNavigating && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
          <Loader />
        </div>
      )}
      <header className={`w-full z-50 relative ${ hasBgImage ? "" : "bg-transparent" }`} >
        <div className={`mx-auto flex justify-between items-center pb-4 px-10 md:px-[60px] ${ hasBgImage ? "border-b border-border pt-5" : "bg-transparent pt-[40px]" }`}>
          <Link href="/">
            {settings?.dark_logo && <img src={settings.dark_logo} alt="Logo" />}
          </Link>
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
                  onClick={() => handleNavigate(item.path)}
            className={`text-base font-medium cursor-pointer relative overflow-hidden
                before:absolute before:left-0 before:bottom-0 before:h-[2px]
                before:w-full before:origin-left before:scale-x-0
                before:bg-orange before:transition-transform before:duration-300
                hover:before:scale-x-100 hover:text-orange
                ${
                  item.path === "/"
                    ? pathname === "/"
                      ? "text-orange font-bold before:scale-x-100"
                      : hasBgImage
                        ? "text-[#1D1B1A]"
                        : "text-white"
                    : pathname.startsWith(item.path)
                      ? "text-orange font-bold before:scale-x-100"
                      : hasBgImage
                        ? "text-[#1D1B1A]"
                        : "text-white"
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
                            ? "text-orange font-bold after:w-8"
                            : hasBgImage
                              ? "text-[#1D1B1A] hover:text-orange"
                              : "text-white hover:text-orange"
                          : pathname.startsWith(item.path)
                            ? "text-orange font-bold after:w-8"
                            : hasBgImage
                              ? "text-[#1D1B1A] hover:text-orange"
                              : "text-white hover:text-orange"
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
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                let url = "";

                                if (hasSubmenu) {
                                  const categories = group.submenu
                                    ?.map(
                                      (sub) => sub.path.split("category=")[1],
                                    )
                                    .filter(Boolean)
                                    .join(",");

                                  url = `/inventory?category=${categories}`;
                                } else {
                                  url = group.path;
                                }

                                setDisableHover(true);
                                setOpenDropdown(null);
                                setActiveGroup(null);
                                setClickedGroup(null);

                                handleNavigate(url);
                                setTimeout(() => setDisableHover(false), 300);
                              }}
                              className="
                                w-full flex justify-between items-center text-[#1D1B1A]
                                  font-medium hover:text-orange cursor-pointer
                              "
                            >
                              {group.name}

                              {hasSubmenu && (
                                <MdChevronRight
                                  size={20}
                                  className="text-gray-400"
                                />
                              )}
                            </button>

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
                                    <button
                                      onClick={() => {
                                        setOpenDropdown(null);
                                        setActiveGroup(null);
                                        setClickedGroup(null);
                                        handleNavigate(subItem.path);
                                      }}
                                      className="
                                        block w-full text-left py-2
                                        text-white font-medium hover:text-orange
                                      text-base cursor-pointer hover:bg-gray-50  px-4
                                      "
                                    >
                                      {subItem.name}
                                    </button>
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
          {loggedIn ? (
            <button
              onClick={() => handleNavigate("/user")}
               className={`hidden lg:block transition cursor-pointer text-base leading-[16px] h-[40px] py-[12px] px-[25px] rounded-[50px] ${
              hasBgImage
                ? "text-white bg-green hover:bg-orange"
                : "text-green bg-white font-semibold hover:bg-orange hover:text-white"
            }`}
            >
              Dashboard
            </button>
          ) : (
            <div className="hidden lg:flex gap-3 items-center">
              {/* Sign In (Outline - light) */}
              <button
                onClick={() => handleNavigate(getAuthUrl("/user/signin"))}
                 className="flex h-10 items-center justify-center rounded-[62px] border border-white px-4 xl:px-[25px] text-sm xl:text-base font-semibold text-white transition-all duration-300 hover:bg-white hover:text-black cursor-pointer"
              >
                Sign In
              </button>

              {/* Sign Up (Primary highlight) */}
              {!pathname.startsWith("/signup") && (
                <button
                  onClick={() => {
                    setIsNavigating(true);
                    handleNavigate(getAuthUrl("/signup"));
                  }}
                 className="flex h-10 items-center justify-center rounded-[62px] border border-primary bg-primary px-4 xl:px-[25px] text-sm xl:text-base font-semibold text-white transition-all duration-300 hover:bg-orange-500 hover:border-orange-500 cursor-pointer"
                >
                  Sign Up
                </button>
              )}
            </div>
          )}

          <button
            ref={buttonRef}
            className="lg:hidden focus:outline-none cursor-pointer text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <HiBars3BottomRight size={36} />
          </button>
        </div>

        <div
          ref={menuRef}
          className={`lg:hidden ${isMenuOpen ? "block" : "hidden"}`}
        >
          <div
            className={`lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300
            ${
              isMenuOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }
          `}
            onClick={handleCloseMenu}
          ></div>
          <div
            ref={menuRef}
            className={`
            lg:hidden fixed top-0 left-0 h-full w-[260px] bg-white shadow-xl z-[100]
            px-3 pb-8 pt-3 transition-transform duration-300 overflow-y-auto
            ${isMenuOpen ? "sidebar-open" : "sidebar-closed"}
          `}
          >
            <Link href="/">
              {settings?.dark_logo && (
                <Image
                  src={settings.dark_logo}
                  alt="Logo"
                  height={100}
                  width={100}
                  loading="eager"
                  priority
                />
              )}
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
                className="
              mt-6 block text-center text-green bg-white border border-green 
              py-3 px-6 rounded-lg font-semibold 
              transition-all duration-300 
              hover:bg-orange hover:text-white hover:border-orange
            "
              >
                Dashboard
              </Link>
            ) : (
              <div className="">
                <button
                  onClick={() => handleNavigate(getAuthUrl("/user/signin"))}
                  className="
              mt-6 block text-center text-green bg-white border border-green 
              py-3 px-6 rounded-lg font-semibold w-full
              transition-all duration-300 
              hover:bg-orange hover:text-white hover:border-orange
            "
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavigate(getAuthUrl("/signup"))}
                  className="
              mt-2 block text-center text-green bg-white border border-green 
              py-3 px-6 rounded-lg font-semibold w-full
              transition-all duration-300 
              hover:bg-orange hover:text-white hover:border-orange
            "
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
