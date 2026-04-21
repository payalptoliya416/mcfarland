"use client";

import Loader from "@/components/common/Loader";
import InventoryDetail from "@/components/inventory/InventoryDetail";
import { Suspense } from "react";

function Inventry() {
  return (
    <>
      <Suspense
        fallback={
          <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <Loader />
          </div>
        }
      >
        <InventoryDetail />
      </Suspense>
    </>
  );
}

export default Inventry;
