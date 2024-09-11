import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import Button from "@/components/atoms/button/button";
import FormGroup from "@/components/atoms/form-group/form-group";
import Label from "@/components/atoms/label/label";
import FormControl from "@/components/molecules/form-control/form-control";
import MultiSelect from "@/components/molecules/multi-select/multi-select";
import { AcademicAction } from "@/lib/enums/academic-actions";
import { getFaculties } from "@/lib/api/faculty";
import { FetchForm } from "@/lib/enums/fetch-form";
import { AlertVariant } from "@/lib/enums/alert-variant";
import { Faculty } from "@/lib/types/faculty.type";
import InputError from "@/components/atoms/input-error/input-error";
import { createDepartment } from "@/lib/api/department";

type DepartmentFormProps = {
  action: AcademicAction;
  onShowAlert: (message: string, variant: AlertVariant) => void;
}

export default function DepartmentForm({action, onShowAlert}: DepartmentFormProps) {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | undefined>();
  const [showFacultyError, setShowFacultyError] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: ""
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Department name is required")
        .matches(/^[a-zA-Z ]*$/, "Only letters and white spaces are allowed")
        .min(3, "Must be at least 3 characters")
        .max(50, "Must be 30 characters or less")
    }),
    onSubmit: handleSubmit
  });


  useEffect(() => {
    async function fetchFaculties() {
      try {
        const result = await getFaculties(FetchForm.ALL);
        setFaculties(result.data);
      }
      catch(error: any) {
        onShowAlert(error.message, AlertVariant.ERROR);
      }
      finally {
        setDataFetched(true);
      }
    }

    if (!dataFetched) {
      fetchFaculties();
    }
  }, [dataFetched]);



  async function handleSubmit(values: {name: string}) {
    if (!selectedFaculty) {
      setShowFacultyError(true);
      return;
    }
    
    setShowFacultyError(false);

    try {
      const result = await createDepartment({
        name: values.name,
        facultyId: selectedFaculty.id!
      });
      onShowAlert(result.message, AlertVariant.SUCCESS);
      formik.resetForm();
      setSelectedFaculty(undefined);
    }
    catch(error: any) {
      onShowAlert(error.message, AlertVariant.SUCCESS);
    }
  }


  function handleSelectedFaculty(id: number) {
    const faculty = faculties.find(item => item.id === id);
    if (faculty) {
      setSelectedFaculty(faculty);
      setShowFacultyError(false);
    }
  }


  let isEditOrAdd = action === AcademicAction.ADD || action === AcademicAction.EDIT;

  return (
    <form onSubmit={formik.handleSubmit}>
      {isEditOrAdd ? (
        <>
          <FormGroup className="mb-2">
            <Label htmlFor="department_name">Department Name</Label>
            <FormControl 
              type="text" 
              placeholder="Enter department name here" 
              id="department_name"
              {...formik.getFieldProps("name")}
              hasError={!!formik.errors.name && formik.touched.name}/>
            {(formik.errors.name && formik.touched.name) && <InputError message={formik.errors.name} />}
          </FormGroup>
          <FormGroup className="mb-2">
            <Label htmlFor="faculty">Select faculty</Label>
            <MultiSelect 
              items={faculties}
              selectedItem={selectedFaculty}
              onSelecteItem={handleSelectedFaculty}
              placeholder="Assign department to a faculty here"
              hasError={showFacultyError} />
            {showFacultyError && <InputError message="Faculty is required" />}
          </FormGroup>
          <div className="flex gap-2">
            <div className="col-6 flex flex-column">
              <Button variant="secondary" type="button">Cancel</Button>
            </div>
            <div className="col-6 flex flex-column">
              <Button variant="primary" type="submit">Add</Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="line-height-24">Are you sure you want to delete this department? This action will remove the department and it cannot be undone</p>
          <div className="flex gap-2 mt-2">
            <div className="col-6 flex flex-column">
              <Button variant="secondary" type="button">Cancel</Button>
            </div>
            <div className="col-6 flex flex-column">
              <Button variant="danger" type="submit">Yes delete</Button>
            </div>
          </div>
        </>
      )}
    </form>
  )
}