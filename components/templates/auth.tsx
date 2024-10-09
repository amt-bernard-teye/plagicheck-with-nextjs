import { ReactNode } from "react";

import AppBrand from "../molecules/app-brand";

type AuthProps = {
  children: ReactNode
}

export default function Auth({children}: AuthProps) {
  return (
    <main className="bg-[#fafafb] w-[100%] h-[100vh] overflow-auto lg:overflow-hidden flex items-center justify-center">
      <section className="w-[95%] p-4 md:w-[471px]  md:p-8 bg-white shadow-md rounded-2xl space-y-4">
        <AppBrand />
        { children }
      </section>
    </main>
  );
}