import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

import Auth from "@/components/layouts/auth/Auth";
import FormGroup from "@/components/atoms/form-group/form-group";
import Label from "@/components/atoms/label/label";
import FormControl from "@/components/molecules/form-control/form-control";
import Button from "@/components/atoms/button/button";
import PasswordToggler from "@/components/molecules/password-toggler/password-toggler";
import SMSTracking from "@/components/atoms/icons/sms-tracking";
import Lock from "@/components/atoms/icons/lock";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);

  function togglePasswordVisibility() {
    setShowPassword(prevState => !prevState);
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
        <form>
          <FormGroup className="mb-2">
            <Label htmlFor="username">Username</Label>
            <FormControl placeholder="Your email or staff ID" type="email"
              leftIcon={<SMSTracking />}/>
          </FormGroup>
          <FormGroup className="mb-2">
            <Label htmlFor="password">Password</Label>
            <FormControl 
              placeholder="Type your password here" 
              type={showPassword ? "text" : "password"}
              leftIcon={<Lock />}>
              <PasswordToggler onToggle={togglePasswordVisibility} state={showPassword}/>
            </FormControl>
          </FormGroup>
          <div className="flex justify-content-between mb-2">
            <Label>
              <input type="checkbox" /> Remember me
            </Label>
            <Link href="/forgot-password" className="link">Forgot password?</Link>
          </div>
          <div className="flex flex-column">
            <Button variant="primary">Login</Button>
          </div>
        </form>
      </Auth>
    </>
  );
}
