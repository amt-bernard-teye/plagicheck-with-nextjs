"use client";

import { useRef, useState } from "react";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";

import FormControl from "../../atoms/form-control";
import FormGroup from "../../atoms/form-group";
import EyeSlash from "../../atoms/icons/eye-slash";
import Eye from "@/components/atoms/icons/eye";
import Lock from "../../atoms/icons/lock";
import Label from "../../atoms/label";
import Button from "../../atoms/button";
import { resetValidationSchema } from "@/lib/validation/reset-password.validation";
import FormControlError from "@/components/atoms/form-control-error";
import { useSubmitting } from "@/lib/hooks/use-submitting";
import { AlertResponse } from "@/lib/types/alert-response.type";
import Alert from "@/components/molecules/alert";
import { StatusCode } from "@/lib/enum/status-code";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formSubmissionState, setFormSubmissionState } = useSubmitting();
  const timerRef = useRef<NodeJS.Timeout>();
  const [alertResponse, setAlertResponse] = useState<AlertResponse>();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setSetConfirmPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: ""
    },
    validationSchema: resetValidationSchema,
    onSubmit: handleSubmit
  });


  async function handleSubmit(value: {newPassword: string; confirmPassword: string}) {
    setFormSubmissionState("submitting");

    const response = await fetch(`/api/auth/reset-password?token=${searchParams.get("token")}`, {
      method: "POST",
      body: JSON.stringify(value),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const result = await response.json();
    setAlertResponse(result);
    setFormSubmissionState("done");

    timerRef.current = setTimeout(() => {
      setFormSubmissionState("pending");
      router.replace("/");
    }, 2000);
  }


  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <FormGroup className="space-y-1 mb-4">
          <Label>New Password</Label>
          <FormControl
            leftIcon={<Lock />}
            type={showNewPassword ? "text" : "password"}
            placeholder="Type your new password"
            {...formik.getFieldProps("newPassword")}
            hasError={!!formik.errors.newPassword && formik.touched.newPassword!}>
            <button onClick={() => setShowNewPassword(!showNewPassword)} type="button">
              {showNewPassword ? <EyeSlash/> : <Eye />}
            </button>
          </FormControl>
          {(formik.errors.newPassword && formik.touched.newPassword) && <FormControlError errorMessage={formik.errors.newPassword} />}
        </FormGroup>
        <FormGroup className="space-y-1 mb-4">
          <Label>Confirm Password</Label>
          <FormControl
            leftIcon={<Lock />}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            {...formik.getFieldProps("confirmPassword")}
              hasError={!!formik.errors.confirmPassword && formik.touched.confirmPassword!}>
            <button onClick={() => setSetConfirmPassword(!showConfirmPassword)} type="button">
              {showConfirmPassword ? <EyeSlash/> : <Eye />}
            </button>
          </FormControl>
          {(formik.errors.confirmPassword && formik.touched.confirmPassword) && <FormControlError errorMessage={formik.errors.confirmPassword} />}
        </FormGroup>
        <div className="flex flex-col">
          <Button el="button" variant="primary" type="submit"
            disabled={formSubmissionState === "submitting"}>Save new password</Button>
        </div>
      </form>
    
      {(formSubmissionState === "done" && alertResponse) && (
        <Alert
          message={alertResponse.message}
          variant={alertResponse.status === StatusCode.SUCCESS ? "success" : "error"} />
      )}
    </>
  );
}