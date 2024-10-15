"use client";

import { useState } from "react";

import Person from "../atoms/icons/person";
import Lock from "../atoms/icons/lock";
import TrashCan from "../atoms/icons/trash-can";
import PersonalInformation from "../organisms/personal-information";
import ChangePassword from "../organisms/change-password";
import Modal from "../organisms/modal";
import Button from "../atoms/button";
import { deleteAccountAction } from "@/lib/actions/auth.action";

type AccountInteractivityProps = {
  id: string;
  name: string;
}

export default function AccountInteractivity({id, name}: AccountInteractivityProps) {
  const [activeTab, setActiveTab] = useState<"personal" | "password">("personal");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row w-full h-full">
        <div className="flex md:flex-col p-[19px] flex-wrap gap-2 border-b border-b-[#BCBCC0] md:border-b-0 lg:border-r lg:border-r-[#BCBCC0] xl:p-[41px]">
          <button onClick={() => setActiveTab("personal")}
            className={`flex gap-2 items-center py-2 px-3 rounded-md ${activeTab === "personal" ? 'bg-[#CCE1FF] text-[#0267FF] active font-semibold' : 'hover:bg-gray-100'}`}>
            <Person /> My Profile
          </button>
          <button onClick={() => setActiveTab("password")}
            className={`flex gap-2 items-center py-2 px-3 rounded-md ${activeTab === "password" ? 'bg-[#CCE1FF] text-[#0267FF] active font-semibold' : 'hover:bg-gray-100'}`}>
            <Lock /> Password
          </button>
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex gap-2 items-center py-2 px-3 rounded-md text-[#ff0000] btn-delete hover:bg-gray-100">
            <TrashCan /> Delete account
          </button>
        </div>
        
        <div className="flex-grow p-[19px] xl:p-[41px]">
          {activeTab === "personal" 
            ? <PersonalInformation id={id} name={name} /> 
            : <ChangePassword />
          }
        </div>
      </div>

      {showLogoutModal && (
        <Modal title="Delete Account" onToggle={() => setShowLogoutModal(false)}>
          <p className="mb-4">Please note that deleting your account is an irreversible action. Take a moment to consider the consequences before proceeding with your decision.</p>
          <div className="flex gap-4">
            <div className="basis-[50%] flex flex-col">
              <Button el="button" variant="secondary" type="button"
                onClick={() => setShowLogoutModal(false)}>No</Button>
            </div>
            <div className="basis-[50%] flex flex-col">
              <Button el="button" variant="danger" type="submit" onClick={async () => await deleteAccountAction()}>Yes</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}