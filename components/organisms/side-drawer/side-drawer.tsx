import Link from "next/link";
import { useState, forwardRef, useImperativeHandle, FormEvent } from "react";
import { GoDatabase } from "react-icons/go";
import { useRouter } from "next/router";

import styles from "./side-drawer.module.css";
import AppLogo from "@/components/molecules/app-logo/app-logo";
import GridBoxes from "@/components/atoms/icons/grid-boxes";
import Checker from "@/components/atoms/icons/checker";
import Search from "@/components/atoms/icons/search";
import Clock from "@/components/atoms/icons/clock";
import OpenBook from "@/components/atoms/icons/open-book";
import UserGroup from "@/components/atoms/icons/user-group";
import BoxArrowLeft from "@/components/atoms/icons/box-arrow-left";
import Gear from "@/components/atoms/icons/gear";
import ClockHistory from "@/components/atoms/icons/clock-history";
import Backdrop from "@/components/atoms/backdrop/backdrop";
import UserProfile from "@/components/molecules/user-profile/user-profile";
import Modal from "../modal/modal";
import Button from "@/components/atoms/button/button";
import { useAlert } from "@/lib/hooks/useAlert";
import { logout } from "@/lib/api/auth";
import { AlertVariant } from "@/lib/enums/alert-variant";
import Alert from "@/components/molecules/alert/alert";

export type SideDrawerHandle = {
  onToggleDrawer: () => void;
}

const SideDrawer = forwardRef<SideDrawerHandle, {}>(({}, ref) => {
  const { alertDetails, handleAlertDetails } = useAlert();
  const router = useRouter();
  const { pathname } = useRouter();
  const [showDropDown, setShowDropDown] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  useImperativeHandle(ref, () => {
    return {
      onToggleDrawer() {
        setShowDrawer(prevState => !prevState);
      }
    }
  });


  async function handleLogout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const result = await logout();
      handleAlertDetails(result.message, AlertVariant.SUCCESS);

      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
    catch(error: any) {
      handleAlertDetails(error.message, AlertVariant.ERROR);
    }
  }


  let hasChecker = pathname.includes("checker");

  return (
    <>
      {showDrawer && <Backdrop onClick={() => setShowDrawer(prevState => !prevState)} />}
      <aside className={`${styles.drawer} ${showDrawer && styles.drawerShow}`}>
        <div className="flex justify-content-center">
          <div className={styles.lgScreen}>
            <AppLogo />
          </div>
          <div className={styles.smScreen}>
            <UserProfile />
          </div>
        </div>
        <div className={styles.drawerNav}>
          <Link href="/dashboard" 
            className={`${styles.drawerLink} ${pathname === "/dashboard" && styles.activeFirst}`}>
            <GridBoxes/> Dashboard
          </Link>
          <div className={`${styles.dropdownContainer}  ${(showDropDown || hasChecker) && styles.dropdownShow}`}>
            <button className={styles.drawerLink} onClick={() => setShowDropDown(prevState => !prevState)}>
              <Checker/> Plagiarism Checker
            </button>
            <div className={styles.dropdown}>
              <Link 
                className={`${styles.drawerLink} ${styles.dropdownItem} 
                  ${pathname === "/dashboard/plagiarism-checker" && styles.dropdownActiveFirst}`} 
                href="/dashboard/plagiarism-checker">
                <Search /> Checker
              </Link>
              <Link 
                className={`${styles.drawerLink} ${styles.dropdownItem} 
                  ${pathname === "/dashboard/plagiarism-checker/schedules" && styles.active}`}
                href="/dashboard/plagiarism-checker/schedules">
                <Clock /> Schedules
              </Link>
              <Link 
                className={`${styles.drawerLink} ${styles.dropdownItem} 
                  ${pathname === "/dashboard/plagiarism-checker/history" && `${styles.dropdownActiveFirst} ${styles.dropdownLastItem}`}`}
                href="/dashboard/plagiarism-checker/history">
                <ClockHistory /> History
              </Link>
            </div>
          </div>
          <Link href="/dashboard/academic-division" 
            className={`${styles.drawerLink} ${pathname === "/dashboard/academic-division" && styles.active}`}>
            <OpenBook/> Academic Division
          </Link>
          <Link href="/dashboard/archive" 
            className={`${styles.drawerLink} ${pathname === "/dashboard/archive" && styles.active}`}>
            <GoDatabase className="fs-24"/> Archive
          </Link>
          <Link href="/dashboard/manage-users?tab=lecturer" 
            className={`${styles.drawerLink} ${pathname === "/dashboard/manage-users" && styles.active}`}>
            <UserGroup/> Manage Users
          </Link>
          <Link href="/dashboard/account-settings" 
            className={`${styles.drawerLink} ${pathname === "/dashboard/account-settings" && styles.active}`}>
            <Gear/> Account Settings
          </Link>

          <button className={`${styles.drawerLink} ${styles.marginTop}`} onClick={() => setShowLogoutModal(prevState => !prevState)}>
            <BoxArrowLeft/> Logout
          </button>
        </div>
      </aside>

      {showLogoutModal && (
        <Modal title="Logout" onToggle={() => setShowLogoutModal(prevState => !prevState)}>
          <form onSubmit={handleLogout}>
            <p className="line-height-24 mb-2">Are you sure you want to log out? By logging out, you will be securely logged out of the system and your session will be ended.</p>
            <div className="flex gap-19 h-44">
              <div className="col-6 flex flex-column">
                <Button variant="secondary" type="button" onClick={() => setShowLogoutModal(prevState => !prevState)}>No</Button>
              </div>
              <div className="col-6 flex flex-column">
                <Button variant="danger" type="submit">Yes</Button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {alertDetails.message && (
        <Alert 
          details={alertDetails}
          onToggle={() => handleAlertDetails("", AlertVariant.SUCCESS)}/>
      )}
    </>
  );
});

export default SideDrawer;