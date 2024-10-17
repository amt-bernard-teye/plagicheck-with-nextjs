"use client";

import { useRef, useState } from "react";
import { useFormik } from "formik";

import FormGroup from "@/components/atoms/form-group";
import Label from "@/components/atoms/label";
import FormControl from "@/components/atoms/form-control";
import FormControlError from "@/components/atoms/form-control-error";
import Button from "@/components/atoms/button";
import { facultyValidationSchema } from "@/lib/validation/academic-divisition.validation";
import { StatusCode } from "@/lib/enum/status-code";
import { post } from "@/lib/util/http-request";

type FacultyFormProps = {
  onSetAlertResponse: (value: {message: string, status: StatusCode}) => void;
  onSetFormState: (message: "pending" | "done" | "submitting") => void;
}

export default function FacultyForm({onSetAlertResponse, onSetFormState}: FacultyFormProps) {
  const timerRef = useRef<NodeJS.Timeout>();
  const formik = useFormik({
    initialValues: {
      name: ""
    },
    validationSchema: facultyValidationSchema,
    onSubmit: handleSubmit
  });


  async function handleSubmit(values: {name: string}) {
    try {
      const result = await post("/api/faculties", values);
      onSetAlertResponse({
        message: result.message,
        status: StatusCode.SUCCESS
      });
      formik.resetForm();
    }
    catch(error) {
      let message = error instanceof Error ? error.message : "Something went wrong";
      onSetAlertResponse({
        message,
        status: StatusCode.BAD_REQUEST
      });
    }
    finally {
      onSetFormState("done");
    }

    timerRef.current = setTimeout(() => {
      onSetFormState("pending");
    }, 2000);
  }


  return (
    <form onSubmit={formik.handleSubmit}>
      {/* {isEditOrAdd ? ( */}
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
              <Button el="button" variant="secondary" type="button">Cancel</Button>
            </div>
            <div className="basis-[50%] flex flex-col">
              <Button el="button" variant="primary" type="submit">Add</Button>
            </div>
          </div>
        </>
      {/* ) : (
        <>
          <p className="line-height-24">Are you sure you want to delete this faculty? This action will remove all departments associated with this faculty, and it cannot be undone</p>
          <div className="flex gap-2 mt-2">
            <div className="col-6 flex flex-column">
              <Button el="button" variant="secondary" type="button">Cancel</Button>
            </div>
            <div className="col-6 flex flex-column">
              <Button el="button" variant="danger" type="submit">Yes delete</Button>
            </div>
          </div>
        </>
      )} */}
    </form>
  );
}