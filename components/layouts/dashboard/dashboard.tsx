import { ReactNode, useRef } from "react";

import styles from "./dashboard.module.css";
import { archivo } from "@/lib/utils/font";
import SideDrawer, { SideDrawerHandle } from "@/components/organisms/side-drawer/side-drawer";
import AppLogo from "@/components/molecules/app-logo/app-logo";
import Bars from "@/components/atoms/icons/bars";

type DashboardProps = {
  children: ReactNode;
}

export default function Dashboard({children}: DashboardProps) {
  const drawerRef = useRef<SideDrawerHandle>(null);

  return (
    <main className={`${styles.main} ${archivo.className}`}>
      <SideDrawer ref={drawerRef}/>

      <header className={styles.header}>
        <AppLogo />
        <button className={styles.btn} onClick={() => drawerRef.current?.onToggleDrawer()}>
          <Bars />
        </button>
      </header>

      <section className={styles.content}>
        { children }
      </section>
    </main>
  );
}