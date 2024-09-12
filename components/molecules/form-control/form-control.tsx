import { ComponentPropsWithoutRef, ReactNode, useRef } from "react";

import styles from "./form-control.module.css";
import ExclamationDanger from "@/components/atoms/icons/exclamation-danger";

type FormControl = {
  leftIcon?: ReactNode
  children?: ReactNode,
  hasError?: boolean;
} & ComponentPropsWithoutRef<"input">;

export default function FormControl({hasError, leftIcon, children, ...props}: FormControl) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`${styles.formControl} ${hasError && styles.inputError}`}
      onClick={() => inputRef.current?.focus()}>
      {leftIcon}
      <input {...props} ref={inputRef}/>
      {hasError && <span><ExclamationDanger /></span>}
      { children }
    </div>
  );
}