'use client'

import { getAllCategories } from "@/api/categoryActions";
import { Category } from "@/api/data";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loader from "../common/Loader";
import { usePathname } from "next/navigation";

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
    { !categories.length  ?  <section className="container-custom mx-auto py-[50px]"></section> : 
    
    <section className="container-custom mx-auto my-20 lg:my-[110px]">
      <div
      className="text-center mb-10">
        <h2 className="text-3xl md:text-[38px] md:leading-[38px] mb-[15px] font-bold text-gray mont-text">
          Our Main <span className="text-orange">Equipment</span>
        </h2>
        <p className="text-base leading-[16px] text-text-gray">
          Browse through top categories to find what fits your business needs.
        </p>
      </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[30px]">
          { 
          categories.map((item) =>{
              const categorySlug = slugify(item.category_name);
            return  (
              <div
                key={item.id}
                className="bg-lightyellow p-[15px] rounded-xl cursor-pointer "
              >
                <Link href={`/inventory?category=${categorySlug}`} className="flex flex-col justify-between h-full" onClick={() => setIsNavigating(true)}>
               <div className="rounded-xl overflow-hidden flex justify-center">
                  {/* <Image
                    src={item.image_url}
                    alt={item.category_name}
                    width={340}
                    height={220}
                    className="w-full h-full object-cover rounded-[12px]"
                  /> */}
                  <img
                    src={item.image_url}
                    alt={item.category_name}
                    className="rounded-xl"
                  />
                </div>
                  <div className="pt-5">
                    <h3 className="text-xl leading-[20px] mb-[15px] text-gray text-center font-semibold mont-text">
                      {item.category_name}
                    </h3>
                    <p className="text-base leading-[16px] text-[#4B4A48] text-center font-semibold pb-[5px]">
                      Browse Inventory
                    </p>
                  </div>
                </Link>
              </div>
            )
          })
           }
      </div>

    </section>
    }
    </>
  );
}

export default Equipment;
