import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

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
import { StudentRepository } from "@/lib/repository/student.repository";
import { Student } from "@/lib/types/student.type";


export async function getServerSideProps(context: any) {
  checkAuthUser(context);

  const values = getQueryAndPage(context.query);
  const lecturerRepo = new LecturerRepository();
  const departmentRepo = new DepartmentRepository();
  const studentRepo = new StudentRepository();

  try {
    const [lecturers, lecturerRowCount, departments, students, studentRowCount] = await Promise.all([
      lecturerRepo.paginate(values.query, values.page),
      lecturerRepo.count(values.query),
      departmentRepo.findAll(),
      studentRepo.paginate(values.query, values.page),
      studentRepo.count(values.query)
    ]);

    return {
      props: {
        lecturers,
        lecturerRowCount,
        departments,
        students,
        studentRowCount
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
  lecturerRowCount: number;
  students: Student[];
  studentRowCount: number;
}


export default function ManageUsers(
  {lecturers: lecturersData, lecturerRowCount, departments, students: studentsData, studentRowCount}: ManageUsersProp
) {
  const router = useRouter();
  const { alertDetails, handleAlertDetails } = useAlert();
  const [showModal, setShowModal] = useState(false);
  const [showBulkPane, setShowBulkPane] = useState(false);
  const [lecturers, setLecturers] = useState<Lecturer[]>(lecturersData);
  const [students, setStudents] = useState<Student[]>(studentsData);

  
  useEffect(() => {
    setLecturers(lecturersData);
    setStudents(studentsData);
  }, [lecturersData, studentsData]);
  

  function setActiveTab(tab: UserTabs) {
    const params = new URLSearchParams();
    params.set("tab", tab);
    router.replace(`${router.pathname}?${params.toString()}`);
  }
  
  
  function toggleBulkPane() {
    setShowBulkPane(showBulkPane => !showBulkPane);
  }


  function handleAddLecturer(value: Lecturer) {
    const newLecturers = [
      value,
      ...lecturers
    ];
    
    if (lecturers.length > 9) {
      newLecturers.pop();
    }

    setStudents(newLecturers);
  }


  function handleEditLecturer(lecturer: Lecturer) {
    const lecturerIndex = lecturers.findIndex(lect => lect.user.id === lecturer.user.id);

    if (lecturerIndex === -1) {
      return;
    }

    const updatedLecturers = [...lecturers];
    updatedLecturers.splice(lecturerIndex, 1, lecturer);
    setLecturers(updatedLecturers);
  }


  function handleAddStudent(value: Student) {
    let newStudents = [
      value,
      ...students
    ];

    if (students.length > 9) {
      students.pop();
    }

    setStudents(newStudents);
  }


  function handleEditStudent(value: Student) {
    const studentIndex = students.findIndex(stud => stud.user.id === value.user.id);

    if (studentIndex === -1) {
      return;
    }

    const updatedStudents = [...students];
    updatedStudents.splice(studentIndex, 1, value);
    setStudents(updatedStudents);
  }


  function resetLecturersAfterSingleDelete(lecturers: Lecturer[]) {
    setLecturers(lecturers);
  }


  function resetStudentsAfterSingleDelete(students: Student[]) {
    setStudents(students);
  }


  function handleSearch(value: string) {
    const currentTab = router.query.tab as string;
    const params = new URLSearchParams();
    params.set("tab", currentTab);
    
    if (value) {
      params.set("q", value);
    }

    router.replace(`${router.pathname}?${params.toString()}`);
  }
  
  
  let browserTab = router.query["tab"] as string || "";
  let activeTab = ["lecturer", "student"].includes(browserTab) ? browserTab : UserTabs.LECTURER;
  let modalHeading = activeTab === UserTabs.LECTURER ? "Add Lecturer" : "Add Student";
  let form = activeTab === UserTabs.LECTURER ? (
      <LecturerForm 
        action="ADD" 
        departments={departments}
        onSetAlert={handleAlertDetails}
        onAddItem={handleAddLecturer} />
    ) : (
      <StudentForm 
        departments={departments}
        onAddItem={handleAddStudent}
        onSetAlert={handleAlertDetails}/>
    );

  return (
    <>
      <Head>
        <title>Plagiarism Checker | Manage Users</title>
        <meta name="description" content="Plagiarism Checker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Head>
      <Dashboard>
        <PageHeader onSearch={handleSearch} />
        {!showBulkPane ? (
          <UserDetails 
            lecturers={lecturers}
            lecturerRowCount={lecturerRowCount}
            departments={departments}
            students={students}
            studentRowCount={studentRowCount}
            activeTab={activeTab as UserTabs}
            onToggleModal={() => setShowModal(!showModal)}
            onSetActiveTab={setActiveTab}
            onSetAlert={handleAlertDetails}
            onAddLecturer={handleAddLecturer}
            onEditLecturer={handleEditLecturer}
            onResetLecturers={resetLecturersAfterSingleDelete}
            onAddStudent={handleAddStudent}
            onEditStudent={handleEditStudent}
            onResetStudents={resetStudentsAfterSingleDelete}
            onNavigateToBulk={toggleBulkPane}/>
        ) : (
          <BulkUpload
            entity={activeTab === UserTabs.LECTURER ? 'Lecturers' : 'Students'}
            onSetAlert={handleAlertDetails}
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