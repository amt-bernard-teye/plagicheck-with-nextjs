import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";

import Auth from "@/components/layouts/auth/Auth";
import FormGroup from "@/components/atoms/form-group/form-group";
import Label from "@/components/atoms/label/label";
import FormControl from "@/components/molecules/form-control/form-control";
import Button from "@/components/atoms/button/button";
import PasswordToggle from "@/components/molecules/password-toggle/password-toggle";
import SMSTracking from "@/components/atoms/icons/sms-tracking";
import Lock from "@/components/atoms/icons/lock";
import Alert from "@/components/molecules/alert/alert";
import { AlertVariant } from "@/lib/enums/alert-variant";
import { useAlert } from "@/lib/hooks/useAlert";
import InputError from "@/components/atoms/input-error/input-error";
import { login } from "@/lib/api/auth";

export default function Home() {
  const router = useRouter();
  const { alertDetails, handleAlertDetails } = useAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: ""
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Email/Staff ID is required"),
      password: Yup.string().required("Password is required")
    }),
    onSubmit: handleSubmit
  });

  
  function togglePasswordVisibility() {
    setShowPassword(prevState => !prevState);
  }

  
  async function handleSubmit(values: {username: string; password: string}) {
    setIsSubmitting(true);

    try {
      const result = await login(values);
      handleAlertDetails(result.message, AlertVariant.SUCCESS);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
    catch(error: any) {
      handleAlertDetails(error.message, AlertVariant.ERROR);
    }
    finally {
      setIsSubmitting(false);
    }
  }


  return (
    <>
      <Head>
        <title>Plagiarism Checker</title>
        <meta name="description" content="Plagiarism Checker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Head>
      <Auth 
        title="Login"
        description="Please enter your login details below to access your account">
        <form onSubmit={formik.handleSubmit}>
          <FormGroup className="mb-2">
            <Label htmlFor="username">Email/Staff ID</Label>
            <FormControl 
              hasError={!!formik.errors.username && formik.touched.username!}
              placeholder="Your email or staff ID" type="text"
              leftIcon={<SMSTracking />} {...formik.getFieldProps("username")}/>
            {(formik.errors.username && formik.touched.username) && <InputError message={formik.errors.username} />}
          </FormGroup>
          <FormGroup className="mb-2">
            <Label htmlFor="password">Password</Label>
            <FormControl 
              hasError={!!formik.errors.password && formik.touched.password!}
              placeholder="Type your password here" 
              type={showPassword ? "text" : "password"}
              leftIcon={<Lock />} {...formik.getFieldProps("password")}>
              <PasswordToggle state={showPassword} onToggle={togglePasswordVisibility}/>
            </FormControl>
            {(formik.errors.password && formik.touched.password) && <InputError message={formik.errors.password} />}
          </FormGroup>
          <div className="flex justify-content-between mb-2">
            <Label>
              <input type="checkbox" /> Remember me
            </Label>
            <Link href="/forgot-password" className="link">Forgot password?</Link>
          </div>
          <div className="flex flex-column">
            <Button variant="primary" type="submit"
              disabled={(!formik.values.username || !formik.values.password) || isSubmitting}>Login</Button>
          </div>
        </form>
      </Auth>

      {alertDetails.message && (
        <Alert 
          details={alertDetails}
          onToggle={() => handleAlertDetails("", AlertVariant.SUCCESS)}/>
      )}
    </>
  );
}
