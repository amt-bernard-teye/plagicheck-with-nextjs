import { ComponentPropsWithoutRef, ReactNode } from "react";
import ExclamationDanger from "./icons/exclamation-danger";

type FormControlProps = {
  leftIcon?: ReactNode
  children?: ReactNode;
  hasError?: boolean;
} & ComponentPropsWithoutRef<"input">;

export default function FormControl({leftIcon, children, hasError, ...props}: FormControlProps) {
  return (
    <div className={`flex items-center gap-2 border border-[#a6a6ab] rounded-lg px-4 ${hasError && 'border-[#ff0000]'}`}>
      { leftIcon }
      <input {...props} className="py-[10px] outline-none flex-grow"/>
      {hasError && <ExclamationDanger />}
      { children }
    </div>
  );
}