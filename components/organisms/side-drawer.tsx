"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoDatabase } from "react-icons/go";

import AppBrand from "../molecules/app-brand";
import GridBoxes from "../atoms/icons/grid-boxes";
import Search from "../atoms/icons/search";
import Clock from "../atoms/icons/clock";
import ClockHistory from "../atoms/icons/clock-history";
import OpenBook from "../atoms/icons/open-book";
import UserGroup from "../atoms/icons/user-group";
import BoxArrowLeft from "../atoms/icons/box-arrow-left";
import Gear from "../atoms/icons/gear";
import Checker from "../atoms/icons/checker";
import Modal from "./modal";
import Button from "../atoms/button";
import { logoutAction } from "@/lib/actions/auth.action";

type SideDrawerProps = {
  state: boolean;
  onHide: () => void;
}

export default function SideDrawer({ state, onHide }: SideDrawerProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [ showDropDown, setShowDropDown] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <aside 
        className={`fixed top-0 left-0 overflow-x-hidden md:w-[270px] h-[100vh] lg:static lg:basis-[270px] lg:h-auto bg-[#e9e9ea] border border-r-[#bcbcc0] overflow-y-auto py-8 xl:py-16
          ${state ? 'w-[70%] z-10' : 'w-0'} transition-[width]`}>
      <div className="flex justify-center">
        <AppBrand />
      </div>
      {/* <div>
        <UserProfile />
      </div> */}
      <div className="px-4 flex flex-col gap-4 mt-8 md:mt-14">
        <Link href="/dashboard" 
          className={`link flex items-center gap-2 py-2 px-3 rounded-md 
            ${pathname === "/dashboard" ? 'bg-[#0267ff] text-white link-active-f' : 'hover:bg-gray-100'}`}
          onClick={onHide}>
          <GridBoxes/> Dashboard
        </Link>
        <div className="flex flex-col ">
          <button className="link flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md"
            onClick={() => setShowDropDown(!showDropDown)} type="button">
            <Checker/> Plagiarism Checker
          </button>
          <div className={`ps-8 h-0 overflow-hidden transition-all space-y-1 ${showDropDown && 'h-[104px] mt-1'}`}>
            <Link href="/dashboard/plagiarism-checker" 
              className={`link flex items-center gap-2 py-1 px-2  rounded-md 
                ${pathname === "/dashboard/plagiarism-checker" ? 'bg-[#0267ff] text-white link-active' : 'hover:bg-gray-100'}`}
              onClick={onHide}>
              <Search/> Checker
            </Link>
            <Link href="/dashboard/plagiarism-checker/schedules" 
              className={`link flex items-center gap-2 py-1 px-2  rounded-md 
                ${pathname === "/dashboard/plagiarism-checker/schedules" ? 'bg-[#0267ff] text-white link-active' : 'hover:bg-gray-100'}`}
              onClick={onHide}>
              <Clock/> Schedules
            </Link>
            <Link href="/dashboard/plagiarism-checker/history" 
              className={`link flex items-center gap-2 py-1 px-2  rounded-md 
                ${pathname === "/dashboard/plagiarism-checker/history" ? 'bg-[#0267ff] text-white link-active dp-link-active' : 'hover:bg-gray-100'}`}
              onClick={onHide}>
              <ClockHistory/> History
            </Link>
          </div>
        </div>
        <Link href="/dashboard/academic-division" 
          className={`link flex items-center gap-2 py-2 px-3 rounded-md 
            ${pathname === "/dashboard/academic-division" ? 'bg-[#0267ff] text-white link-active' : 'hover:bg-gray-100'}`}
          onClick={onHide}>
          <OpenBook/> Academic Division
        </Link>
        <Link href="/dashboard/archive" 
          className={`link flex items-center gap-2 py-2 px-3 rounded-md 
            ${pathname === "/dashboard/archive" ? 'bg-[#0267ff] text-white link-active' : 'hover:bg-gray-100'}`}
          onClick={onHide}>
          <GoDatabase className="text-2xl"/> Archive
        </Link>
        <Link href="/dashboard/manage-users?tab=lecturer" 
          className={`link flex items-center gap-2 py-2 px-3 rounded-md 
            ${pathname === "/dashboard/manage-users" ? 'bg-[#0267ff] text-white link-active' : 'hover:bg-gray-100'}`}
          onClick={onHide}>
          <UserGroup/> Manage Users
        </Link>
        <Link href="/dashboard/account-settings" 
          className={`link flex items-center gap-2 py-2 px-3 rounded-md 
            ${pathname === "/dashboard/account-settings" ? 'bg-[#0267ff] text-white link-active' : 'hover:bg-gray-100'}`}
          onClick={onHide}>
          <Gear/> Account Settings
        </Link>

        <button
          onClick={() => {
            onHide();
            setShowLogoutModal(true);
          }} 
          className="link flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md text-left mt-14 md:mt-28 2xl:mt-56">
          <BoxArrowLeft/> Logout
        </button>
      </div>
    </aside>

    {showLogoutModal && (
      <Modal 
        title="Logout"
        onToggle={() => setShowLogoutModal(false)}>
        <form action={logoutAction}>
          <p className="mb-4">Are you sure you want to log out? By logging out, you will be securely logged out of the system and your session will be ended.</p>
          <div className="flex gap-4">
            <div className="basis-[50%] flex flex-col">
              <Button el="button" variant="secondary" type="button"
                onClick={() => setShowLogoutModal(false)}>No</Button>
            </div>
            <div className="basis-[50%] flex flex-col">
              <Button el="button" variant="danger" type="submit">Yes</Button>
            </div>
          </div>
        </form>
      </Modal>
    )}
    </>
  );
}