import { ComponentPropsWithoutRef, ReactNode } from "react";

type FormGroupProps = {
  children: ReactNode;
} & ComponentPropsWithoutRef<"div">

export default function FormGroup({children, ...props}: FormGroupProps) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    }} {...props}>
      { children }
    </div>
  );
}