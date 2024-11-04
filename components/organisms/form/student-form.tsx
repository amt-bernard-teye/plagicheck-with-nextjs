"use client";

import { FormEvent, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import Button from "@/components/atoms/button";
import FormGroup from "@/components/atoms/form-group";
import Label from "@/components/atoms/label";
import FormControl from "@/components/atoms/form-control";
import MultiSelect from "@/components/molecules/multi-select";
import FormControlError from "@/components/atoms/form-control-error";
import { Department } from "@/lib/types/department.type";
import { UserToCreate } from "@/lib/types/user.type";
import { Student } from "@/lib/types/student.type";
import { StatusCode } from "@/lib/enum/status-code";
import { FormAction } from "@/lib/enum/form-action";
import { FormSubmissionState } from "@/lib/enum/form-submission-state.enum";
import { destroy, post, put } from "@/lib/util/http-request";
import { setAlertErrorState, setAlertSuccessState } from "@/lib/util/set-alert-response.util";
import { useFormStateTimer } from "@/lib/hooks/use-form-state-timer";


type StudentFormProps = {
  departments: Department[];
  formAction: FormAction;
  selectedItem?: Student;
  formSubmissionState: FormSubmissionState;
  onSave: (value: Student) => void;
  onSetAlertResponse: (value: {message: string, status: StatusCode}) => void;
  onSetFormState: (value: FormSubmissionState) => void;
  onHideModal: () => void;
  onRemoveStudent: (id: string) => void;
}


export default function StudentForm(
  {departments, formAction, selectedItem, formSubmissionState, onSave, onSetAlertResponse, onSetFormState, onHideModal, onRemoveStudent}: StudentFormProps
) {
  const { setAlertResolverTimer } = useFormStateTimer(onSetFormState);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>(selectedItem?.department);
  const [chosenDepartment, setChosenDepartment] = useState(true);
  const formik = useFormik({
    initialValues: {
      name: selectedItem?.user.name || "",
      email: selectedItem?.user.email || "",
      phoneNumber: selectedItem?.user.phoneNumber || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required").matches(/^[a-zA-Z ]*$/, "Only letters and white spaces are allowed"),
      email: Yup.string().required("Email is required").email("Invalid email address"),
      phoneNumber: Yup.string().required("Phone is required").matches(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/, "Invalid phone number"),
    }),
    onSubmit: handleSubmit
  });


  function handleSelectedDepartment(id: number) {
    const department = departments.find(dept => dept.id === id);
    setSelectedDepartment(department);
  }


  async function handleSubmit(value: {name: string; email: string; phoneNumber: string}) {
    if (!selectedDepartment) {
      setChosenDepartment(false);
      return;
    }

    setChosenDepartment(true);
    onSetFormState(FormSubmissionState.SUBMITTING);

    let result: {message: string; data: Student};
    let studentToCreate: UserToCreate = {
      ...value,
      departmentId: selectedDepartment!.id!.toString()
    }
    
    try {
      if (!selectedItem) {
        result = await post("/api/students", studentToCreate);
      }
      else {
        result = await put(`/api/students/${selectedItem.user.id}`, studentToCreate);
        onHideModal();
      }

      onSave(result.data);
      setAlertSuccessState(result.message, onSetAlertResponse);
      setSelectedDepartment(undefined);
      formik.resetForm();
    }
    catch(error) {
      setAlertErrorState(error, onSetAlertResponse);
    }

    onSetFormState(FormSubmissionState.DONE);
    setAlertResolverTimer();
  }


  async function handleDeleteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedItem) {
      return;
    }

    onSetFormState(FormSubmissionState.SUBMITTING);

    try {
      const result = await destroy(`/api/students/${selectedItem.user.id}`);
      setAlertSuccessState(result.message, onSetAlertResponse);
      onRemoveStudent(selectedItem.user.id!);
      onHideModal();
    }
    catch(error) {
      setAlertErrorState(error, onSetAlertResponse);
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
          <FormGroup className="mb-4">
            <Label>Name</Label>
            <FormControl type="text" placeholder="Enter first and last name" id="full_name"
              {...formik.getFieldProps("name")} hasError={!!formik.errors.name && formik.touched.name}/>
              {(formik.errors.name && formik.touched.name) && <FormControlError errorMessage={formik.errors.name} />}
          </FormGroup>
          <FormGroup className="mb-4">
            <Label>Email address</Label>
            <FormControl type="email" placeholder="Eg. johndoe@gmail.com" id="email"
              {...formik.getFieldProps("email")} hasError={!!formik.errors.email && formik.touched.email} />
            {(formik.errors.email && formik.touched.email) && <FormControlError errorMessage={formik.errors.email} />}
          </FormGroup>
          <FormGroup className="mb-4">
            <Label>Phone number</Label>
            <FormControl type="text" placeholder="(000) 000-0000" id="phone_number"
              {...formik.getFieldProps("phoneNumber")} hasError={!!formik.errors.phoneNumber && formik.touched.phoneNumber}/>
            {(formik.errors.phoneNumber && formik.touched.phoneNumber) && <FormControlError errorMessage={formik.errors.phoneNumber} />}
          </FormGroup>
          <FormGroup className="mb-4">
            <Label>Department</Label>
            <MultiSelect 
              placeholder="Select department" 
              items={departments} 
              onSelecteItem={handleSelectedDepartment} 
              selectedItem={selectedDepartment}
              hasError={chosenDepartment} />
            {!chosenDepartment && <FormControlError errorMessage="Department is required" />}
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
          <p className="mb-4">Are you sure you want to delete {selectedItem?.user.name}? Please remember that this action cannot be undone.</p>
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
  )
}