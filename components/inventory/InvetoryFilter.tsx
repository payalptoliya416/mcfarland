"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Disclosure } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { Category } from "@/api/data";
import {
  getAllCategories,
  getMachineryByCategory,
  getMakes,
  getModels,
} from "@/api/categoryActions";
import Loader from "../common/Loader";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SimpleSteps from "./SimpleSteps";
import { formatPrice } from "@/hooks/formate";
import Select from "react-select";

export default function InventoryFilter({}: {}) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const categorySlugsFromUrl = categoryParam ? categoryParam.split(",") : [];
  const min = 1990;
  const max = new Date().getFullYear();
  const [fromYear, setFromYear] = useState(min);
  const [toYear, setToYear] = useState(max);
  const leftPercent = ((fromYear - min) / (max - min)) * 100;
  const rightPercent = ((toYear - min) / (max - min)) * 100;
  const [openSidebar, setOpenSidebar] = useState(false);

  const sortOptions = [
    { label: "Sort By Default", value: "" },
    { label: "Ending Time: Sooner to Late", value: "ending_soon" },
    { label: "Ending Time: Late to Sooner", value: "ending_late" },
    { label: "Price: Low to High", value: "price_low" },
    { label: "Price: High to Low", value: "price_high" },
    { label: "Newest Added", value: "newest" },
  ];
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingcategory, setLoadingcategory] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedYear, setDebouncedYear] = useState({
    from: fromYear,
    to: toYear,
  });
  const [fromInput, setFromInput] = useState(String(min));
  const [toInput, setToInput] = useState(String(max));
  const ITEMS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [selectedMake, setSelectedMake] = useState("Any Make");
  const [selectedModel, setSelectedModel] = useState("Select Model");
  const router = useRouter();
  const [sortOpen, setSortOpen] = useState(false);
  const categoryCountRef = useRef<Record<number, number>>({});
  const [pageLoading, setPageLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const latestRequestRef = useRef(0);

  const makeOptions = makes.map((make) => ({
    value: make,
    label: make,
  }));

  const modelOptions = models.map((model) => ({
    value: model,
    label: model,
  }));

  useEffect(() => {
    setFromInput(String(fromYear));
  }, [fromYear]);

  useEffect(() => {
    setToInput(String(toYear));
  }, [toYear]);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  useEffect(() => {
    products.forEach((product) => {
    if (product.status === 1) {
        const categorySlug = slugify(product.category?.category_name ?? "");
        const makeSlug = slugify(product.make ?? "");
        const modelSlug = slugify(product.model ?? "");
        const auction_id = product.auction_id;

        const url = `/inventory/${categorySlug}/${makeSlug}/${modelSlug}/${auction_id}`;
        router.prefetch(url);
      }
    });
  }, [products]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  useEffect(() => {
    if (loadingcategory || categories.length === 0) return;

    if (categorySlugsFromUrl.length === 0) {
      setSelectedCategories([]);
      return;
    }

    const matchedIds = categories
      .filter((c) => categorySlugsFromUrl.includes(slugify(c.category_name)))
      .map((c) => c.id);

    setSelectedCategories(matchedIds);
  }, [categorySlugsFromUrl.join(","), categories, loadingcategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategories,
    selectedSort,
    debouncedYear,
    selectedMake,
    selectedModel,
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();

        if (res?.success) {
          setCategories(res.data);
        }
      } finally {
        setLoadingcategory(false);
        setPageLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setDebouncedYear({ from: fromYear, to: toYear });
  }, [fromYear, toYear]);

  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleCategoryChange = (categoryId: number) => {
    setProducts([]);
    setHasFetched(false);

    setSelectedCategories((prev) => {
      let updated: number[];

      if (prev.includes(categoryId)) {
        updated = prev.filter((id) => id !== categoryId);
      } else {
        updated = [...prev, categoryId];
      }

      const selectedSlugs = categories
        .filter((c) => updated.includes(c.id))
        .map((c) => slugify(c.category_name));

      if (selectedSlugs.length === 0) {
        router.push("/inventory");
      } else {
        // setIsNavigating(true);
        router.push(`/inventory?category=${selectedSlugs.join(",")}`);
      }

      return updated;
    });
  };

  useEffect(() => {
    if (loadingcategory) return;
    if (categories.length === 0) return;
    if (categoryParam && selectedCategories.length === 0) return;
    let categoryNames: string[] = [];

    if (selectedCategories.length > 0) {
      categoryNames = categories
        .filter((c) => selectedCategories.includes(c.id))
        .map((c) => c.category_name);
    } else {
      categoryNames = categories.map((c) => c.category_name);
    }

    if (categoryNames.length === 0) {
      setProducts([]);
      return;
    }

    const fetchMachinery = async () => {
      const requestId = ++latestRequestRef.current;

      setLoading(true);
      setHasFetched(false);

      try {
        let visibleProducts: any[] = [];
        let pageToFetch = currentPage;
        let lastPageFromApi = 1;

        while (visibleProducts.length < ITEMS_PER_PAGE) {
          const res = await getMachineryByCategory(
            categoryNames,
            selectedSort.value,
            debouncedYear.from,
            debouncedYear.to,
            selectedMake,
            selectedModel,
            pageToFetch,
            ITEMS_PER_PAGE,
          );
          if (requestId !== latestRequestRef.current) return;

          if (!res?.success || res.data.length === 0) break;

          lastPageFromApi = res.pagination?.last_page || 1;
          visibleProducts = res.data.filter((p: any) => p.status !== 0);

          if (pageToFetch >= lastPageFromApi) break;

          pageToFetch++;
        }
        if (requestId !== latestRequestRef.current) return;
        setProducts(visibleProducts.slice(0, ITEMS_PER_PAGE));
        setTotalPages(lastPageFromApi);
      } catch (err) {
        setProducts([]);
        setTotalPages(1);
      } finally {
        if (requestId !== latestRequestRef.current) return;
        setLoading(false);
        setHasFetched(true);
        setIsNavigating(false);
      }
    };
    fetchMachinery();
  }, [
    selectedCategories,
    selectedSort,
    loadingcategory,
    debouncedYear,
    selectedMake,
    selectedModel,
    currentPage,
  ]);

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const res = await getMakes();
        if (res?.success) {
          setMakes(["Any Make", ...res.data]);
        }
      } finally {
      }
    };

    fetchMakes();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await getModels();
        if (res?.success) {
          setModels(["Select Model", ...res.data]);
          setSelectedModel("Select Model");
        }
      } finally {
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      let clickedInside = false;

      Object.values(cardRefs.current).forEach((card) => {
        if (card && card.contains(e.target as Node)) {
          clickedInside = true;
        }
      });
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (selectedCategories.length > 0) return;
    if (products.length === 0) return;
    const map: Record<number, number> = {};

    products.forEach((product) => {
      // if (product.is_view === 1 && product.category_id) {
      //   map[product.category_id] = (map[product.category_id] || 0) + 1;
      // }
      if (product.category_id) {
        map[product.category_id] = (map[product.category_id] || 0) + 1;
      }
    });

    categoryCountRef.current = map;
  }, [products, selectedCategories]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".relative")) {
        setSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      width: "100%",
      border: "1px solid #D1D5DB",
      borderRadius: "0.5rem",
      padding: "9px 10px",
      fontSize: "14px",
      color: "#374151",
      backgroundColor: "#ffffff",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid #D1D5DB",
      },
    }),

    valueContainer: (base: any) => ({
      ...base,
      padding: "0",
    }),

    input: (base: any) => ({
      ...base,
      margin: "0",
      padding: "0",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    dropdownIndicator: (base: any) => ({
      ...base,
      padding: "4px",
    }),

    menu: (base: any) => ({
      ...base,
      borderRadius: "0.5rem",
      overflow: "hidden",
      zIndex: 9999,
      maxHeight: "240px",
    }),

    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),

    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "var(--color-green)"
        : state.isFocused
          ? "#f3f4f6"
          : "#fff",
      color: state.isSelected ? "#fff" : "#374151",
      fontSize: "14px",
    }),
  };

  if (pageLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {isNavigating && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-[9999]">
          <Loader />
        </div>
      )}
      <div className="w-full container-custom mx-auto pt-[80px] lg:pt-[110px]">
        <div className="w-full grid lg:grid-cols-[280px_1fr] gap-6">
          {/* ================= LEFT SIDEBAR ================= */}
          <aside
            // [calc(100vh-10px)]
            className={`
            custom-scroll
            fixed lg:sticky
            top-0 lg:top-[10px]
            left-0
            h-full lg:h-fit
            w-[280px] lg:w-72
            bg-white
            border border-border
            rounded-none lg:rounded-xl
            p-[15px]
            z-[999]
            overflow-y-auto
            transition-transform duration-300
            ${
              openSidebar
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
          >
            {/* Close button for mobile */}
            <button
              onClick={() => setOpenSidebar(false)}
              className="lg:hidden absolute top-4 right-4 text-xl"
            >
              ✕
            </button>

            {/* FILTER BY CATEGORY */}
            <div>
              <Disclosure defaultOpen>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="w-full flex items-center justify-between mt-10 lg:mt-0">
                      <h2 className="font-semibold text-lg text-gray mont-text">
                        Filter by Category
                      </h2>

                      <FaChevronDown
                        className={`text-gray transition-transform duration-300 ${
                          open ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </Disclosure.Button>

                    <Disclosure.Panel>
                      <div className="mt-[25px] space-y-5">
                        {categories
                          .filter((item) => {
                            const isSelected = selectedCategories.includes(
                              item.id,
                            );
                            if (isSelected) return true;
                            return item.machinery_count > 0;
                          })
                          .map((item, idx) => {
                            return (
                              <label
                                key={item.id}
                                className="flex items-center justify-between text-base cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(
                                      item.id,
                                    )}
                                    onChange={() =>
                                      handleCategoryChange(item.id)
                                    }
                                    className="w-5 h-5 rounded border-[2px] border-border"
                                  />

                                  <span className="text-text-gray">
                                    {item.category_name}
                                  </span>
                                </div>

                                <span className="text-text-gray">
                                  {item.machinery_count}
                                </span>
                              </label>
                            );
                          })}
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>

            <div className="border-t border-border my-[30px]" />

            {/* MAKE & MODEL */}

            <Disclosure defaultOpen>
              {({ open }) => (
                <div>
                  <Disclosure.Button className="w-full flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-lg text-gray mont-text">
                      Filter by Make and Model
                    </h2>
                    <FaChevronDown
                      className={`text-gray transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </Disclosure.Button>

                  <Disclosure.Panel>
                    <div className="space-y-5">
                      {/* MAKE */}
                      <div>
                        <Select
                          options={makeOptions}
                          value={makeOptions.find(
                            (opt) => opt.value === selectedMake,
                          )}
                          onChange={(selected) => {
                            setSelectedMake(selected?.value || "Any Make");
                          }}
                          isSearchable
                          placeholder="Select Make"
                          styles={customSelectStyles}
                          menuPortalTarget={
                            typeof document !== "undefined"
                              ? document.body
                              : null
                          }
                          menuPosition="fixed"
                        />
                      </div>

                      <div>
                        <Select
                          options={modelOptions}
                          value={modelOptions.find(
                            (opt) => opt.value === selectedModel,
                          )}
                          onChange={(selected) => {
                            setSelectedModel(selected?.value || "Select Model");
                          }}
                          isSearchable
                          placeholder="Select Model"
                          styles={customSelectStyles}
                          menuPortalTarget={
                            typeof document !== "undefined"
                              ? document.body
                              : null
                          }
                          menuPosition="fixed"
                        />
                      </div>
                    </div>
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
            <div className="border-t border-border my-[30px]" />

            <Disclosure defaultOpen>
              {({ open }) => (
                <div>
                  <Disclosure.Button className="w-full flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-lg text-gray mont-text">
                      Filter by Year
                    </h2>
                    <FaChevronDown
                      className={`text-gray transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </Disclosure.Button>

                  <Disclosure.Panel>
                    <div className="flex items-center justify-between text-sm text-secgray mt-3 mb-1">
                      <span>{min}</span>
                      <span>{max}</span>
                    </div>
                    <div className="w-full mb-5">
                      <div className="relative w-full h-1 bg-[#FFDE99] rounded-full mt-4 ">
                        <div
                          className="absolute h-[6px] bg-green rounded-full top-1/2 -translate-y-1/2"
                          style={{
                            left: `${Math.max(0, Math.min(100, leftPercent))}%`,
                            width: `${Math.max(0, Math.min(100 - leftPercent, rightPercent - leftPercent))}%`,
                          }}
                        />

                        {/* FROM */}
                        <input
                          type="range"
                          min={min}
                          max={max}
                          value={fromYear}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            if (v < toYear) setFromYear(v);
                          }}
                          className="range-thumb z-10"
                        />

                        {/* TO */}
                        <input
                          type="range"
                          min={min}
                          max={max}
                          value={toYear}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            if (v > fromYear) setToYear(v);
                          }}
                          className="range-thumb z-20"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1/2">
                        <label className="text-base text-secgray">From</label>
                        <input
                          type="number"
                          value={fromInput}
                          onChange={(e) => {
                            let val = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 4);
                            setFromInput(val);

                            const num = Number(val);
                            if (!isNaN(num)) {
                              if (num < min) return;
                              if (num <= toYear) {
                                setFromYear(num);
                              }
                            }
                          }}
                          onBlur={() => {
                            let num = Number(fromInput);
                            if (!num || num < min) num = min;
                            if (num > toYear) num = toYear;
                            setFromYear(num);
                            setFromInput(String(num));
                          }}
                          className="w-full mt-1 border border-border rounded-lg py-2 px-3"
                        />
                      </div>

                      <div className="w-1/2">
                        <label className="text-base text-secgray">To</label>
                        <input
                          type="number"
                          value={toInput}
                          onChange={(e) => {
                            let val = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 4);
                            setToInput(val);

                            const num = Number(val);
                            if (!isNaN(num)) {
                              if (num > max) return;
                              if (num >= fromYear) {
                                setToYear(num);
                              }
                            }
                          }}
                          onBlur={() => {
                            let num = Number(toInput);
                            if (!num || num > max) num = max;
                            if (num < fromYear) num = fromYear;
                            setToYear(num);
                            setToInput(String(num));
                          }}
                          className="w-full mt-1 border border-border rounded-lg py-2 px-3"
                        />
                      </div>
                    </div>
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          </aside>

          <AnimatePresence>
            {openSidebar && (
              <motion.div
                onClick={() => setOpenSidebar(false)}
                className="fixed inset-0 bg-black/30 lg:hidden z-[998]"
              />
            )}
          </AnimatePresence>

          <main className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex justify-between items-end lg:justify-end mb-5 gap-2 lg:gap-0"
            >
              {/* MOBILE FILTER BUTTON */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="lg:hidden"
              >
                <button
                  onClick={() => setOpenSidebar(true)}
                  className="w-10 h-10 border border-border rounded-lg text-xl text-black mont-text font-semibold flex justify-center items-center"
                >
                  <HiMiniBars3BottomLeft scale={28} />
                </button>
              </motion.div>

              <div className="flex items-end sm:items-center gap-3 relative flex-col sm:flex-row">
                <span className="text-sm font-medium text-gray mont-text">
                  Sort By:
                </span>
                <div className="relative">
                  {/* BUTTON */}
                  <button
                    onClick={() => setSortOpen((p) => !p)}
                    className="border border-border rounded-lg px-3 py-2 text-sm 
               text-text-gray flex items-center justify-between w-60 bg-white"
                  >
                    {selectedSort.label}
                    <FaChevronDown
                      className={`text-xs transition-transform ${
                        sortOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* DROPDOWN */}
                  {sortOpen && (
                    <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg z-[9999] border border-border">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSelectedSort(option);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-green/10
            ${
              selectedSort.value === option.value
                ? "text-green font-medium"
                : "text-text-gray"
            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
              {loading ? (
                <div className="col-span-full flex items-center justify-center py-10">
                  <Loader />
                </div>
              ) : hasFetched && products.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-10">
                  No machinery found for selected filters
                </div>
              ) : (
                products.map((product) => {
                  const categorySlug = slugify(
                    product.category?.category_name ?? "",
                  );
                  const makeSlug = slugify(product.make ?? "");
                  const modelSlug = slugify(product.model ?? "");
                  const auction_id = product.auction_id;
                  const friendlyUrl = `/inventory/${categorySlug}/${makeSlug}/${modelSlug}/${auction_id}`;

                  return product.status === 2 ? (
  // 🔴 SOLD (NOT CLICKABLE)
  <div key={product.id} className="h-full">
    <div className="h-full border border-border rounded-[10px] p-[15px] bg-white cursor-not-allowed flex flex-col">
      <div className="w-full flex items-center justify-center border border-border bg-[#E9E9E926] relative group rounded-[12px]">
        {product.first_image_url ? (
          <div className="relative w-full aspect-[240/165] rounded-[12px] overflow-hidden">
            <Image
              src={product.first_image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-[216px] h-[123px]" />
        )}

        <div className="absolute border border-red-300 rounded-md py-2 px-4 text-red-600 bg-red-50 font-semibold text-sm left-1/2 bottom-0 -translate-x-1/2 -translate-y-3">
          SOLD
        </div>
      </div>

      <div className="px-2 mt-[15px]">
        <h3 className="text-lg mb-2">{product.name}</h3>
        <p className="text-sm text-text-gray mb-4">
          {product.year} • {product.working_hours} hrs
        </p>
        <p className="text-green font-semibold">
          Bid Price: {formatPrice(product.bid_start_price)}
        </p>
        <p className="text-green font-bold">
          Buy Price: {formatPrice(product.buy_now_price)}
        </p>
      </div>
    </div>
  </div>
                ) : (
                  // ✅ AVAILABLE (CLICKABLE)
                  <Link
                    key={product.id}
                    href={friendlyUrl}
                    prefetch={true}
                    className="block h-full"
                    onClick={() => setIsNavigating(true)}
                  >
                    <div className="h-full border border-border rounded-[10px] p-[15px] bg-white cursor-pointer hover:shadow-md transition flex flex-col">
                      <div className="w-full flex items-center justify-center border border-border bg-[#E9E9E926] relative group rounded-[12px]">
                        {product.first_image_url && (
                          <div className="relative w-full aspect-[240/165] rounded-[12px] overflow-hidden">
                            <Image
                              src={product.first_image_url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        <div className="absolute border border-border rounded-md py-2 px-4 text-green bg-white text-sm left-1/2 bottom-0 -translate-x-1/2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:-translate-y-3 transition">
                          BID OR BUY
                        </div>
                      </div>

                      <div className="px-2 mt-[15px]">
                        <h3 className="text-lg mb-2">{product.name}</h3>
                        <p className="text-sm text-text-gray mb-4">
                          {product.year} • {product.working_hours} hrs
                        </p>
                        <p className="text-green font-semibold">
                          Bid Price: {formatPrice(product.bid_start_price)}
                        </p>
                        <p className="text-green font-bold">
                          Buy Price: {formatPrice(product.buy_now_price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
                })
              )}
            </div>
            {!loading && products.length > 0 && totalPages > 1 && (
              <div className="flex items-center gap-1 sm:gap-2 justify-center mt-10 flex-wrap">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 w-8 sm:w-auto sm:px-3 justify-center py-2 border border-border cursor-pointer
        rounded-md sm:rounded-xl text-text-gray transition-all h-8 sm:h-11 text-xs sm:text-base
        ${
          currentPage === 1
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
                >
                  <FaChevronLeft className="text-xs sm:text-sm" />
                  <span className="hidden md:block"> Back </span>
                </button>

                {/* PAGE NUMBERS WITH DOTS */}
                {(() => {
                  let pages: (number | string)[] = [];

                  if (totalPages <= 6) {
                    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                  } else {
                    pages.push(1);

                    if (currentPage > 3) pages.push("...");

                    let start = Math.max(2, currentPage - 1);
                    let end = Math.min(totalPages - 1, currentPage + 1);

                    for (let i = start; i <= end; i++) {
                      pages.push(i);
                    }

                    if (currentPage < totalPages - 2) pages.push("...");

                    pages.push(totalPages);
                  }

                  return pages.map((page, index) =>
                    page === "..." ? (
                      <span
                        key={`dots-${index}`}
                        className="px-1 sm:px-2 text-gray-400 font-semibold  text-xs sm:text-base"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center  cursor-pointer
             rounded-md sm:rounded-xl transition-all  text-xs sm:text-base
              ${
                currentPage === page
                  ? "bg-green text-white"
                  : "border border-border text-text-gray hover:bg-gray-100"
              }`}
                      >
                        {page}
                      </button>
                    ),
                  );
                })()}

                {/* NEXT */}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 justify-center py-2 border border-border cursor-pointer
        rounded-md sm:rounded-xl text-text-gray transition-all h-8 sm:h-11 w-8 sm:w-auto sm:px-3  text-xs sm:text-base
        ${
          currentPage === totalPages
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
                >
                  <span className="hidden md:block"> Next </span>
                  <FaChevronRight className="text-xs sm:text-sm" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      <SimpleSteps />
    </>
  );
}
