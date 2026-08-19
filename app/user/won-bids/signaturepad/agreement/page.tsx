import SignaturePadAgreement from "@/adminpanel/SignaturePadAgreement";
import Loader from "@/components/common/Loader";
import { Suspense } from "react";

function SignaturePad() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
          <Loader />
        </div> } >
      <SignaturePadAgreement />
    </Suspense>
  );
}

export default SignaturePad;
