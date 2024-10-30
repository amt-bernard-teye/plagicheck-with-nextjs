"use client";

import { useEffect, useState } from "react";

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
import DepartmentForm from "../organisms/form/department-form";
import { Department } from "@/lib/types/department.type";
import { FormSubmissionState } from "@/lib/enum/form-submission-state.enum";

enum UserTab {
  DEPARTMENT = "deparment",
  FACULTY = "faculty"
}

type UserAction = {
  activeTab: UserTab;
  formAction: FormAction;
}

type AcademicDivisionInteractivityProps = {
  paginatedFaculties: Faculty[];
  rowCount: number;
  allFaculties: Faculty[];
}

export default function AcademicDivisionInteractivity({paginatedFaculties, rowCount, allFaculties}: AcademicDivisionInteractivityProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<Department>();
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty>();
  const [userAction, setUserAction] = useState<UserAction>();
  const [alertResponse, setAlertResponse] = useState<AlertResponse>();
  const [formSubmissionState, setFormSubmissionState] = useState<FormSubmissionState>(FormSubmissionState.PENDING);
  const [faculties, setFaculties] = useState<Faculty[]>(paginatedFaculties);
  const [facultyRows, setFacultyRows] = useState(rowCount);

  
  useEffect(() => {
    if (paginatedFaculties) {
      setFaculties(paginatedFaculties);
    }
  }, [paginatedFaculties]);


  function handleSelectedFaculty(facultyId: number) {
    const faculty = faculties.find(item => item.id === facultyId);

    if (!faculty) {
      return;
    }

    setSelectedFaculty(faculty);
  }


  function handleSelectedDepartment(departmentId: number, facultyId: number) {
    const faculty = faculties.find(item => item.id === facultyId);

    if (!faculty) {
      return;
    }

    const department = faculty.departments?.find(item => item.id === departmentId);

    if (!department) {
      return;
    }

    setSelectedDepartment(department);
  }


  function handleUserAction(tab: UserTab, action: FormAction) {
    setUserAction({
      activeTab: tab,
      formAction: action
    });
  }


  function handleSaveFaculty(faculty: Faculty) {
    const existingFacultyIndex = faculties.findIndex(fac => fac.id === faculty.id);

    if (existingFacultyIndex !== -1) {
      const facultyToEdit = {...faculties[existingFacultyIndex]};
      facultyToEdit.name = faculty.name;
      const updatedFaculties = [...faculties];
      updatedFaculties.splice(existingFacultyIndex, 1, facultyToEdit);
      setFaculties(updatedFaculties);
    }
    else {
      if (faculties.length < 9) {
        setFaculties(faculties => [faculty, ...faculties]);
      }
      else {
        const updatedFaculties = [faculty, ...faculties];
        updatedFaculties.pop();
        setFaculties(updatedFaculties);
      }
    }
  }


  function handleRemoveFaculty(facultyId: number, updatedFaculties: Faculty[], rows: number) {
    setFaculties(faculties => faculties.filter(faculty => faculty.id !== facultyId));
    setFaculties(updatedFaculties);
    setFacultyRows(rows);
  }


  function handleDepartmentFaculty(department: Department) {
    const existingFacultyIndex = faculties.findIndex(faculty => faculty.id === department.facultyId);

    if (existingFacultyIndex === -1) {
      return;
    }

    const updatedFaculties = [...faculties];
    const faculty = {...updatedFaculties[existingFacultyIndex]};

    if (selectedDepartment) { // implement update
      const existingDepartmentIndex = faculty.departments!.findIndex(dept => dept.id === department.id);
      const deleteCount = 1;
      const departments = [...faculty.departments!];
      departments.splice(existingDepartmentIndex, deleteCount, department)
      const updatedFaculty = {
        ...faculty,
        departments: [...departments]
      }
      updatedFaculties[existingFacultyIndex] = updatedFaculty;
      setSelectedDepartment(undefined);
    }
    else {  // implement add
      const updatedFaculty = {
        ...faculty,
        departments: [...faculty.departments!, department]
      }
      updatedFaculties[existingFacultyIndex] = updatedFaculty;
    }

    setFaculties(updatedFaculties);
  }


  function handleHideModal() {
    setUserAction(undefined);
    setSelectedFaculty(undefined);
    setSelectedDepartment(undefined);
  }


  let columnHeadings = ["Faculty name", "Departments", ""];
  let modalHeading = "";

  if (userAction) {
    let formAction = userAction.formAction.substring(0, 1).toUpperCase() + userAction.formAction.substring(1, userAction.formAction.length);
    let currentTab = userAction.activeTab.substring(0, 1).toUpperCase() + userAction.activeTab.substring(1, userAction.activeTab.length);
    modalHeading = `${formAction} ${currentTab}`;
  }

  let form: React.JSX.Element | undefined = undefined;

  if (userAction && userAction.activeTab === UserTab.FACULTY) {
    form = (
      <FacultyForm
        onSetAlertResponse={setAlertResponse}
        onSetFormState={setFormSubmissionState}
        formAction={userAction.formAction}
        selectedItem={selectedFaculty}
        onSaveFaculty={handleSaveFaculty}
        onHideModal={handleHideModal}
        formSubmissionState={formSubmissionState}
        onUpdateFaculties={handleRemoveFaculty} />
    );
  }
  else if (userAction && userAction.activeTab === UserTab.DEPARTMENT) {
    form = (
      <DepartmentForm 
        faculties={allFaculties}
        onCloseModal={() => setUserAction(undefined)}
        selectedItem={selectedDepartment}
        onSetAlertResponse={setAlertResponse}
        formAction={userAction.formAction}
        formSubmissionState={formSubmissionState}
        onSetFormState={setFormSubmissionState}
        onSaveDepartment={handleDepartmentFaculty} />
    );
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
                    onEdit={() => handleUserAction(UserTab.DEPARTMENT, FormAction.EDIT)}
                    onSelectItem={handleSelectedDepartment}
                    onDelete={() => handleUserAction(UserTab.DEPARTMENT, FormAction.DELETE)}
                    />
                </td>
                <td>
                  <DataTableActions>
                    <button className="text-left hover:text-[#0267ff] hover:font-semibold"
                      onClick={() => {
                        handleUserAction(UserTab.FACULTY, FormAction.EDIT)
                        handleSelectedFaculty(faculty.id!);
                      }}>Edit Faculty</button>
                    <button className="text-left hover:text-[#0267ff] hover:font-semibold"
                      onClick={() => {
                        handleUserAction(UserTab.FACULTY, FormAction.DELETE)
                        handleSelectedFaculty(faculty.id!);
                      }}>Delete Faculty</button>
                  </DataTableActions>
                </td>
              </tr>
            ))}
          </DataTable>

          <Paginator totalRows={facultyRows}/>
        </div>

      {userAction && (
        <Modal title={modalHeading} onToggle={handleHideModal}>
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