"use client";

import { FormEvent, useEffect, useRef } from "react";
import { useFormik } from "formik";

import FormGroup from "@/components/atoms/form-group";
import Label from "@/components/atoms/label";
import FormControl from "@/components/atoms/form-control";
import FormControlError from "@/components/atoms/form-control-error";
import Button from "@/components/atoms/button";
import { facultyValidationSchema } from "@/lib/validation/academic-divisition.validation";
import { StatusCode } from "@/lib/enum/status-code";
import { destroy, post, put } from "@/lib/util/http-request";
import { FormAction } from "@/lib/enum/form-action";
import { Faculty } from "@/lib/types/faculty.type";
import { FormSubmissionState } from "@/lib/enum/form-submission-state.enum";

type FacultyFormProps = {
  formAction: FormAction;
  selectedItem: Faculty | undefined;
  formSubmissionState: FormSubmissionState;
  onSetAlertResponse: (value: {message: string, status: StatusCode}) => void;
  onSetFormState: (message: FormSubmissionState) => void;
  onSaveFaculty: (faculty: Faculty) => void;
  onHideModal: () => void;
  onUpdateFaculties: (id: number, updatedFaculties: Faculty[], rows: number) => void;
}

export default function FacultyForm(
  {formAction, selectedItem, formSubmissionState, onSetAlertResponse, onSetFormState, onSaveFaculty, onHideModal, onUpdateFaculties}: FacultyFormProps
) {
  const timerRef = useRef<NodeJS.Timeout>();
  const formik = useFormik({
    initialValues: {
      name: ""
    },
    validationSchema: facultyValidationSchema,
    onSubmit: handleSubmit
  });


  useEffect(() => {
    if (selectedItem) {
      formik.setValues({name: selectedItem.name});
    }
  }, [selectedItem]);

  
  function handleFormErrorResponse(error: unknown) {
    let message = error instanceof Error ? error.message : "Something went wrong";
    onSetAlertResponse({
      message,
      status: StatusCode.BAD_REQUEST
    });
  }

  function handleFormSuccessResponse(message: string) {
    onSetAlertResponse({
      message: message,
      status: StatusCode.SUCCESS
    });
  }


  async function handleSubmit(values: {name: string}) {
    let result: {message: string; data: Faculty};
    onSetFormState(FormSubmissionState.SUBMITTING);

    try {
      if (!selectedItem) {
        result = await post("/api/faculties", values);
      } else { 
        result = await put(`/api/faculties/${selectedItem.id}`, values);
        onHideModal();
      }

      onSaveFaculty(result.data);
      handleFormSuccessResponse(result.message);
      formik.resetForm();
    }
    catch(error) {
      handleFormErrorResponse(error);
    }

    onSetFormState(FormSubmissionState.DONE);
    setAlertResolverTimer();
  }

  function setAlertResolverTimer() {
    timerRef.current = setTimeout(() => {
      onSetFormState(FormSubmissionState.PENDING);
    }, 2000);
  }


  async function handleDeleteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedItem) {
      return;
    }

    onSetFormState(FormSubmissionState.SUBMITTING);

    try {
      const result = await destroy(`/api/faculties/${selectedItem?.id}`);
      handleFormSuccessResponse(result.message);
      onUpdateFaculties(selectedItem?.id!, result.data, result.count);;
      onHideModal();
    }
    catch(error) {
      handleFormErrorResponse(error);
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
          <FormGroup>
            <Label htmlFor="faculty_name" className="mb-1 inline-block">Faculty Name</Label>
            <FormControl type="text" placeholder="Enter faculty name here" id="faculty_name"
              {...formik.getFieldProps("name")} 
              hasError={!!formik.errors.name && formik.touched.name}/>
              {(formik.errors.name && formik.touched.name) && <FormControlError errorMessage={formik.errors.name} />}
          </FormGroup>
          <div className="flex gap-4 mt-4">
            <div className="basis-[50%] flex flex-col">
              <Button el="button" variant="secondary" type="button" onClick={onHideModal}>Cancel</Button>
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
          <p className="mb-4">Are you sure you want to delete this faculty? This action will remove all departments associated with this faculty, and it cannot be undone</p>
          <div className="flex gap-4 mt-4">
            <div className="basis-[50%] flex flex-col">
              <Button el="button" variant="secondary" type="button" onClick={onHideModal}>Cancel</Button>
            </div>
            <div className="basis-[50%] flex flex-col">
              <Button el="button" variant="danger" type="submit"
                disabled={formSubmissionState === FormSubmissionState.SUBMITTING}>
                { formSubmissionState !== FormSubmissionState.SUBMITTING ? 'Yes, delete' : 'Loading...' }
              </Button>
            </div>
          </div>
        </>
      )}
    </form>
  );
}