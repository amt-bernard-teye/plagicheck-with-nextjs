import { ReactNode } from "react";

import DashboardInteractivity from "@/components/templates/dashboard-interactivity";
import "@/app/globals.css";

export default function DashboardLayout(
  {children}: {
    children: ReactNode
  }
) {
  return (
    <main className="w-[100%] h-[100vh] lg:flex overflow-auto md:overflow-hidden">
      <DashboardInteractivity>
        { children }
      </DashboardInteractivity>
    </main>
  );
}