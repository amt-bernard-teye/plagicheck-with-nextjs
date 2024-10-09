import { ComponentPropsWithoutRef, ReactNode } from "react";

type FormControlProps = {
  leftIcon?: ReactNode
  children?: ReactNode;
} & ComponentPropsWithoutRef<"input">;

export default function FormControl({leftIcon, children, ...props}: FormControlProps) {
  return (
    <div className="flex items-center gap-2 border border-[#a6a6ab] rounded-lg px-4">
      { leftIcon }
      <input {...props} className="py-[10px] outline-none flex-grow"/>
      { children }
    </div>
  );
}