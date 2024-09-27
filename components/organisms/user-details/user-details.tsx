import { useState } from "react";

import { Lecturer } from "@/lib/types/lecturer.type";
import DataTable from "../datatable/datatable";
import UserDetailsHeader, { UserDetailsHeaderProps } from "./user-details-header";
import DataTableActions from "@/components/molecules/datatable-actions/datatable-actions";
import { UserTabs } from "@/lib/enums/user-tab";
import Modal from "../modal/modal";
import LecturerForm from "../lecturer-form/lecturer-form";
import StudentForm from "../student-form/student-form";
import UserInfo from "@/components/molecules/user-info/user-info";
import { Department } from "@/lib/types/department.type";
import { AlertVariant } from "@/lib/enums/alert-variant";
import Paginator from "@/components/molecules/paginator/paginator";
import { Student } from "@/lib/types/student.type";


type UserDetailsProps = {
  lecturers: Lecturer[];
  lecturerRowCount: number;
  departments: Department[];
  students: Student[];
  studentRowCount: number;
  onSetAlert: (message: string, status: AlertVariant) => void;
  onAddLecturer: (value: Lecturer) => void;
  onEditLecturer: (value: Lecturer) => void;
  onResetLecturers: (values: Lecturer[]) => void;
  onAddStudent: (value: Student) => void;
  onEditStudent: (value: Student) => void;
} & UserDetailsHeaderProps;


export default function UserDetails(
  {
    activeTab, departments, 
    lecturers, lecturerRowCount, onAddLecturer, onEditLecturer,
    students, studentRowCount, onAddStudent, onEditStudent,
    onSetAlert, onResetLecturers, onToggleModal, onSetActiveTab, onNavigateToBulk,
  }: UserDetailsProps
) {
  const [showModal, setShowModal] = useState(false);
  const [userAction, setUserAction] = useState<"EDIT" | "DELETE">("EDIT");
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer>();
  const [selectedStudent, setSelectedStudent] = useState<Student>();


  function handleUserAction(action: "EDIT" | "DELETE") {
    setUserAction(action);
    setShowModal(prevState => !prevState);
  }

  function handleEditItem(value: Lecturer) {
    onEditLecturer(value);
    setShowModal(false);
  }


  let lecturerColumnHeadings = ["Name", "Lecturer ID", "Email Address", "Phone Number", "Department", "Qualification", ""];
  let studentColumnHeadings = ["Name", "Lecturer ID", "Email Address", "Phone Number", "Department", ""];
  let entity = UserTabs.LECTURER === activeTab ? "Lecturer" : "Student";
  let action = userAction === "EDIT" ? "Edit" : "Delete";
  let heading = `${action} ${entity}`;

  let form = activeTab === UserTabs.LECTURER ? (
      <LecturerForm 
        action={userAction}
        departments={departments}
        selectedItem={selectedLecturer}
        onSetAlert={onSetAlert}
        onResetLecturers={onResetLecturers}
        onEditItem={handleEditItem}
        onAddItem={onAddLecturer} 
      />
    ): (
      <StudentForm
        departments={departments}
        selectedItem={selectedStudent}
        onAddItem={onAddStudent}
        onSetAlert={onSetAlert} 
      />
    );


  return (
    <>
      <UserDetailsHeader 
        activeTab={activeTab} 
        onToggleModal={onToggleModal}
        onSetActiveTab={onSetActiveTab}
        onNavigateToBulk={onNavigateToBulk} />
      
      <div className="section-padding">
        {activeTab === UserTabs.LECTURER ? (
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
                      <button onClick={() => {
                        handleUserAction("EDIT");
                        setSelectedLecturer(lecturer);
                      }}>Edit Lecturer</button>
                      <button onClick={() => {
                        handleUserAction("DELETE");
                        setSelectedLecturer(lecturer);
                      }}>Delete Lecturer</button>
                    </DataTableActions>
                  </td>
                </tr>
              ))}
            </DataTable>
            <Paginator totalRows={lecturerRowCount} />
          </>
        ) : (
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
                      <button onClick={() => {
                        handleUserAction("EDIT");
                        setSelectedStudent(student);
                      }}>Edit Lecturer</button>
                      <button onClick={() => {
                        handleUserAction("DELETE");
                        setSelectedStudent(student);
                      }}>Delete Lecturer</button>
                    </DataTableActions>
                  </td>
                </tr>
              ))}
            </DataTable>
            <Paginator totalRows={studentRowCount} />
          </>
        )}
      </div>

      {showModal && (
        <Modal 
          title={heading} 
          onToggle={() => {
            setShowModal(showModal => !showModal);
          }}>
          { form }
        </Modal>
      )}
    </>
  )
} 