"use client";

import { useState, useEffect } from "react";

import Modal from "../modal";
import ContentWrapper from "@/components/atoms/content-wrapper";
import DataTable from "@/components/molecules/data-table/data-table";
import UserDetailsHeader from "./user-details-header";
import { UserTabs } from "@/lib/enum/user-tab.enum";
import { FormAction } from "@/lib/enum/form-action";
import { getUsersModalHeading } from "./user-details.util";
import { Department } from "@/lib/types/department.type";
import LecturerForm from "../form/lecturer-form";
import StudentForm from "../form/student-form";
import { Lecturer } from "@/lib/types/lecturer.type";
import { Student } from "@/lib/types/student.type";
import { AlertResponse } from "@/lib/types/alert-response.type";
import Alert from "@/components/molecules/alert";
import { FormSubmissionState } from "@/lib/enum/form-submission-state.enum";
import { StatusCode } from "@/lib/enum/status-code";
import UserInfo from "@/components/molecules/user-info";
import DataTableActions from "@/components/molecules/data-table/data-table-action";
import Paginator from "@/components/molecules/paginator";
import { DataTableActionButton } from "@/components/molecules/data-table/data-table-action-button";

type UserDetailsProps = {
  activeTab: UserTabs;
  departments: Department[];
  paginatedLecturers: Lecturer[];
  lecturerCount: number;
  paginatedStudents: Student[];
  studentCount: number;
  onNavigateToBulkPane: () => void;
  onSetActiveTab: (tab: UserTabs) => void;
}

export default function UserDetails(
  {departments, activeTab, paginatedLecturers, lecturerCount, paginatedStudents, studentCount, onNavigateToBulkPane, onSetActiveTab}: UserDetailsProps
) {
  const [showModal, setShowModal] = useState(false);
  const [formAction, setFormAction] = useState<FormAction>(FormAction.ADD);
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer>();
  const [selectedStudent, setSelectedStudent] = useState<Student>();
  const [alertResponse, setAlertResponse] = useState<AlertResponse>();
  const [formSubmissionState, setFormSubmissionState] = useState<FormSubmissionState>(FormSubmissionState.PENDING);
  const [lecturers, setLecturers] = useState<Lecturer[]>(paginatedLecturers);
  const [students, setStudents] = useState<Student[]>(paginatedStudents);


  useEffect(() => {
    if (paginatedLecturers) {
      setLecturers(paginatedLecturers);
    }
  }, [paginatedLecturers]);
  

  function handleAddModal() {
    setShowModal(true);
    setFormAction(FormAction.ADD);
    setSelectedLecturer(undefined);
    setSelectedStudent(undefined);
  }


  function handleFormActionAndModalShow(action: FormAction) {
    setFormAction(action);
    setShowModal(true);
  }


  function handleSaveLecturer(lecturer: Lecturer) {
    if (selectedLecturer) {
      const existingLecturers = [...lecturers];
      const lecturerIndex = existingLecturers.findIndex(lect => lect.user.id === lecturer.user.id);
      const deleteCount = 1;
      existingLecturers.splice(lecturerIndex, deleteCount, lecturer);
      setLecturers(existingLecturers);
    }
    else {
      const existingLecturers = [lecturer, ...lecturers];
      if (existingLecturers.length > 9) {
        existingLecturers.pop();
      }
      setLecturers(existingLecturers);
    }
  }


  function handleRemoveLecturer(lecturerId: string) {
    setLecturers(lecturers => lecturers.filter(lect => lect.user.id !== lecturerId));
  }


  function handleSaveStudent(student: Student) {
    if (selectedStudent) {
      const existingStudents = [...students];
      const existingIndex = existingStudents.findIndex(stud => stud.user.id === student.user.id);
      const deleteCount = 1;
      existingStudents.splice(existingIndex, deleteCount, student);
      setStudents(existingStudents);
    }
    else {
      const existingStudents = [student, ...students];
      if (existingStudents.length > 9) {
        existingStudents.pop();
      }
      setStudents(existingStudents);
    }
  }

  
  function handleRemoveStudent(studentId: string) {
    setStudents(students => students.filter(stud => stud.user.id !== studentId));
  }
  

  let lecturerColumnHeadings = ["Name", "Lecturer ID", "Email Address", "Phone Number", "Department", "Qualification", ""];
  let studentColumnHeadings = ["Name", "Student ID", "Email Address", "Phone Number", "Department", ""];
  let modalHeading = getUsersModalHeading(activeTab, formAction);
  let form: JSX.Element;

  if (activeTab === UserTabs.LECTURER) {
    form = <LecturerForm
      onSetAlertResponse={setAlertResponse}
      departments={departments}
      formAction={formAction}
      onSave={handleSaveLecturer}
      selectedItem={selectedLecturer}
      onRemoveLecturer={handleRemoveLecturer}
      onSetFormState={setFormSubmissionState}
      formSubmissionState={formSubmissionState}
      onHideModal={() => setShowModal(false)} />
  }
  else {
    form = <StudentForm
      formSubmissionState={formSubmissionState}
      departments={departments}
      formAction={formAction}
      selectedItem={selectedStudent}
      onSave={handleSaveStudent}
      onSetAlertResponse={setAlertResponse}
      onSetFormState={setFormSubmissionState}
      onHideModal={() => setShowModal(false)}
      onRemoveStudent={handleRemoveStudent} />
  }

  return (
    <>
      <UserDetailsHeader
        activeTab={activeTab}
        onNavigateToBulk={onNavigateToBulkPane}
        onSetActiveTab={onSetActiveTab}
        onToggleModal={handleAddModal}/>

      <ContentWrapper>
        {activeTab === UserTabs.LECTURER 
          ? (
            <>
              <DataTable columnHeadings={lecturerColumnHeadings}>
                {lecturers.map(lecturer => (
                  <tr key={lecturer.user.id}>
                    <td>
                      <UserInfo name={lecturer.user.name} image={lecturer.user.image}/>
                    </td>
                    <td>{lecturer.user.id}</td>
                    <td>{lecturer.user.email}</td>
                    <td>{lecturer.user.phoneNumber}</td>
                    <td>{lecturer.department.name}</td>
                    <td>{lecturer.qualification}</td>
                    <td>
                      <DataTableActions>
                        <DataTableActionButton onClick={() => {
                          handleFormActionAndModalShow(FormAction.EDIT);
                          setSelectedLecturer(lecturer);
                        }}>Edit Lecturer</DataTableActionButton>
                        <DataTableActionButton onClick={() => {
                          handleFormActionAndModalShow(FormAction.DELETE);
                          setSelectedLecturer(lecturer);
                        }}>Delete Lecturer</DataTableActionButton>
                      </DataTableActions>
                    </td>
                  </tr>
                ))}
              </DataTable>
              <Paginator totalRows={lecturerCount} />
            </>
          )
          : (
            <>
              <DataTable columnHeadings={studentColumnHeadings}>
                {students.map(student => (
                  <tr key={student.user.id}>
                    <td>
                      <UserInfo name={student.user.name} image={student.user.image}/>
                    </td>
                    <td>{student.user.id}</td>
                    <td>{student.user.email}</td>
                    <td>{student.user.phoneNumber}</td>
                    <td>{student.department.name}</td>
                    <td>
                      <DataTableActions>
                        <DataTableActionButton onClick={() => {
                          handleFormActionAndModalShow(FormAction.EDIT);
                          setSelectedStudent(student);
                        }}>Edit Student</DataTableActionButton>
                        <DataTableActionButton onClick={() => {
                          handleFormActionAndModalShow(FormAction.DELETE);
                          setSelectedStudent(student);
                        }}>Delete Student</DataTableActionButton>
                      </DataTableActions>
                    </td>
                  </tr>
                ))}
              </DataTable>
              <Paginator totalRows={studentCount} />
            </>
          )}
      </ContentWrapper>

      {showModal && (
        <Modal title={modalHeading} onToggle={() => setShowModal(false)}>
          {form}
        </Modal>
      )}

      {(formSubmissionState === FormSubmissionState.DONE && alertResponse) && (
        <Alert
          message={alertResponse.message}
          variant={alertResponse.status === StatusCode.SUCCESS ? "success" : "error"} />
      )}
    </>
  );
}