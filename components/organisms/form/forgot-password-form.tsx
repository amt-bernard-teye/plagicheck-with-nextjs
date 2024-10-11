"use client";

import { useFormik } from "formik";

import Button from "@/components/atoms/button";
import FormControl from "@/components/atoms/form-control";
import FormGroup from "@/components/atoms/form-group";
import ArrowLeft from "@/components/atoms/icons/arrow-left";
import SMSTracking from "@/components/atoms/icons/sms-tracking";
import Label from "@/components/atoms/label";
import { forgotPasswordValidationSchema } from "@/lib/validation/forgot-password.validation";
import FormControlError from "@/components/atoms/form-control-error";
import { useSubmitting } from "@/lib/hooks/use-submitting";
import { useRef, useState } from "react";
import { AlertResponse } from "@/lib/types/alert-response.type";
import { StatusCode } from "@/lib/enum/status-code";
import { useRouter } from "next/navigation";
import Alert from "@/components/molecules/alert";

export default function ForgotPasswordForm() {
  const timerRef = useRef<NodeJS.Timeout>();
  const router = useRouter();
  const { formSubmissionState, setFormSubmissionState } = useSubmitting();
  const [alertResponse, setAlertResponse] = useState<AlertResponse>();
  const formik = useFormik({
    initialValues: {
      email: ""
    },
    validationSchema: forgotPasswordValidationSchema,
    onSubmit: handleSubmit
  });


  async function handleSubmit(value: {email: string}) {
    setFormSubmissionState("submitting");

    const response = await fetch("/api/auth/forgot-password", {
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
    }, 2000);
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <FormGroup className="space-y-1 my-4">
          <Label>Email</Label>
          <FormControl
            leftIcon={<SMSTracking />}
            type="email"
            placeholder="Your email"
            {...formik.getFieldProps("email")}
            hasError={!!formik.errors.email && formik.touched.email!} />
          {(formik.errors.email && formik.touched.email) && <FormControlError errorMessage={formik.errors.email} />}
        </FormGroup>
        <div className="flex flex-col gap-4">
          <Button el="button" variant="primary" type="submit">Send reset link</Button>
          <Button el="link" variant="secondary" href="/">
            <ArrowLeft/> Back to login
          </Button>
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