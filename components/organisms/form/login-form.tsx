"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";

import FormControl from "../../atoms/form-control";
import FormGroup from "../../atoms/form-group";
import EyeSlash from "../../atoms/icons/eye-slash";
import Lock from "../../atoms/icons/lock";
import SMSTracking from "../../atoms/icons/sms-tracking";
import Label from "../../atoms/label";
import Button from "../../atoms/button";
import Eye from "@/components/atoms/icons/eye";
import FormControlError from "@/components/atoms/form-control-error";
import { loginValidationSchema } from "@/lib/validation/login.validation";
import Alert from "@/components/molecules/alert";
import { StatusCode } from "@/lib/enum/status-code";
import { AlertResponse } from "@/lib/types/alert-response.type";

export default function LoginForm() {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout>();
  const [alertResponse, setAlertResponse] = useState<AlertResponse>();
  const [formSubmissionState, setFormSubmissionState] = useState<"pending" | "submitting" | "done">("pending");
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: ""
    },
    validationSchema: loginValidationSchema,
    onSubmit: handleSubmit
  });


  async function handleSubmit(value: {username: string, password: string}) {
    setFormSubmissionState("submitting");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const response = await fetch("/api/auth/login", {
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
      if (result.status === StatusCode.SUCCESS) {
        router.push("/dashboard");
      }
  
      setFormSubmissionState("pending");
    }, 2000);
  }


  return (
    <>
      <form onSubmit={formik.handleSubmit} method="POST">
        <FormGroup className="space-y-1 mb-4">
          <Label>Email/Staff ID</Label>
          <FormControl
            leftIcon={<SMSTracking />}
            type="text"
            placeholder="Your email or staff ID"
            {...formik.getFieldProps("username")}
            hasError={!!formik.errors.username && formik.touched.username!} />
          {(formik.errors.username && formik.touched.username) && <FormControlError errorMessage={formik.errors.username} />}
        </FormGroup>
        <FormGroup className="space-y-1">
          <Label>Password</Label>
          <FormControl
            leftIcon={<Lock />}
            type={showPassword ? "text" : "password"}
            placeholder="Type your password here"
            {...formik.getFieldProps("password")}
            hasError={!!formik.errors.password && formik.touched.password!}>
            <button onClick={() => setShowPassword(!showPassword)} type="button">
              {showPassword ? <EyeSlash/> : <Eye />}
            </button>
          </FormControl>
          {(formik.errors.password && formik.touched.password) && <FormControlError errorMessage={formik.errors.password} />}
        </FormGroup>
        <div className="flex justify-between my-4">
          <Label className="flex gap-2 items-center">
            <input type="checkbox" /> Remember me
          </Label>
          <Link href="/forgot-password" className="text-[#0267ff] hover:underline">Forgot password?</Link>
        </div>
        <div className="flex flex-col">
          <Button el="button" variant="primary" type="submit"
            disabled={formSubmissionState === "submitting"}>Login</Button>
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