import { PropsWithChildren } from "react";

import styles from "./Auth.module.css";
import { archivo } from "@/lib/utils/font";
import AppLogo from "@/components/molecules/app-logo/app-logo";

type AuthProps = PropsWithChildren<{
  title: string;
  description: string;
}>;

export default function Auth({children, title, description}: AuthProps) {
  return (
    <main className={`${styles.main} ${archivo.className}`}>
      <div className={styles.container}>
        <AppLogo />
        <div>
          <h4 className={styles.mainHeading}>{title}</h4>
          <p className={styles.mainDescription}>{description}</p>
        </div>
        { children }
      </div>
    </main>
  );
}