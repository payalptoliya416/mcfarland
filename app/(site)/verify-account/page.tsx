"use client";
export const dynamic = "force-dynamic";
import VerifyAccount from "@/components/inventory/VerifyAccount";
import { Suspense } from "react";

function VerificationAccount() {
  return (
    <>
      <Suspense fallback={null}>
        <VerifyAccount />
      </Suspense>
    </>
  );
}

export default VerificationAccount;
