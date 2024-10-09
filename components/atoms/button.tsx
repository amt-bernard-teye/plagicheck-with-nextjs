import Link from "next/link";
import { ComponentPropsWithoutRef, ReactNode } from "react";

type GeneralProps = {
  el: "button"
  variant: "primary" | "secondary";
}

type AnchorProps = {
  children?: ReactNode
  href: string;
} & GeneralProps;

type ButtonProps = GeneralProps & ComponentPropsWithoutRef<"button">;


export default function Button({el, ...props}: AnchorProps | ButtonProps) {
  // if (el === "a") {
  //   return <Link href={props.href}>{props.children}</Link>
  // } 

  let classes = "py-3 rounded-lg border ";

  if (props.variant === "primary") {
    classes += "bg-[#0267ff] text-white";
  }
  else {
    classes = "";
  }

  return (
    <button className={classes}>{props.children}</button>
  )
}