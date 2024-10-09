"use client";

import { useState } from "react";

import FormControl from "../../atoms/form-control";
import FormGroup from "../../atoms/form-group";
import EyeSlash from "../../atoms/icons/eye-slash";
import Eye from "@/components/atoms/icons/eye";
import Lock from "../../atoms/icons/lock";
import Label from "../../atoms/label";
import Button from "../../atoms/button";

export default function ResetPasswordForm() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setSetConfirmPassword] = useState(false);

  return (
    <form>
      <FormGroup className="space-y-1 mb-4">
        <Label>New Password</Label>
        <FormControl
          leftIcon={<Lock />}
          type={showNewPassword ? "text" : "password"}
          placeholder="Type your new password">
          <button onClick={() => setShowNewPassword(!showNewPassword)} type="button">
            {showNewPassword ? <EyeSlash/> : <Eye />}
          </button>
        </FormControl>
      </FormGroup>
      <FormGroup className="space-y-1 mb-4">
        <Label>Confirm Password</Label>
        <FormControl
          leftIcon={<Lock />}
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm your password">
          <button onClick={() => setSetConfirmPassword(!showConfirmPassword)} type="button">
            {showConfirmPassword ? <EyeSlash/> : <Eye />}
          </button>
        </FormControl>
      </FormGroup>
      <div className="flex flex-col">
        <Button el="button" variant="primary">Save new password</Button>
      </div>
    </form>
  )
}