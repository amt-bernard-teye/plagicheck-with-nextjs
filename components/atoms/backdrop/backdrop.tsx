import { ComponentPropsWithoutRef } from "react";

import styles from "./backdrop.module.css";

export default function Backdrop(props: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={styles.backdrop} onClick={props.onClick}></div>
  );
}