"use client";

import { ComponentPropsWithoutRef } from "react";

export function DataTableActionButton(props: ComponentPropsWithoutRef<"button">) {
  return (
    <button 
      className="text-left hover:text-[#0267ff] hover:font-semibold" 
      {...props}>{props.children}</button>
  );
}