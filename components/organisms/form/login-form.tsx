"use client";

import Link from "next/link";

import FormControl from "../../atoms/form-control";
import FormGroup from "../../atoms/form-group";
import EyeSlash from "../../atoms/icons/eye-slash";
import Lock from "../../atoms/icons/lock";
import SMSTracking from "../../atoms/icons/sms-tracking";
import Label from "../../atoms/label";
import Button from "../../atoms/button";

export default function LoginForm() {
  return (
    <form>
      <FormGroup className="space-y-1 mb-4">
        <Label>Email/Staff ID</Label>
        <FormControl
          leftIcon={<SMSTracking />}
          type="email"
          placeholder="Your email or staff ID" />
      </FormGroup>
      <FormGroup className="space-y-1">
        <Label>Password</Label>
        <FormControl
          leftIcon={<Lock />}
          type="password"
          placeholder="Type your password here">
          <button>
            <EyeSlash />
          </button>
        </FormControl>
      </FormGroup>
      <div className="flex justify-between my-4">
        <Label className="flex gap-2 items-center">
          <input type="checkbox" /> Remember me
        </Label>
        <Link href="/forgot-password" className="text-[#0267ff] hover:underline">Forgot password?</Link>
      </div>
      <div className="flex flex-col">
        <Button el="button" variant="primary">Login</Button>
      </div>
    </form>
  )
}