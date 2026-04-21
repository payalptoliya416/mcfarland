import MyBidDetails from "@/components/user/MyBidDetails";
import Loader from "@/components/common/Loader";
import React, { Suspense } from "react";

function BidDetails() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <Loader />
        </div>}>
      <MyBidDetails />
    </Suspense>
  );
}

export default BidDetails;
