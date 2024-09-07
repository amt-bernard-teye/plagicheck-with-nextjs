import { ComponentPropsWithoutRef } from "react";
import { IoClose } from "react-icons/io5";

import styles from "./close-button.module.css";

export default function CloseButton(props: ComponentPropsWithoutRef<"button">) {
  return (
    <button className={styles.alertBtn} onClick={props.onClick}>
      <IoClose />
    </button>
  );
}