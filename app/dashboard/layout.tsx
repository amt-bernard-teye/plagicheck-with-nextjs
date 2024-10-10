import { ReactNode } from "react";

import "@/app/globals.css";
import SideDrawer from "@/components/organisms/side-drawer";
import AppBrand from "@/components/molecules/app-brand";
import Bars from "@/components/atoms/icons/bars";

export default function DashboardLayout(
  {children}: {
    children: ReactNode
  }
) {
  return (
    <main className="w-[100%] h-[100vh] lg:flex">
      <SideDrawer/>

      {/* <header>
        <AppBrand />
        <button>
          <Bars/>
        </button>
      </header> */}

      <section className="flex-grow">
        { children }
      </section>
    </main>
  );
}