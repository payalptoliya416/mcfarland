import UserLicence from "@/adminpanel/UserLicence";
import { Suspense } from "react";

function page() {
  return (
    <Suspense fallback={null}>
      <UserLicence />
    </Suspense>
  );
}

export default page;
