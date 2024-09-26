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
import { checkAuthUser } from "@/lib/utils/check-auth-user";
import { getQueryAndPage } from "@/lib/utils/get-query-page-form";
import { LecturerRepository } from "@/lib/repository/lecturer.repository";
import { Lecturer } from "@/lib/types/lecturer.type";
import { DepartmentRepository } from "@/lib/repository/department.repository";
import { Department } from "@/lib/types/department.type";
import Alert from "@/components/molecules/alert/alert";
import { useAlert } from "@/lib/hooks/useAlert";
import { AlertVariant } from "@/lib/enums/alert-variant";


export async function getServerSideProps(context: any) {
  checkAuthUser(context);

  const values = getQueryAndPage(context.query);
  const lecturerRepo = new LecturerRepository();
  const departmentRepo = new DepartmentRepository();

  try {
    const [lecturers, count, departments] = await Promise.all([
      lecturerRepo.paginate(values.query, values.page),
      lecturerRepo.count(values.query),
      departmentRepo.findAll()
    ]);

    return {
      props: {
        lecturers,
        departments,
        count,
      }
    }
  }
  catch(error) {
    return {
      notFound: true
    }
  }
}


type ManageUsersProp = {
  lecturers: Lecturer[];
  departments: Department[];
  count: number;
}


export default function ManageUsers({lecturers: data, count, departments}: ManageUsersProp) {
  const router = useRouter();
  const { alertDetails, handleAlertDetails } = useAlert();
  const [showModal, setShowModal] = useState(false);
  const [showBulkPane, setShowBulkPane] = useState(false);
  const [lecturers, setLecturers] = useState<Lecturer[]>(data);
  

  function setActiveTab(tab: UserTabs) {
    const params = new URLSearchParams();
    params.set("tab", tab);
    router.replace(`${router.pathname}?${params.toString()}`);
  }
  
  
  function toggleBulkPane() {
    setShowBulkPane(showBulkPane => !showBulkPane);
  }


  function handleAddLecturers(value: Lecturer) {
    const newLecturers = [
      value,
      ...lecturers
    ];
    
    if (lecturers.length > 9) {
      newLecturers.pop();
    }

    setLecturers(newLecturers);
  }


  function handleEditLecturers(lecturer: Lecturer) {
    const lecturerIndex = lecturers.findIndex(lect => lect.user.id === lecturer.user.id);

    if (lecturerIndex === -1) {
      return;
    }

    const updatedLecturers = [...lecturers];
    updatedLecturers.splice(lecturerIndex, 1, lecturer);
    setLecturers(updatedLecturers);
  }


  function resetLecturersAsDelete(lecturers: Lecturer[]) {
    setLecturers(lecturers);
  }
  
  
  let browserTab = router.query["tab"] as string || "";
  let activeTab = ["lecturer", "student"].includes(browserTab) ? browserTab : UserTabs.LECTURER;
  let modalHeading = activeTab === UserTabs.LECTURER ? "Add Lecturer" : "Add Student";
  let form = activeTab === UserTabs.LECTURER ? (
      <LecturerForm 
        action="ADD" 
        departments={departments}
        onSetAlert={handleAlertDetails}
        onAddItem={handleAddLecturers} />
    ) : <StudentForm />;

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
            lecturers={lecturers}
            rows={count}
            departments={departments}
            activeTab={activeTab as UserTabs}
            onToggleModal={() => setShowModal(!showModal)}
            onSetActiveTab={setActiveTab}
            onSetAlert={handleAlertDetails}
            onAddItem={handleAddLecturers}
            onEditItem={handleEditLecturers}
            onResetLecturers={resetLecturersAsDelete}
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

      {alertDetails.message && (
        <Alert 
          details={alertDetails}
          onToggle={() => handleAlertDetails(alertDetails.message, AlertVariant.SUCCESS)}/>
      )}
    </>
  );
}