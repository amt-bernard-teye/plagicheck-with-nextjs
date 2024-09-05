import { ComponentPropsWithoutRef, ReactNode } from "react";

import styles from "./form-control.module.css";
import SMSTracking from "@/components/atoms/icons/sms-tracking";

type FormControl = {
  leftIcon?: ReactNode
  children?: ReactNode,
} & ComponentPropsWithoutRef<"input">;

export default function FormControl({leftIcon, children, ...props}: FormControl) {

  return (
    <div className={styles.formControl}>
      {leftIcon}
      <input {...props} />
      { children }
    </div>
  );
}