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


type UserDetailsProps = {
  lecturers: Lecturer[];
  rows: number;
  departments: Department[];
  onSetAlert: (message: string, status: AlertVariant) => void;
  onAddItem: (value: Lecturer) => void;
  onEditItem: (value: Lecturer) => void;
  onResetLecturers: (values: Lecturer[]) => void;
} & UserDetailsHeaderProps;


export default function UserDetails(
  {activeTab, onToggleModal, onSetActiveTab, onNavigateToBulk, lecturers, rows, departments, onSetAlert, onAddItem, onEditItem, onResetLecturers}: UserDetailsProps
) {
  const [showModal, setShowModal] = useState(false);
  const [userAction, setUserAction] = useState<"EDIT" | "DELETE">("EDIT");
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer>();


  function handleUserAction(action: "EDIT" | "DELETE") {
    setUserAction(action);
    setShowModal(prevState => !prevState);
  }

  function handleEditItem(value: Lecturer) {
    onEditItem(value);
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
        onAddItem={onAddItem} />
    ): (
      <StudentForm />
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
            <Paginator totalRows={rows} />
          </>
        ) : (
          <DataTable columnHeadings={studentColumnHeadings}>
            <p>Testing</p>
          </DataTable>
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