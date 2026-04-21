import { Suspense } from "react";
import AddCategoryClient from "@/adminpanel/AddCatgegoryClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AddCategoryClient />
    </Suspense>
  );
}
