import { ComponentPropsWithoutRef, PropsWithChildren } from "react";

import styles from "./button.module.css";

type ButtonProps = PropsWithChildren<{
  isLink?: boolean;
  variant: "primary" | "secondary"
}> & ComponentPropsWithoutRef<"button">;

export default function Button({isLink, variant, children, ...props}: ButtonProps) {
  let btnVariant = "";

  if (variant === "primary") {
    btnVariant = styles.btnPrimary;
  } else {
    btnVariant = styles.btnSecondary;
  }

  return (
    <button className={`${styles.btn} ${btnVariant}`} {...props}>{ children }</button>
  );
}