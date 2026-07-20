import BiddingList from "@/adminpanel/BiddingList";
import { Suspense } from "react";

function page() {
  return (
    <Suspense fallback={null}>
      <BiddingList />
    </Suspense>
  );
}

export default page;
