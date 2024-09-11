import Head from "next/head";
import { useRouter } from "next/router";

import Dashboard from "@/components/layouts/dashboard/dashboard";
import PageHeader from "@/components/organisms/page-header/page-header";
import SubHeader from "@/components/organisms/sub-header/sub-header";
import Button from "@/components/atoms/button/button";
import styles from "@/styles/pages/academic-division.module.css";
import Modal from "@/components/organisms/modal/modal";
import FacultyForm from "@/components/organisms/faculty-form/faculty-form";
import DepartmentForm from "@/components/organisms/department-form/department-form";
import DataTable from "@/components/organisms/datatable/datatable";
import DepartmentList from "@/components/molecules/department-list/department-list";
import DataTableActions from "@/components/molecules/datatable-actions/datatable-actions";
import { AcademicAction } from "@/lib/enums/academic-actions";
import { useAlert } from "@/lib/hooks/useAlert";
import Alert from "@/components/molecules/alert/alert";
import { AlertVariant } from "@/lib/enums/alert-variant";
import { Faculty } from "@/lib/types/faculty.type";
import { FacultyRepository } from "@/lib/repository/faculty.repository";
import { checkAuthUser } from "@/lib/utils/check-auth-user";
import { useState } from "react";


export async function getServerSideProps(context: any) {
  checkAuthUser(context);

  try {
    const facultyRepo = new FacultyRepository();
    const [faculties, count] = await Promise.all([
      facultyRepo.paginate("", 0),
      facultyRepo.count('')
    ]);

    return {
      props: {
        data: faculties,
        count
      }
    }
  }
  catch(error) {
    return {
      notFound: true
    }
  }
}


enum AcademicTab {
  FACULTY = "faculty",
  DEPARTMENT = "department",
};

type AcademicDivisionProps = {
  count: number;
  data: Faculty[]
};

export default function AcademicDivision({count, data: fetchedFaculties}: AcademicDivisionProps) {
  const router = useRouter();
  const { alertDetails, handleAlertDetails } = useAlert();
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | undefined>();

  function toggleModal(tab: AcademicTab, action: AcademicAction) {
    const params = new URLSearchParams();
    params.set("tab", tab);
    params.set("action", action);
    router.replace(`${router.pathname}?${params.toString()}`);
  }

  function handleSelectedFaculty(id: number) {
    const faculty = fetchedFaculties.find(fac => fac.id === id);
    setSelectedFaculty(faculty);
  }

  function handleSelectedDepartment(id: number) {

  }

  let tab = router.query.tab as string || "";
  let action = router.query.action as string || "";
  let modalAction = action.substring(0, 1).toUpperCase() + action.substring(1, action.length);
  let modalHeading = "";
  let form: React.JSX.Element | undefined;
  let columnHeadings = ["Faculty name", "Departments", ""];

  if (tab === AcademicTab.FACULTY) {
    modalHeading = modalAction + " Faculty";
    form = <FacultyForm action={action as AcademicAction} onShowAlert={handleAlertDetails} selectedFaculty={selectedFaculty}/>
  } else if (tab === AcademicTab.DEPARTMENT) {
    modalHeading = modalAction + " Department";
    form = <DepartmentForm action={action as AcademicAction} onShowAlert={handleAlertDetails}/>
  }

  return (
    <>
      <Head>
        <title>Plagiarism Checker | Academic Division</title>
        <meta name="description" content="Plagiarism Checker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Head>
      <Dashboard>
        <PageHeader />
        <SubHeader
          title="Academic Division"
          description="Add faculties and departments here">
          <div className={`${styles.actions} flex gap-2`}>
            <div className={styles.actionFirst}>
              <Button variant="secondary" 
                onClick={() => toggleModal(AcademicTab.DEPARTMENT, AcademicAction.ADD)}>Add Department</Button>
            </div>
            <div className={styles.actionSecond}>
              <Button variant="primary" 
                onClick={() => toggleModal(AcademicTab.FACULTY, AcademicAction.ADD)}>Add Faculty</Button>
            </div>
          </div>
        </SubHeader>
        <div className="section-padding">
          <DataTable columnHeadings={columnHeadings}>
            {fetchedFaculties.map(faculty => (
              <tr key={faculty.id}>
                <td>{faculty.name}</td>
                <td>
                  <DepartmentList
                    list={faculty.departments}
                    onEdit={() => toggleModal(AcademicTab.DEPARTMENT, AcademicAction.EDIT)}
                    onDelete={() => toggleModal(AcademicTab.DEPARTMENT, AcademicAction.DELETE)}/>
                </td>
                <td>
                  <DataTableActions>
                    <button
                      onClick={() => {
                        toggleModal(AcademicTab.FACULTY, AcademicAction.EDIT);
                        handleSelectedFaculty(faculty.id!);
                      }}>Edit Faculty</button>
                    <button
                      onClick={() => {
                        toggleModal(AcademicTab.FACULTY, AcademicAction.DELETE);
                        handleSelectedFaculty(faculty.id!);
                      }}>Delete Faculty</button>
                  </DataTableActions>
                </td>
              </tr>
            ))}
          </DataTable>
        </div>
        
        {tab && (
          <Modal 
            title={modalHeading} 
            onToggle={() => router.replace(router.pathname)}>
            { form }
          </Modal>
        )}
      </Dashboard>

      {alertDetails.message && (
        <Alert 
          details={alertDetails}
          onToggle={() => handleAlertDetails("", AlertVariant.SUCCESS)}/>
      )}
    </>
  );
}