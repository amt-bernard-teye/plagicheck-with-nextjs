"use client";

import { useState } from "react";

import Button from "../atoms/button";
import SubHeader from "../molecules/sub-header";
import { FormAction } from "@/lib/enum/form-action";
import Modal from "../organisms/modal";
import FacultyForm from "../organisms/form/faculty-form";
import Alert from "../molecules/alert";
import { AlertResponse } from "@/lib/types/alert-response.type";
import { StatusCode } from "@/lib/enum/status-code";
import DataTable from "../molecules/data-table/data-table";
import DataTableActions from "../molecules/data-table/data-table-action";
import DepartmentList from "../molecules/department-list";
import { Faculty } from "@/lib/types/faculty.type";
import Paginator from "../molecules/paginator";

enum UserTab {
  DEPARTMENT = "deparment",
  FACULTY = "faculty"
}

type UserAction = {
  activeTab: UserTab;
  formAction: FormAction;
}

type AcademicDivisionInteractivityProps = {
  faculties: Faculty[];
  rowCount: number;
}

export default function AcademicDivisionInteractivity({faculties, rowCount}: AcademicDivisionInteractivityProps) {
  const [userAction, setUserAction] = useState<UserAction>();
  const [alertResponse, setAlertResponse] = useState<AlertResponse>();
  const [formSubmissionState, setFormSubmissionState] = useState<"pending" | "submitting" | "done">("pending");

  let columnHeadings = ["Faculty name", "Departments", ""];
  let modalHeading = "";

  if (userAction) {
    let formAction = userAction.formAction.substring(0, 1).toUpperCase() + userAction.formAction.substring(1, userAction.formAction.length);
    let currentTab = userAction.activeTab.substring(0, 1).toUpperCase() + userAction.activeTab.substring(1, userAction.activeTab.length);
    modalHeading = `${formAction} ${currentTab}`;
  }

  let form: React.JSX.Element | undefined = undefined;

  if (userAction && userAction.activeTab === UserTab.FACULTY) {
    form = <FacultyForm onSetAlertResponse={setAlertResponse} onSetFormState={setFormSubmissionState} />
  }

  return (
    <>
      <SubHeader 
        title="Academic Unit"
        description="Add faculties and departments here">
        <div className="flex gap-4">
            <div className="flex flex-col w-[162px]">
              <Button el="button" variant="secondary"
                onClick={() => setUserAction({activeTab: UserTab.DEPARTMENT, formAction: FormAction.ADD})}>Add Department</Button>
            </div>
            <div className="flex flex-col w-[128px]">
              <Button el="button" variant="primary"
                onClick={() => setUserAction({activeTab: UserTab.FACULTY, formAction: FormAction.ADD})}>Add Faculty</Button>
            </div>
          </div>
      </SubHeader>
      <div className="py-[15px] px-[21px] xl:py-[19px] xl:px-[41px]">
          <DataTable columnHeadings={columnHeadings}>
            {faculties.map(faculty => (
              <tr key={faculty.id}>
                <td>{faculty.name}</td>
                <td>
                  <DepartmentList
                    list={faculty.departments}
                    // onEdit={() => toggleModal(AcademicTab.DEPARTMENT, AcademicAction.EDIT)}
                    onEdit={() => {}}
                    // onSelectItem={handleSelectedDepartment}
                    onSelectItem={() => {}}
                    // onDelete={() => toggleModal(AcademicTab.DEPARTMENT, AcademicAction.DELETE)}
                    onDelete={() => {}}
                    />
                </td>
                <td>
                  <DataTableActions>
                    <button className="text-left hover:text-[#0267ff] hover:font-semibold"
                      onClick={() => {
                        // toggleModal(AcademicTab.FACULTY, AcademicAction.EDIT);
                        // handleSelectedFaculty(faculty.id!);
                      }}>Edit Faculty</button>
                    <button className="text-left hover:text-[#0267ff] hover:font-semibold"
                      onClick={() => {
                        // toggleModal(AcademicTab.FACULTY, AcademicAction.DELETE);
                        // handleSelectedFaculty(faculty.id!);
                      }}>Delete Faculty</button>
                  </DataTableActions>
                </td>
              </tr>
            ))}
          </DataTable>

          <Paginator totalRows={rowCount}/>
        </div>

      {userAction && (
        <Modal title={modalHeading} onToggle={() => setUserAction(undefined)}>
          {form}
        </Modal>
      )}

      {(formSubmissionState === "done" && alertResponse) && (
        <Alert
          message={alertResponse.message}
          variant={alertResponse.status === StatusCode.SUCCESS ? "success" : "error"} />
      )}
    </>
  );
}