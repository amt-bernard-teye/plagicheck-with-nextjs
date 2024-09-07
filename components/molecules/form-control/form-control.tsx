import { ComponentPropsWithoutRef, ReactNode } from "react";

import styles from "./form-control.module.css";

type FormControl = {
  leftIcon?: ReactNode
  children?: ReactNode,
  hasError?: boolean;
} & ComponentPropsWithoutRef<"input">;

export default function FormControl({hasError, leftIcon, children, ...props}: FormControl) {
  return (
    <div className={`${styles.formControl} ${hasError && styles.inputError}`}>
      {leftIcon}
      <input {...props}/>
      { children }
    </div>
  );
}