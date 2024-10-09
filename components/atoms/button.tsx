"use client";

import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

type GeneralProps = {
  variant: "primary" | "secondary";
}

type AnchorProps = GeneralProps & {
  el: "link"
} & ComponentPropsWithoutRef<"a">;

type ButtonProps = {
  el: "button";
} & GeneralProps & ComponentPropsWithoutRef<"button">;


export default function Button(props: AnchorProps | ButtonProps) {
  let classes = "py-3 rounded-lg flex gap-4 justify-center border disabled:opacity-20 disabled:cursor-not-allowed ";

  if (props.variant === "primary") {
    classes += "bg-[#0267ff] text-white border-[#0267ff] hover:bg-[#67A4FF] hover:border-[#67A4FF] active:bg-[#0252CC] active:border-[#0252CC]";
  }
  else {
    classes += "border-[#a6a6ab] hover:bg-[#E9E9EA] active:bg-[#D2D3D5]";
  }

  if (props.el === "link") {
    return <Link className={classes} {...props} href={props.href!}>{props.children}</Link>
  }

  return (
    <button className={classes} {...props}>{props.children}</button>
  );
}