import SignaturePadDetail from "@/adminpanel/SignaturePadDetail";
import Loader from "@/components/common/Loader";
import React, { Suspense } from "react";

function SignaturePad() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <Loader />
        </div> } >
      <SignaturePadDetail />
    </Suspense>
  );
}

export default SignaturePad;
