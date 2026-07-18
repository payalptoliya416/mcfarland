'use client'

import { getAllCategories } from "@/api/categoryActions";
import { Category } from "@/api/data";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loader from "../common/Loader";
import { usePathname } from "next/navigation";
import EquipmentCard from "./EquipmentCard";

interface EquipmentItem {
  id: number;
  title: string;
  image: string;
}

const equipmentData: EquipmentItem[] = [
  {
    id: 1,
    title: "Wheel Loaders",
    image: '/assets/images/equipment.png',
  },
  {
    id: 2,
    title: "Wheel Excavators",
    image: '/assets/images/equipment.png',
  },
  {
    id: 3,
    title: "Track Excavators",
    image: '/assets/images/equipment.png',
  },
  {
    id: 4,
    title: "Telehandlers",
    image: '/assets/images/equipment.png',
  },
  {
    id: 5,
    title: "Skid Steer Loaders",
    image: '/assets/images/equipment.png',
  },
  {
    id: 6,
    title: "Rollers",
    image: '/assets/images/equipment.png',
  },
];


function Equipment() {
const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
const [isNavigating, setIsNavigating] = useState(false);
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
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();

        if (res?.success) {
          setCategories(res.data);
        }
      } catch (e) {
        // ❌ error silently ignore (no UI)
      }finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

 if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <>
    {isNavigating && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
    <Loader />
  </div>
)}
    { !categories.length  ?   <section className="pt-[60px] lg:pt-[110px]"></section> : 
    
    <section className="section-space">
       <div className="container-custom">
        <div className="mx-auto text-center">
          <span className="inline-flex rounded-full bg-[#F2671C] px-5 py-[10px] text-base font-semibold leading-[16px] text-white">
            Our Equipment
          </span>

          <h2 className="mt-[30px] text-[30px] font-bold leading-[36px] text-[#22201C] sm:text-[36px] sm:leading-[40px] lg:text-[42px] lg:leading-[42px]">
            Our Main <span className="text-primary">Equipment</span>
          </h2>

          <p className="mx-auto mt-[15px] mb-10 text-center text-base font-medium leading-[26px] text-[#4E4D49]">
            Browse through top categories to find what fits your business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((item) => {
            const categorySlug = slugify(item.category_name);

            return (
              <Link
                key={item.id}
                href={`/inventory?category=${categorySlug}`}
                onClick={() => setIsNavigating(true)}
                className="block"
              >
                <EquipmentCard
                  image={item.image_url}
                  title={item.category_name}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
    }
    </>
  );
}

export default Equipment;
