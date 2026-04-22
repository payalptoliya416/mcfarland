"use client";

import { isLoggedIn } from "@/api/authToken";
import { Category } from "@/api/data";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  handleNavigate
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
  settings,
}: {
  categories: Category[];
  settings: any;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  // const [categories, setCategories] = useState<Category[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [clickedGroup, setClickedGroup] = useState<string | null>(null);
const [isNavigating, setIsNavigating] = useState(false);
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
  useEffect(() => {
    function close(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest(".dropdown-parent")) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  // const inventorySubmenu: NavItem[] = Object.entries(inventoryGroups).map(
  //   ([groupName, children]) => {
  //     const matched = categories.filter((cat) =>
  //       children.includes(cat.category_name),
  //     );

  //     return {
  //       name: groupName,
  //       path: "#",
  //       submenu: matched.map((cat) => ({
  //         name: cat.category_name,
  //         path: `/inventory?category=${slugify(cat.category_name)}`,
  //       })),
  //     };
  //   },
  // );
const inventorySubmenu: NavItem[] = useMemo(() => {
  return Object.entries(inventoryGroups).map(
    ([groupName, children]) => {
      const matched = categories.filter((cat) =>
        children.includes(cat.category_name),
      );

      return {
        name: groupName,
        path: "#",
        submenu: matched.map((cat) => ({
          name: cat.category_name,
          path: `/inventory?category=${slugify(cat.category_name)}`,
        })),
      };
    },
  );
}, [categories]);

  // const navItems: NavItem[] = [
  //   { name: "Home", path: "/" },
  //   {
  //     name: "Inventory",
  //     path: "/inventory",
  //     submenu: inventorySubmenu,
  //   },
  //   { name: "About Us", path: "/about-us" },
  //   { name: "Services", path: "/services" },
  //   { name: "FAQ", path: "/faq" },
  //   { name: "Contact Us", path: "/contact-us" },
  // ];

    const navItems: NavItem[] = useMemo(() => [
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
  ], [inventorySubmenu]);

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

  // const [settings, setSettings] = useState<any>(null);

  // useEffect(() => {
  //   getSettingsByKeysFooter().then((res) => {
  //     if (res.success) {
  //       setSettings(res.data);
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const res = await getAllCategories();
  //       if (res?.success) {
  //         setCategories(res.data);
  //       }
  //     } catch (e) {}
  // //   };

  //   fetchCategories();
  // }, []);

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    setResetKey((prev) => prev + 1);
  };
  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, [pathname]);

const [currentPath, setCurrentPath] = useState("");

useEffect(() => {
  if (typeof window !== "undefined") {
    setCurrentPath(window.location.pathname);
  }
}, []);

const isInventoryMain =
  currentPath === "/inventory" || currentPath === "/inventory/";

const hasBgImage =
  !isInventoryMain &&
  (
    currentPath.startsWith("/inventory") ||
    currentPath.startsWith("/verify-account") ||
    currentPath.startsWith("/verify-account/") ||
    currentPath.startsWith("/signup") ||
    currentPath.startsWith("/confirmation") ||
    currentPath.startsWith("/sale-agreement") ||
    currentPath.startsWith("/checkout")
  );

  return (
    <>
    {isNavigating && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
  <Loader/>
  </div>
)}
    <header
      className={`
    w-full z-50 relative
    ${
      hasBgImage
        ? "bg-[url(/assets/header-bg-new.png)] bg-no-repeat bg-top bg-cover lg:bg-[length:100%_100%]"
        : "bg-transparent"
    }
  `}
    >
      <div className="container-custom mx-auto flex justify-between items-center py-4 px-4 md:px-0">
        <Link href="/">
          {settings?.dark_logo && (
            <Image
              src={`${settings.dark_logo}`}
              alt="Logo"
              height={80}
              width={0}
              style={{ width: "auto", height: "auto" }}
              priority
            />
          )}
        </Link>
        <ul className="hidden lg:flex justify-center items-center gap-8 md:gap-12">
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
                onClick={() =>handleNavigate(item.path)}
                className={`text-base font-medium text-gray-700 hover:text-orange cursor-pointer relative
                after:content-[''] after:absolute after:-bottom-1
                after:left-1/2 after:-translate-x-1/2
                after:h-1 after:w-0
                after:bg-[linear-gradient(180deg,#FFAD0100_0%,#FFAD01_50%,#FFAD0100_100%)]
                after:transition-all after:duration-300
                hover:after:w-8 hover:text-orange transition-all duration-300   ${
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
                  className={`hover:text-orange transition mt-1  ${
                    item.path === "/"
                      ? pathname === "/"
                        ? "text-orange font-bold after:w-8"
                        : "text-gray-700 font-medium"
                      : pathname.startsWith(item.path)
                        ? "text-orange font-bold after:w-8"
                        : "text-gray-700 font-medium"
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
                    {item.submenu?.map((group) => {
                      const hasSubmenu = (group.submenu?.length ?? 0) > 0;
                      const isOpen = activeGroup === group.name;

                      return (
                        <li
                          key={group.name + group.path}
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
                                  ?.map((sub) => sub.path.split("category=")[1])
                                  .filter(Boolean)
                                  .join(",");

                                url = `/inventory?category=${categories}`;
                              } else {
                                url = `/inventory?category=${slugify(group.name)}`;
                              }

                              setDisableHover(true);
                              setOpenDropdown(null);
                              setActiveGroup(null);
                              setClickedGroup(null);

                             handleNavigate(url);
                              setTimeout(() => setDisableHover(false), 300);
                            }}
                            className="
                                w-full flex justify-between items-center
                                 text-gray-700 font-medium hover:text-orange cursor-pointer
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
                                        text-gray-700 font-medium hover:text-orange
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
            className="hidden lg:block text-green bg-white py-2 px-4 md:py-3 md:px-6 rounded-lg font-semibold hover:bg-orange hover:text-white transition cursor-pointer"
          >
            Dashboard
          </button>
        ) : (
          <button
              onClick={() => handleNavigate("/user/signin")}
            className="hidden lg:block text-green bg-white py-2 px-4 md:py-3 md:px-6 rounded-lg font-semibold hover:bg-orange hover:text-white transition cursor-pointer"
          >
            Sign In
          </button>
        )}

        <button
          ref={buttonRef}
          className="lg:hidden focus:outline-none cursor-pointer"
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
                src={`${settings.dark_logo}`}
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
            <Link
              href="/user/signin"
              className="
              mt-6 block text-center text-green bg-white border border-green 
              py-3 px-6 rounded-lg font-semibold 
              transition-all duration-300 
              hover:bg-orange hover:text-white hover:border-orange
            "
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
    </>
  );
}

export default Header;
