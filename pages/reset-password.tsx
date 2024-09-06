import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

import Auth from "@/components/layouts/auth/Auth";
import FormGroup from "@/components/atoms/form-group/form-group";
import Label from "@/components/atoms/label/label";
import FormControl from "@/components/molecules/form-control/form-control";
import Button from "@/components/atoms/button/button";
import ArrowLeft from "@/components/atoms/icons/arrow-left";
import PasswordToggle from "@/components/molecules/password-toggle/password-toggle";
import Lock from "@/components/atoms/icons/lock";
import { useAlert } from "@/lib/hooks/useAlert";
import Alert from "@/components/molecules/alert/alert";
import { AlertVariant } from "@/lib/enums/alert-variant";

export default function ResetPassword() {
  const { alertDetails, handleAlertDetails } = useAlert();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function togglePasswordVisibility(is: "password" | "confirmPassword") {
    if (is === "password") {
      setShowPassword(prevState => !prevState);
    } else {
      setShowConfirmPassword(prevState => !prevState);
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
        title="Reset Password"
        description="Please enter your new password to complete the reset process.">
        <form>
          <FormGroup className="mb-2">
            <Label htmlFor="password">New Password</Label>
            <FormControl placeholder="Type your new password" 
              type={showPassword ? "text" : "password"} id="password" leftIcon={<Lock />}>
              <PasswordToggle state={showPassword} 
                onToggle={() => togglePasswordVisibility("password")}/>
            </FormControl>
          </FormGroup>
          <FormGroup className="mb-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <FormControl placeholder="Confirm your password" 
              type={showConfirmPassword ? "text" : "password"} id="confirmPassword" leftIcon={<Lock />}>
              <PasswordToggle state={showConfirmPassword} 
                onToggle={() => togglePasswordVisibility("confirmPassword")}/>
            </FormControl>
          </FormGroup>
          <div className="flex flex-column gap-2">
            <Button variant="primary" type="submit">Save new password</Button>
            <Button variant="secondary">
              <ArrowLeft /> Back to login
            </Button>
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
