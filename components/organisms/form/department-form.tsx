import { useState, useEffect, FormEvent, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Faculty } from "@/lib/types/faculty.type";
import { Department } from "@/lib/types/department.type";
import FormControlError from "@/components/atoms/form-control-error";
import FormGroup from "@/components/atoms/form-group";
import Label from "@/components/atoms/label";
import FormControl from "@/components/atoms/form-control";
import Button from "@/components/atoms/button";
import MultiSelect from "@/components/molecules/multi-select";
import { StatusCode } from "@/lib/enum/status-code";
import { destroy, post, put } from "@/lib/util/http-request";
import { FormAction } from "@/lib/enum/form-action";
import { FormSubmissionState } from "@/lib/enum/form-submission-state.enum";


type DepartmentFormProps = {
  faculties: Faculty[];
  selectedItem: Department | undefined;
  formAction: FormAction;
  formSubmissionState: FormSubmissionState;
  onSetAlertResponse: (value: {message: string, status: StatusCode}) => void;
  onCloseModal: () => void;
  onSaveDepartment: (value: Department) => void;
  onSetFormState: (state: FormSubmissionState) => void;
  onRemoveDepartment: (facultyId: number, departmentId: number) => void;
}

export default function DepartmentForm(
  {faculties, selectedItem, formAction, formSubmissionState, onSetAlertResponse, onCloseModal, onSaveDepartment, onSetFormState, onRemoveDepartment}: DepartmentFormProps
) {
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | undefined>();
  const [showFacultyError, setShowFacultyError] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
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
    if (selectedItem) {
      formik.setValues({
        name: selectedItem.name
      });

      const faculty = faculties.find(fac => fac.id === selectedItem.facultyId);
      setSelectedFaculty(faculty);
    }
  }, [selectedItem]);


  async function handleSubmit(values: {name: string}) {
    if (!selectedFaculty) {
      setShowFacultyError(true);
      return;
    }
    
    setShowFacultyError(false);
    let result: {message: string; data: Department};
    onSetFormState(FormSubmissionState.SUBMITTING);

    try {
      if (selectedItem) {
        result = await put(`/api/departments/${selectedItem.id}`, {
          name: values.name,
          facultyId: selectedFaculty.id!,
        });
        onCloseModal();
      }
      else {
        result = await post("/api/departments", {
          name: values.name,
          facultyId: selectedFaculty.id!
        });
      }
      onSaveDepartment(result.data);
      setSelectedFaculty(undefined);
      handleFormResponse(result.message, StatusCode.SUCCESS);
      formik.resetForm();
    }
    catch(error: any) {
      handleFormResponse(error.message, StatusCode.BAD_REQUEST);
    }

    onSetFormState(FormSubmissionState.DONE);
    setAlertResolverTimer();
  }


  function handleFormResponse(message: string, status: StatusCode) {
    onSetAlertResponse({
      message: message, 
      status: status
    });
  }

  function setAlertResolverTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onSetFormState(FormSubmissionState.PENDING);
    }, 2000);
  }


  function handleSelectedFaculty(id: number) {
    const faculty = faculties.find(item => item.id === id);
    if (faculty) {
      setSelectedFaculty(faculty);
      setShowFacultyError(false);
    }
  }


  async function handleDeleteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedItem) {
      return;
    }

    onSetFormState(FormSubmissionState.SUBMITTING);

    try {
      const result = await destroy(`/api/departments/${selectedItem?.id!}`);
      onRemoveDepartment(selectedItem?.facultyId!, selectedItem?.id!);
      onSetAlertResponse({
        message: result.message, 
        status: StatusCode.SUCCESS
      });
    }
    catch(error: any) {
      onSetAlertResponse({
        message: error.message, 
        status: StatusCode.BAD_REQUEST
      });
    }
    onSetFormState(FormSubmissionState.DONE);

    setAlertResolverTimer();
  }


  let isEditOrAdd = formAction === FormAction.ADD || formAction === FormAction.EDIT;
  let buttonText = formAction === FormAction.ADD ? "Add" : "Save";

  return (
    <form onSubmit={isEditOrAdd ? formik.handleSubmit : handleDeleteSubmit}>
      {isEditOrAdd ? (
        <>
          <FormGroup className="mb-2">
            <Label htmlFor="department_name" className="mb-1 inline-block">Department Name</Label>
            <FormControl 
              type="text" 
              placeholder="Enter department name here" 
              id="department_name"
              {...formik.getFieldProps("name")}
              hasError={!!formik.errors.name && formik.touched.name}/>
            {(formik.errors.name && formik.touched.name) && <FormControlError errorMessage={formik.errors.name} />}
          </FormGroup>
          <FormGroup className="mb-2">
            <Label htmlFor="faculty" className="mb-1 inline-block">Select faculty</Label>
            <MultiSelect 
              items={faculties}
              selectedItem={selectedFaculty}
              onSelecteItem={handleSelectedFaculty}
              placeholder="Assign department to a faculty here"
              hasError={showFacultyError} />
            {showFacultyError && <FormControlError errorMessage="Faculty is required" />}
          </FormGroup>
          <div className="flex gap-4 mt-4">
            <div className="basis-[50%] flex flex-col">
              <Button el="button" variant="secondary" type="button">Cancel</Button>
            </div>
            <div className="basis-[50%] flex flex-col">
              <Button el="button" variant="primary" type="submit"
                disabled={formSubmissionState === FormSubmissionState.SUBMITTING}>
                { formSubmissionState !== FormSubmissionState.SUBMITTING ? buttonText : "Loading..." }
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="mb-4">Are you sure you want to delete this department? This action will remove the department and it cannot be undone</p>
          <div className="flex gap-4 mt-4">
            <div className="basis-[50%] flex flex-col">
              <Button el="button" variant="secondary" type="button">Cancel</Button>
            </div>
            <div className="basis-[50%] flex flex-col">
              <Button el="button" variant="danger" type="submit"
                disabled={formSubmissionState === FormSubmissionState.SUBMITTING}>
                { formSubmissionState !== FormSubmissionState.SUBMITTING ? 'Yes, delete' : "Loading..." }
              </Button>
            </div>
          </div>
        </>
      )}
    </form>
  );
}