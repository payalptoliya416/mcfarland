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
    { !categories.length  ?   <section className="section-bottom">
        {/* <div className="container-custom">
          <div className="mx-auto text-center">
            <span className="inline-flex rounded-full bg-[#F2671C] text-white px-5 py-[10px] text-base !leading-[16px] font-semibold text-primary">
              Our Equipment
            </span>
            <h2 className="mt-[30px] text-[30px] font-bold leading-[36px] text-[#22201C] sm:text-[36px] sm:leading-[40px] lg:text-[42px] lg:leading-[42px]">
              Our Main <span className="text-primary">Equipment</span>
            </h2>

            <p className="mx-auto mt-[15px] text-center text-base font-medium leading-[26px] text-[#4E4D49] mb-10">
              Browse through top categories to find what fits your business
              needs.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {equipmentData.map((item) => (
                  <EquipmentCard
                    key={item.id}
                    image={item.image}
                    title={item.title}
                  />
                ))}
          </div>
        </div> */}
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
      </section> : 
    
    <section className="section-bottom">
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
    
    // <section className="container-custom mx-auto my-20 lg:my-[110px]">
    //   <div
    //   className="text-center mb-10">
    //     <h2 className="text-3xl md:text-[38px] md:leading-[38px] mb-[15px] font-bold text-gray mont-text">
    //       Our Main <span className="text-orange">Equipment</span>
    //     </h2>
    //     <p className="text-base leading-[16px] text-text-gray">
    //       Browse through top categories to find what fits your business needs.
    //     </p>
    //   </div>
    //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[30px]">
    //       { 
    //       categories.map((item) =>{
    //           const categorySlug = slugify(item.category_name);
    //         return  (
    //           <div
    //             key={item.id}
    //             className="bg-lightyellow p-[15px] rounded-xl cursor-pointer "
    //           >
    //             <Link href={`/inventory?category=${categorySlug}`} className="flex flex-col justify-between h-full" onClick={() => setIsNavigating(true)}>
    //            <div className="rounded-xl overflow-hidden flex justify-center">
                 
    //               <img
    //                 src={item.image_url}
    //                 alt={item.category_name}
    //                 className="rounded-xl"
    //               />
    //             </div>
    //               <div className="pt-5">
    //                 <h3 className="text-xl leading-[20px] mb-[15px] text-gray text-center font-semibold mont-text">
    //                   {item.category_name}
    //                 </h3>
    //                 <p className="text-base leading-[16px] text-[#4B4A48] text-center font-semibold pb-[5px]">
    //                   Browse Inventory
    //                 </p>
    //               </div>
    //             </Link>
    //           </div>
    //         )
    //       })
    //        }
    //   </div>

    // </section>
    }
    </>
  );
}

export default Equipment;
