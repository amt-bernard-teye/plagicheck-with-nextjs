import { ComponentPropsWithoutRef } from "react";

type LabelProps = ComponentPropsWithoutRef<"label">;

export default function Label(props: LabelProps) {
  return (
    <label {...props}>{ props.children }</label>
  );
}