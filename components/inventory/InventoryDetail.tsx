"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FaChevronDown } from "react-icons/fa";
import ProductSlider from "./ProductSlider";
import {
  getAllCategories,
  getMakes,
  getModels,
  getSingleInventory,
} from "@/api/categoryActions";
import { SingleMachinery } from "@/types/apiType";
import Loader from "../common/Loader";
import { usePathname } from "next/navigation";
import BidInput from "./BidInput";
import toast from "react-hot-toast";
import { calculateDistanceApi } from "@/api/calculateDistance";
import { Category } from "@/api/data";
import { formatPrice } from "@/hooks/formate";
import { useRouter } from "next/navigation";

function getTimeLeft(endTime: string) {
  const end = new Date(endTime.replace(" ", "T")).getTime();
  const now = new Date().getTime();

  const diff = end - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

const countries = ["USA", "CANADA"];

function InventoryDetail() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const pathname = usePathname();

  // /inventory/agricultural-machinery/mahindra/seed-drill-9-row/1200
  const segments = pathname.split("/").filter(Boolean);
  const categorySlug = segments[1] ?? "";
  const makeSlug = segments[2] ?? "";
  const modelSlug = segments[3] ?? "";
  const hours = segments[4] ?? "";

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SingleMachinery>();
  const [distanceMiles, setDistanceMiles] = useState<number | null>(null);
  // const [perMileCost, setPerMileCost] = useState<number | null>(null);
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("USA");
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);

  const getCategoryBySlug = (slug?: string) => {
    if (!slug) return null;

    return categories.find((c) => slugify(c.category_name) === slug);
  };
  const matchedCategory = getCategoryBySlug(categorySlug);
  const categoryName = matchedCategory?.category_name ?? "";
  const getMakeBySlug = (slug?: string) => {
    if (!slug) return null;
    return makes.find((m) => slugify(m) === slug);
  };

  const getModelBySlug = (slug?: string) => {
    if (!slug) return null;
    return models.find((m) => slugify(m) === slug);
  };

  const matchedMake = getMakeBySlug(makeSlug);
  const matchedModel = getModelBySlug(modelSlug);

  const makeName = matchedMake ?? "";
  const modelName = matchedModel ?? "";

  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();

        if (res?.success) {
          setCategories(res.data);
        }
      } finally {
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMakes = async () => {
      const res = await getMakes();
      if (res?.success) {
        setMakes(res.data); // ["Mahindra","Tadano",...]
      }
    };
    fetchMakes();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      const res = await getModels();
      if (res?.success) {
        setModels(res.data); // ["Seed Drill 9 Row", ...]
      }
    };
    fetchModels();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;

      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchSingle = async () => {
    try {
      const res = await getSingleInventory({
        category: categoryName, // ✅ original
        make: makeName, // ✅ original
        model: modelName, // ✅ original
        auction_id: hours,
      });

      if (res?.success) {
       if (res.data?.status !== 1) {
          setIsRedirecting(true);
        router.push("/inventory");
        return;
      }
        setData(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryName && makeName && modelName && hours) {
      fetchSingle();
    }
  }, [categoryName, makeName, modelName, hours]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!data?.bid_end_time) return;

    setTimeLeft(getTimeLeft(data.bid_end_time)); // initial set

    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(data.bid_end_time));
    }, 1000);

    return () => clearInterval(timer);
  }, [data?.bid_end_time]);

  const calculateDeliveryCost = async (zip: string, country: string) => {
    try {
      setCalcLoading(true);

      const res = await calculateDistanceApi({
        zip_code: zip,
        country,
      });

      if (res.status === "success") {
        setDistanceMiles(res.distance_miles);
        // setPerMileCost(Number(res.per_mile_delivery_cost));
        setDeliveryCost(res.total_cost);
      } else {
        toast.error("Failed to calculate delivery cost");
      }
    } catch (err: any) {
      toast.error(err?.message || "Distance calculation failed");
    } finally {
      setCalcLoading(false);
    }
  };
  const getOfferCount = (offer: string[] | number | undefined): number => {
    if (!offer) return 0;
    if (Array.isArray(offer)) return offer.length;
    return offer;
  };
  const offerCount = getOfferCount(data?.offer);

    const features = [
  {
    icon: "/assets/images/detail1.svg",
    title: "100% Secured Payments",
  },
  {
    icon: "/assets/images/detail2.svg",
    title: "Money back guaranteed",
  },
  {
    icon: "/assets/images/detail3.svg",
    title: "Delivery anywhere within the USA & Canada",
  },
  {
    icon: "/assets/images/detail4.svg",
    title: "30-day hassle-free returns",
  },
  {
    icon: "/assets/images/detail5.svg",
    title: "6 months warranty",
  },
  {
    icon: "/assets/images/detail6.svg",
    title: "Pre-delivery inspection",
  },
];

  if (loading || isRedirecting) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container-custom mt-10 lg:mt-20 mb-20 lg:mb-[110px]">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-7 order-2 xl:order-1">
       <div className="hidden xl:block">  {data && <ProductSlider data={data} />}</div> 
        <div className="hidden xl:block w-full">
          <h2 className="text-[24px] font-semibold text-[#22201C] mb-5">
            Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {/* Year */}
            <div className="bg-white rounded-[10px] shadow-[0_2px_25px_rgba(34,32,28,0.1)] p-5 flex items-center gap-3">
              <div className="w-[40px] h-[40px] rounded-full bg-[#FCE1D2]/50 flex items-center justify-center shrink-0">
                <Image src="/assets/images/overview1.svg" alt="" width={20} height={20} />
              </div>

              <div>
                <p className="text-base text-[#4B4947] leading-none mb-[10px]">
                  Year
                </p>
                <p className="text-lg font-semibold text-gray leading-none">
                  {data?.year}
                </p>
              </div>
            </div>

            {/* Weight */}
            <div className="bg-white rounded-[10px] shadow-[0_2px_25px_rgba(34,32,28,0.1)] p-5 flex items-center gap-3">
                <div className="w-[40px] h-[40px] rounded-full bg-[#FCE1D2]/50 flex items-center justify-center shrink-0">
                <Image src="/assets/images/overview2.svg" alt="" width={20} height={20} />
              </div>

              <div>
                <p className="text-base text-[#4B4947] leading-none mb-[10px]">
                  Weight
                </p>
                <p className="text-lg font-semibold text-gray leading-none">
                  {data?.weight}
                </p>
              </div>
            </div>

            {/* Working Hours */}
           <div className="bg-white rounded-[10px] shadow-[0_2px_25px_rgba(34,32,28,0.1)] p-5 flex items-center gap-3">
               <div className="w-[40px] h-[40px] rounded-full bg-[#FCE1D2]/50 flex items-center justify-center shrink-0">
                <Image src="/assets/images/overview3.svg" alt="" width={20} height={20} />
              </div>

              <div>
                <p className="text-base text-[#4B4947] leading-none mb-[10px]">
                  Working Hours
                </p>
                 <p className="text-lg font-semibold text-gray leading-none">
                  {data?.working_hours}
                </p>
              </div>
            </div>

              {/* Fuel Type */}
              <div className="bg-white rounded-[10px] shadow-[0_2px_25px_rgba(34,32,28,0.1)] p-5 flex items-center gap-3">
                 <div className="w-[40px] h-[40px] rounded-full bg-[#FCE1D2]/50 flex items-center justify-center shrink-0">
                <Image src="/assets/images/overview4.svg" alt="" width={20} height={20} />
              </div>

                <div>
                  <p className="text-base text-[#4B4947] leading-none mb-[10px]">
                    Fuel Type
                  </p>
                  <p className="text-lg font-semibold text-gray leading-none">
                    {data?.fuel}
                  </p>
                </div>
              </div>

            {/* Condition */}
             <div className="bg-white rounded-[10px] shadow-[0_2px_25px_rgba(34,32,28,0.1)] p-5 flex items-center gap-3">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#FCE1D2]/50 flex items-center justify-center shrink-0">
                <Image src="/assets/images/overview5.svg" alt="" width={20} height={20} />
              </div>

                <div>
                 <p className="text-base text-[#4B4947] leading-none mb-[10px]">
                    Condition
                  </p>

                  <span className="inline-flex items-center rounded-full bg-[#F97316] px-4 py-[5px] text-sm font-medium text-white leading-none">
                    {data?.condition}
                  </span>
                </div>
              </div>

            {/* Serial Number */}
            <div className="bg-white rounded-[10px] shadow-[0_2px_25px_rgba(34,32,28,0.1)] p-5 flex items-center gap-3">
                <div className="w-[40px] h-[40px] rounded-full bg-[#FCE1D2]/50 flex items-center justify-center shrink-0">
                <Image src="/assets/images/overview6.svg" alt="" width={20} height={20} />
              </div>

              <div>
               <p className="text-base text-[#4B4947] leading-none mb-[10px]">
                  Serial Number
                </p>
                <p className="text-lg font-semibold text-gray leading-none">
                  {data?.serial_number}
                </p>
              </div>
            </div>

          </div>
        </div>
        <div className="border-t border-border my-[40px] hidden xl:block"></div>
          <div className="mt-[30px] hidden xl:block">
            <h3 className="mb-[15px] text-lightblack text-lg leading-[22px] font-bold">
              Description
            </h3>
            <div
              className="text-text-gray mb-[15px] text-base font-normal"
              dangerouslySetInnerHTML={{ __html: data?.description ?? "" }}
            />
          </div>
          <div className="border-t border-border my-[40px]"></div>
          {/* <div className="w-full space-y-4 pt-[15px]">
            <div className="flex justify-between items-center">
              <h2 className="text-xl leading-[20px] font-semibold text-gray">
                Specification
              </h2>
              <p className="text-xl leading-[20px] font-semibold text-gray">
                Details
              </p>
            </div>
            <div className="border-t border-border"></div>
            <div className="w-full">
              {data?.specification?.map((item: any, index: any) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-[15px] odd:bg-[#F9F9F9]"
                >
                  <span className="text-text-gray">{item.key}</span>
                  <span className="text-text-gray">{item.value}</span>
                </div>
              ))}
            </div>
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {features.map((item, index) => {
          return (
            <div
              key={index}
              className="flex items-center gap-3 bg-white rounded-full p-[15px] border border-[#F3F3F3] shadow-[0_2px_25px_rgba(34,32,28,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_35px_rgba(34,32,28,0.12)]"
            >
              <div className="w-[40px] h-[40px] rounded-full bg-[#FCE1D2]/50 flex items-center justify-center shrink-0">
                 <Image
                  src={item.icon}
                  alt={item.title}
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>

              <h3 className="text-base leading-[22px] font-medium text-[#343231]">
                {item.title}
              </h3>
            </div>
          );
        })}
      </div>
        </div>
        
        <div className="col-span-12 xl:col-span-5 order-1 xl:order-2">
          <div className="shadow-[0_8px_35px_rgba(0,0,0,0.08)] p-5 rounded-[10px]">
            <div className="flex justify-between flex-wrap gap-2">
              <h4 className="text-orange text-lg xl:text-lg xl:mb-[15px]  relative after:absolute after:top-3 after:left-0 after:bg-orange after:w-[15px] after:h-[2px] pl-5 after:rounded-full font-semibold">
                {data?.category?.category_name}
              </h4>
              <div className="text-end mb-2 sm:mb-0">
                <strong>Auction ID</strong> : {data?.auction_id}
              </div>
            </div>
            <h2 className="text-secgray text-[22px] md:text-[28px] sm:leading-[38px] mb-5 font-semibold">
              {data?.name}
            </h2>
             <div className="block xl:hidden">  {data && <ProductSlider data={data} />}</div> 
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-[17px] pb-[30px] mb-[30px] border-b border-[#D2D1D1]">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-full p-3 2xl:p-4 flex flex-col items-center justify-center bg-[#E9E9E94D] w-[80px] md:w-[90px] h-[80px] md:h-[90px] mx-auto"
                >
                  <span className="text-xl 2xl:text-[30px] 2xl:mb-[7px] 2xl:leading-[36px] font-semibold text-[#343231]">
                    {item.value}
                  </span>
                  <span className="text-text-gray text-sm">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-[10px] items-center mb-[18px]">
              <p className="text-secgray text-base leading-[16px]">
                Current bid:
              </p>
              <p className="text-green text-[22px] leading-[22px] font-semibold">
                {formatPrice(data?.current_bid)}
              </p>
            </div>
            <div className="flex items-center bg-[#E9E9E980] text-gray border border-[#D2D1D1] p-3 rounded-full gap-[10px] text-base mb-[30px]">
              <Image src="/assets/images/fire-new.svg" alt="icon" width={30} height={30} />
              {offerCount === 1
                ? "1 offer was received"
                : `${offerCount} offers were received`}
            </div>
            
            {data?.status === 1 && (
              <BidInput
                currentBid={Number(data.current_bid)}
                machineryId={data.id}
                buyNow={Number(data.buy_now_price)}
                categoryName={data.category?.category_name}
                make={data.make ?? ""}
                model={data.model ?? ""}
                auction_id={data.auction_id ?? ""}
                onBidSuccess={fetchSingle}
              />
            )}
            <div className="border-t border-border my-[30px]"></div>
               <div className="block xl:hidden w-full">
          <h2 className="text-[24px] font-semibold text-[#22201C] mb-5">
            Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {/* Year */}
            <div className="bg-white rounded-[10px] shadow-[0_2px_25px_rgba(34,32,28,0.1)] p-5 flex items-center gap-3">
              <div className="w-[40px] h-[40px] rounded-full bg-[#FCE1D2]/50 flex items-center justify-center shrink-0">
                <Image src="/assets/images/overview1.svg" alt="" width={20} height={20} />
              </div>

              <div>
                <p className="text-base text-[#4B4947] leading-none mb-[10px]">
                  Year
                </p>
                <p className="text-lg font-semibold text-gray leading-none">
                  {data?.year}
                </p>
              </div>
            </div>

            {/* Weight */}
            <div className="bg-white rounded-[10px] shadow-[0_2px_25px_rgba(34,32,28,0.1)] p-5 flex items-center gap-3">
                <div className="w-[40px] h-[40px] rounded-full bg-[#FCE1D2]/50 flex items-center justify-center shrink-0">
                <Image src="/assets/images/overview2.svg" alt="" width={20} height={20} />
              </div>

              <div>
                <p className="text-base text-[#4B4947] leading-none mb-[10px]">
                  Weight
                </p>
                <p className="text-lg font-semibold text-gray leading-none">
                  {data?.weight}
                </p>
              </div>
            </div>

            {/* Working Hours */}
           <div className="bg-white rounded-[10px] shadow-[0_2px_25px_rgba(34,32,28,0.1)] p-5 flex items-center gap-3">
               <div className="w-[40px] h-[40px] rounded-full bg-[#FCE1D2]/50 flex items-center justify-center shrink-0">
                <Image src="/assets/images/overview3.svg" alt="" width={20} height={20} />
              </div>

              <div>
                <p className="text-base text-[#4B4947] leading-none mb-[10px]">
                  Working Hours
                </p>
                 <p className="text-lg font-semibold text-gray leading-none">
                  {data?.working_hours}
                </p>
              </div>
            </div>

              {/* Fuel Type */}
              <div className="bg-white rounded-[10px] shadow-[0_2px_25px_rgba(34,32,28,0.1)] p-5 flex items-center gap-3">
                 <div className="w-[40px] h-[40px] rounded-full bg-[#FCE1D2]/50 flex items-center justify-center shrink-0">
                <Image src="/assets/images/overview4.svg" alt="" width={20} height={20} />
              </div>

                <div>
                  <p className="text-base text-[#4B4947] leading-none mb-[10px]">
                    Fuel Type
                  </p>
                  <p className="text-lg font-semibold text-gray leading-none">
                    {data?.fuel}
                  </p>
                </div>
              </div>

            {/* Condition */}
             <div className="bg-white rounded-[10px] shadow-[0_2px_25px_rgba(34,32,28,0.1)] p-5 flex items-center gap-3">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#FCE1D2]/50 flex items-center justify-center shrink-0">
                <Image src="/assets/images/overview5.svg" alt="" width={20} height={20} />
              </div>

                <div>
                 <p className="text-base text-[#4B4947] leading-none mb-[10px]">
                    Condition
                  </p>

                  <span className="inline-flex items-center rounded-full bg-[#F97316] px-4 py-[5px] text-sm font-medium text-white leading-none">
                    {data?.condition}
                  </span>
                </div>
              </div>

            {/* Serial Number */}
            <div className="bg-white rounded-[10px] shadow-[0_2px_25px_rgba(34,32,28,0.1)] p-5 flex items-center gap-3">
                <div className="w-[40px] h-[40px] rounded-full bg-[#FCE1D2]/50 flex items-center justify-center shrink-0">
                <Image src="/assets/images/overview6.svg" alt="" width={20} height={20} />
              </div>

              <div>
               <p className="text-base text-[#4B4947] leading-none mb-[10px]">
                  Serial Number
                </p>
                <p className="text-lg font-semibold text-gray leading-none">
                  {data?.serial_number}
                </p>
              </div>
            </div>

          </div>
        </div>
              <div className="mt-[30px] block xl:hidden">
            <h3 className="mb-[15px] text-lightblack text-[22px] leading-[22px] font-semibold">
              Description
            </h3>
            <div
              className="text-text-gray mb-[15px] text-base font-normal"
              dangerouslySetInnerHTML={{ __html: data?.description ?? "" }}
            />
          </div>
          <div className="border-t border-border my-[40px] block xl:hidden"></div>
            <div className="w-full space-y-5">
              <h2 className="text-base font-semibold text-gray mb-[10px]">
                Delivery cost calculator
              </h2>

              <p className="text-text-gray text-base mb-[25px]">
                We will deliver this equipment to your location. You can
                estimate the cost below.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-3 mb-[5px]">
                  <div className="flex flex-col items-center">
                    <Image
                      src="/assets/location1.svg"
                      alt="icon"
                      width={22}
                      height={22}
                    />
                    <div className="border-l border-dashed border-gray h-10 mt-1"></div>
                  </div>
                  <p className="font-semibold text-gray text-base">
                    From our location
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <Image
                      src="/assets/location2-new.svg"
                      alt="icon"
                      width={20}
                      height={20}
                    />
                  </div>
                  <p className="font-semibold text-gray text-base">
                    To your delivery location
                  </p>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-5">
                {/* Zip Code */}
                <Formik
                  initialValues={{
                    zip: "",
                    country: countries[0],
                  }}
                  validationSchema={Yup.object({
                    zip: Yup.string().required("Zip code is required"),
                    country: Yup.string().required("Country is required"),
                  })}
                  onSubmit={(values) => {
                    calculateDeliveryCost(values.zip, selectedCountry);
                  }}
                >
                  {({ setFieldValue, errors, touched }) => (
                    <Form className="space-y-5">
                      {/* ZIP CODE INPUT */}
                      <div className="mb-[25px]">
                        <label className="text-lightblack text-base mb-2 block font-semibold">
                          Zip code
                        </label>

                        <Field
                          name="zip"
                          type="text"
                          placeholder="Enter your zip code"
                          className="w-full px-5 py-2 md:py-3 sm:py-[18px] border border-border rounded-[50px] outline-none focus:border-green text-base placeholder:text-[#787675] sm:h-[52px]"
                        />
                        {touched.zip && errors.zip && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.zip}
                          </p>
                        )}
                      </div>

                      {/* COUNTRY DROPDOWN - HEADLESS UI LISTBOX */}
                      <div>
                        <label className="text-lightblack text-base mb-2 block font-semibold">
                          Choose your country
                        </label>
                        <div ref={ref} className="relative mt-2">
                          {/* BUTTON */}
                          <button
                            type="button"
                            onClick={() => setOpen(!open)}
                            className="
                            w-full border border-border
                            px-5 py-2 md:py-3 sm:py-[18px] text-left
                            bg-white focus:border-green
                            flex items-center justify-between rounded-[50px] outline-none focus:border-green text-base placeholder:text-[#787675] sm:h-[52px] cursor-pointer
                          "
                          >
                            <span>{selectedCountry}</span>
                            <FaChevronDown
                              className={`text-gray-500 text-xs transition-transform ${
                                open ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {/* DROPDOWN */}
                          {open && (
                            <div
                              className="
                              absolute left-0 right-0 mt-2
                              rounded-xl bg-white shadow-lg
                              border border-border z-[999]
                              max-h-60 overflow-auto
                            "
                            >
                              {countries.map((country) => (
                                <div
                                  key={country}
                                  onClick={() => {
                                    setSelectedCountry(country);
                                    setFieldValue("country", country); // 🔥 Formik sync
                                    setOpen(false);
                                  }}
                                  className={`
                                  px-4 py-2 text-sm cursor-pointer transition
                                  ${
                                    selectedCountry === country
                                      ? "bg-green text-white"
                                      : "hover:bg-green/10 hover:text-green text-text-gray"
                                  }
                                `}
                                >
                                  {country}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={calcLoading}
                          className="py-3 px-[18px] border border-green text-green rounded-full text-base !leading-[16px] font-medium transition mt-[25px] cursor-pointer hover:bg-green hover:text-white h-[40px]"
                        >
                          {calcLoading
                            ? "Calculating..."
                            : "Calculate shipping costs"}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
                {/* Calculate Button */}
              </div>

              {/* Result */}
              <div className="pt-2 mb-0">
                <p className="text-gray font-medium text-lg !leading-[18px] mb-[15px]">
                  Delivery cost estimation
                </p>

                {deliveryCost !== null ? (
                  <>
                    <p className="text-green font-bold text-[26px] mb-[5px]">
                      {formatPrice(deliveryCost)}
                    </p>

                    <p className="text-text-gray text-sm">
                      Distance: {distanceMiles} miles
                      {/* Distance: {distanceMiles} miles × ${perMileCost}/mile */}
                    </p>
                  </>
                ) : (
                  <p className="text-text-gray text-sm">
                    Enter ZIP & country to calculate delivery cost
                  </p>
                )}

                <p className="text-text-gray flex items-center gap-1 text-sm mt-2 font-semibold">
                  Powered by
                  <Image
                    src="/assets/google.png"
                    alt="google"
                    width={48}
                    height={17}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryDetail;
