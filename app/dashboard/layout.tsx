import { ReactNode } from "react";

import "@/app/globals.css";
import DashboardInteractivity from "@/components/templates/dashboard-interactivity";

export default function DashboardLayout(
  {children}: {
    children: ReactNode
  }
) {
  return (
    <main className="w-[100%] h-[100vh] lg:flex">
      <DashboardInteractivity>
        { children }
      </DashboardInteractivity>
    </main>
  );
}