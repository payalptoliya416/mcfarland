import BiddingList from "@/adminpanel/BiddingList";
import React, { Suspense } from "react";

function page() {
  return (
    <Suspense fallback={null}>
      <BiddingList />
    </Suspense>
  );
}

export default page;
