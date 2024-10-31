"use client";

import { ReactNode, useState } from "react";

import SideDrawer from "../organisms/side-drawer";
import AppBrand from "../molecules/app-brand";
import Bars from "../atoms/icons/bars";
import Backdrop from "../atoms/back-drop";

type DashboardInteractivityProps = {
  children: ReactNode
};

export default function DashboardInteractivity({ children }: DashboardInteractivityProps) {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      {showDrawer && (
        <Backdrop 
          onClick={() => setShowDrawer(false)} />
      )}
      <SideDrawer 
        state={showDrawer}
        onHide={() => setShowDrawer(false)} />

      <section className="flex-grow overflow-y-auto">
        <header className="flex justify-between py-3 px-4 lg:hidden">
          <AppBrand />
          <button 
            className="w-12 h-10 flex rounded-md items-center justify-center hover:bg-gray-200"
            onClick={() => setShowDrawer(true)}>
            <Bars/>
          </button>
        </header>

        { children }
      </section>
    </>
  );
}