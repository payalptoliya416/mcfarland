import AddMachineClient from "@/adminpanel/AddMachineClient";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AddMachineClient />
    </Suspense>
  );
}
