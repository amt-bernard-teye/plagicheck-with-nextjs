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

enum AcademicTab {
  FACULTY = "faculty",
  DEPARTMENT = "department",
};

enum AcademicAction {
  ADD = "add",
  EDIT = "edit",
  DELETE = "delete"
};

export default function AcademicDivision() {
  const router = useRouter();

  function toggleModal(tab: AcademicTab, action: AcademicAction) {
    const params = new URLSearchParams();
    params.set("tab", tab);
    params.set("action", action);
    router.replace(`${router.pathname}?${params.toString()}`);
  }

  let tab = router.query.tab as string || "";
  let action = router.query.action as string || "";
  let modalAction = action.substring(0, 1).toUpperCase() + action.substring(1, action.length);
  let modalHeading = "";
  let form: React.JSX.Element | undefined;
  let columnHeadings = ["Faculty name", "Departments", ""];

  if (tab === AcademicTab.FACULTY) {
    modalHeading = modalAction + " Faculty";
    form = <FacultyForm />
  } else if (tab === AcademicTab.DEPARTMENT) {
    modalHeading = modalAction + " Department";
    form = <DepartmentForm />
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
            <tr>
              <td>Faculty of Applied Science</td>
              <td>
                <DepartmentList />
              </td>
              <td>
                <DataTableActions>
                  <button>Edit Faculty</button>
                  <button>Delete Faculty</button>
                </DataTableActions>
              </td>
            </tr>
            <tr>
              <td>Faculty of Applied Science</td>
              <td>
                <DepartmentList />
              </td>
              <td>
                <DataTableActions>
                  <button>Edit Faculty</button>
                  <button>Delete Faculty</button>
                </DataTableActions>
              </td>
            </tr>
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
    </>
  );
}