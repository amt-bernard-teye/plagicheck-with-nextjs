import { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import Link from "next/link";

import styles from "./button.module.css";

type ButtonProps = PropsWithChildren<{
  isLink?: boolean;
  variant: "primary" | "secondary" | "danger"
}> & ComponentPropsWithoutRef<"button">;

export default function Button({variant, children, ...props}: ButtonProps) {
  let btnVariant = "";

  if (variant === "primary") {
    btnVariant = styles.btnPrimary;
  } else if (variant === "danger") {
    btnVariant = styles.btnDanger;
  } else {
    btnVariant = styles.btnSecondary;
  }

  return (
    <button 
      className={`${styles.btn} ${btnVariant}`} 
      {...props}>{ children }</button>
  );
}