import { useFormik } from "formik";
import * as Yup from "yup";

import Button from "@/components/atoms/button/button";
import FormGroup from "@/components/atoms/form-group/form-group";
import Label from "@/components/atoms/label/label";
import FormControl from "@/components/molecules/form-control/form-control";
import { AcademicAction } from "@/lib/enums/academic-actions";
import { createFaculty } from "@/lib/api/faculty";
import InputError from "@/components/atoms/input-error/input-error";
import { AlertVariant } from "@/lib/enums/alert-variant";

type FacultyFormProps = {
  action: AcademicAction;
  onShowAlert: (message: string, variant: AlertVariant) => void;
}

export default function FacultyForm({ action, onShowAlert }: FacultyFormProps) {
  const formik = useFormik({
    initialValues: {
      name: ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required")
        .min(3, "Must be at least 3 characters")
        .matches(/^[a-zA-Z ]+$/, "Only letters and white spaces are allowed")
    }),
    onSubmit: handleSubmit
  });

  async function handleSubmit(value: {name: string}) {
    try {
      const result = await createFaculty(value);
      onShowAlert(result.message, AlertVariant.SUCCESS);
      formik.resetForm();
    }
    catch(error: any) {
      onShowAlert(error.message, AlertVariant.ERROR);
    }
  }

  let isEditOrAdd = action === AcademicAction.ADD || action === AcademicAction.EDIT;

  return (
    <form onSubmit={formik.handleSubmit}>
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
              <Button variant="primary" type="submit">Add</Button>
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