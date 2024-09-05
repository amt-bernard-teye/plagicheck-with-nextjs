import { ComponentPropsWithoutRef, ReactNode } from "react";

type LabelProps = {
  children?: ReactNode
} & ComponentPropsWithoutRef<"label">;

export default function Label({children, ...props}: LabelProps) {
  let labelStyle = {
    fontSize: "0.875em"
  };

  return <label htmlFor={props.htmlFor} style={labelStyle}>{children}</label>;
}