import { PropsWithChildren } from "react";
import styles from "./sub-header.module.css";

type SubHeaderProps = PropsWithChildren<{
  title: string;
  description: string;
}>;

export default function SubHeader({title, description, children}: SubHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.headerDetails}>
        <h4 className={styles.headerTitle}>{title}</h4>
        <p>{description}</p>
      </div>
      { children }
    </div>
  );
}