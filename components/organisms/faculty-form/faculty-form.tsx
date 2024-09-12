import { FormEvent, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import Button from "@/components/atoms/button/button";
import FormGroup from "@/components/atoms/form-group/form-group";
import Label from "@/components/atoms/label/label";
import FormControl from "@/components/molecules/form-control/form-control";
import { AcademicAction } from "@/lib/enums/academic-actions";
import { createFaculty, deleteFaculty, updateFaculty } from "@/lib/api/faculty";
import InputError from "@/components/atoms/input-error/input-error";
import { AlertVariant } from "@/lib/enums/alert-variant";
import { Faculty } from "@/lib/types/faculty.type";

type FacultyFormProps = {
  action: AcademicAction;
  selectedFaculty: Faculty | undefined;
  onShowAlert: (message: string, variant: AlertVariant) => void;
}

export default function FacultyForm({action, selectedFaculty, onShowAlert}: FacultyFormProps) {
  const formik = useFormik({
    initialValues: {
      name: ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required")
        .min(3, "Must be at least 3 characters")
        .max(50, "Must be 50 characters or less")
        .matches(/^[a-zA-Z ]+$/, "Only letters and white spaces are allowed")
        .trim()
    }),
    onSubmit: handleSubmit
  });


  useEffect(() => {
    if (selectedFaculty) {
      formik.setValues({
        name: selectedFaculty!.name
      });
    }
  }, [selectedFaculty]);


  async function handleSubmit(value: {name: string}) {
    let result: any;
    
    try {
      if (action === AcademicAction.ADD) {
        result = await createFaculty(value);
      }
      else if (action === AcademicAction.EDIT) {
        result = await updateFaculty(value, selectedFaculty?.id!);
      }

      onShowAlert(result.message, AlertVariant.SUCCESS);
      formik.resetForm();
    }
    catch(error: any) {
      onShowAlert(error.message, AlertVariant.ERROR);
    }
  }


  async function handleDeleteFaculty(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const result = await deleteFaculty(selectedFaculty?.id!);
      onShowAlert(result.message, AlertVariant.SUCCESS);
      formik.resetForm();
    }
    catch(error: any) {
      onShowAlert(error.message, AlertVariant.ERROR);
    }
  }

  
  let isEditOrAdd = action === AcademicAction.ADD || action === AcademicAction.EDIT;

  return (
    <form onSubmit={isEditOrAdd ? formik.handleSubmit : handleDeleteFaculty}>
      {isEditOrAdd ? (
        <>
          <FormGroup>
            <Label htmlFor="faculty_name">Faculty Name</Label>
            <FormControl type="text" placeholder="Enter faculty name here" id="faculty_name"
              {...formik.getFieldProps("name")} 
              hasError={!!formik.errors.name && formik.touched.name}/>
              {(formik.errors.name && formik.touched.name) && <InputError message={formik.errors.name} />}
          </FormGroup>
          <div className="flex gap-2 mt-2">
            <div className="col-6 flex flex-column">
              <Button variant="secondary" type="button">Cancel</Button>
            </div>
            <div className="col-6 flex flex-column">
              <Button variant="primary" type="submit">
                {selectedFaculty ? "Save" : "Add"}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="line-height-24">Are you sure you want to delete this faculty? This action will remove all departments associated with this faculty, and it cannot be undone</p>
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
  );
}