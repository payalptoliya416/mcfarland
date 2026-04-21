"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Loader from "@/components/common/Loader";
import InventoryHero from "@/components/inventory/InventoryHero";
import InventoryFilter from "@/components/inventory/InvetoryFilter";
import InventoryDetail from "@/components/inventory/InventoryDetail";

export default function Page() {
    const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const slugCount = segments.length - 1;

  const isDetailPage =
    slugCount === 4 && !isNaN(Number(segments[segments.length - 1]));


  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <Loader />
        </div>
      }
    >
      {isDetailPage ? (
        <InventoryDetail />
      ) : (
        <>
          <InventoryHero />
          <InventoryFilter />
        </>
      )}
    </Suspense>
  );
}
