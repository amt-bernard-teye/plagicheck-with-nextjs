"use client";

import { useFormik } from "formik";
import { useRef, useState } from "react";

import Button from "../atoms/button";
import FormControl from "../atoms/form-control";
import FormGroup from "../atoms/form-group";
import Heading from "../atoms/heading";
import Label from "../atoms/label";
import { AlertResponse } from "@/lib/types/alert-response.type";
import Alert from "../molecules/alert";
import { StatusCode } from "@/lib/enum/status-code";
import { passwordValidationSchema } from "@/lib/validation/account-setting.validation";
import FormControlError from "../atoms/form-control-error";
import { post } from "@/lib/util/http-request";

type FormValues = {
  currentPassword: string; 
  newPassword: string; 
  confirmPassword: string;
};

export default function ChangePassword() {
  const timerRef = useRef<NodeJS.Timeout>();
  const [alertResponse, setAlertResponse] = useState<AlertResponse>();
  const [formSubmissionState, setFormSubmissionState] = useState<"pending" | "submitting" | "done">("pending");
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    validationSchema: passwordValidationSchema,
    onSubmit: handleSubmit
  });


  async function handleSubmit(values: FormValues) {
    try {
      const result = await post("/api/users/password", values);
      setAlertResponse({
        message: result.message,
        status: StatusCode.SUCCESS
      });
      formik.resetForm();
    }
    catch(error) {
      let message = error instanceof Error ? error.message : "Something went wrong";
      setAlertResponse({
        message,
        status: StatusCode.BAD_REQUEST
      });
    }
    finally {
      setFormSubmissionState("done");
    }

    timerRef.current = setTimeout(() => {
      setFormSubmissionState("pending");
    }, 2000);
  }


  return (
    <>
      <div className="w-full md:w-[447px] lg:mx-10 xl:mx-14">
        <Heading>Password</Heading>
        <p className="mb-4 opacity-65 mt-1">Please enter your current password to change your password</p>
        <hr className="bg-[#BCBCC0] mb-8" />

        <form onSubmit={formik.handleSubmit}>
          <FormGroup className="mb-8">
            <Label htmlFor="currentPassword" className="mb-1 inline-block">Current Password</Label>
            <FormControl type="password" id="currentPassword" placeholder="Enter your current password"
              {...formik.getFieldProps("currentPassword")}
              hasError={!!formik.errors.currentPassword && formik.touched.currentPassword} />
            {(formik.errors.currentPassword && formik.touched.currentPassword) && <FormControlError errorMessage={formik.errors.currentPassword} />}
          </FormGroup>
          <FormGroup className="mb-8">
            <Label htmlFor="new_password" className="mb-1 inline-block">New Password</Label>
            <FormControl type="password" id="new_password" placeholder="Enter your new password"
              {...formik.getFieldProps("newPassword")}
              hasError={!!formik.errors.newPassword && formik.touched.newPassword}/>
            <small className="inline-block text-slate-500">Must be alpha-numeric and must be more than 8 characters</small><br />
            {(formik.errors.newPassword && formik.touched.newPassword) && <FormControlError errorMessage={formik.errors.newPassword} />}
          </FormGroup>
          <FormGroup className="mb-14">
            <Label htmlFor="confirm_password" className="mb-1 inline-block">Confirm Password</Label>
            <FormControl type="password" id="confirm_password" placeholder="Confirm your new password"
              {...formik.getFieldProps("confirmPassword")}
              hasError={!!formik.errors.confirmPassword && formik.touched.confirmPassword}/>
            {(formik.errors.confirmPassword && formik.touched.confirmPassword) && <FormControlError errorMessage={formik.errors.confirmPassword} />}
          </FormGroup>

          <div className="flex gap-4 w-full md:gap-[10px]">
            <div className="basis-[50%] flex flex-col">
              <Button el="button" variant="secondary" type="button">Cancel</Button>
            </div>
            <div className="basis-[50%] flex flex-col">
              <Button el="button" variant="primary" type="submit" disabled={formSubmissionState !== "pending"}>
                {formSubmissionState === "pending" ? 'Save changes' : 'Loading...'}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {(formSubmissionState === "done" && alertResponse) && (
        <Alert
          message={alertResponse.message}
          variant={alertResponse.status === StatusCode.SUCCESS ? "success" : "error"} />
      )}
    </>
  );
}