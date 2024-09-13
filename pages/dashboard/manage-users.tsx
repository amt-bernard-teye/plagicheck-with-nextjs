import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";

import Dashboard from "@/components/layouts/dashboard/dashboard";
import PageHeader from "@/components/organisms/page-header/page-header";
import Modal from "@/components/organisms/modal/modal";
import LecturerForm from "@/components/organisms/lecturer-form/lecturer-form";
import StudentForm from "@/components/organisms/student-form/student-form";
import { UserTabs } from "@/lib/enums/user-tab";
import UserDetails from "@/components/organisms/user-details/user-details";
import BulkUpload from "@/components/organisms/bulk-upload/bulk-upload";

export default function ManageUsers() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showBulkPane, setShowBulkPane] = useState(false);
  
  function setActiveTab(tab: UserTabs) {
    const params = new URLSearchParams();
    params.set("tab", tab);
    router.replace(`${router.pathname}?${params.toString()}`);
  }
  
  
  function toggleBulkPane() {
    setShowBulkPane(showBulkPane => !showBulkPane);
  }
  
  
  let browserTab = router.query["tab"] as string || "";
  let activeTab = ["lecturer", "student"].includes(browserTab) ? browserTab : UserTabs.LECTURER;
  let modalHeading = activeTab === UserTabs.LECTURER ? "Add Lecturer" : "Add Student";
  let form = activeTab === UserTabs.LECTURER ? <LecturerForm /> : <StudentForm /> ;

  return (
    <>
      <Head>
        <title>Plagiarism Checker | Manage Users</title>
        <meta name="description" content="Plagiarism Checker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Head>
      <Dashboard>
        <PageHeader />
        {!showBulkPane ? (
          <UserDetails 
            activeTab={activeTab as UserTabs}
            onToggleModal={() => setShowModal(!showModal)}
            onSetActiveTab={setActiveTab}
            onNavigateToBulk={toggleBulkPane}/>
        ) : (
          <BulkUpload
            entity={activeTab === UserTabs.LECTURER ? 'Lecturers' : 'Students'}
            onReturn={toggleBulkPane} />
        )}
        

        {showModal && (
          <Modal 
            title={modalHeading} 
            onToggle={() => {
              setShowModal(showModal => !showModal);
            }}>
            { form }
          </Modal>
        )}
      </Dashboard>
    </>
  );
}