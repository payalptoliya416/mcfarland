import SignaturePadDetail from "@/adminpanel/SignaturePadDetail";
import Loader from "@/components/common/Loader";
import React, { Suspense } from "react";

function SignaturePad() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
          <Loader />
        </div> } >
      <SignaturePadDetail />
    </Suspense>
  );
}

export default SignaturePad;
