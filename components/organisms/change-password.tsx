"use client";

import Button from "../atoms/button";
import FormControl from "../atoms/form-control";
import FormGroup from "../atoms/form-group";
import Heading from "../atoms/heading";
import Label from "../atoms/label";

export default function ChangePassword() {
  return (
    <>
      <div className="w-full md:w-[447px] lg:mx-10 xl:mx-14">
        <Heading>Password</Heading>
        <p className="mb-4 opacity-65 mt-1">Please enter your current password to change your password</p>
        <hr className="bg-[#BCBCC0] mb-8" />

        <form>
          <FormGroup className="mb-8">
            <Label htmlFor="current_password" className="mb-1 inline-block">Current Password</Label>
            <FormControl type="password" id="current_password" placeholder="Enter your current password"/>
          </FormGroup>
          <FormGroup className="mb-8">
            <Label htmlFor="new_password" className="mb-1 inline-block">New Password</Label>
            <FormControl type="password" id="new_password" placeholder="Enter your new password"/>
            <small className="inline-block text-slate-500">Must be alpha-numeric and must be more than 8 characters</small>
          </FormGroup>
          <FormGroup className="mb-14">
            <Label htmlFor="confirm_password" className="mb-1 inline-block">Confirm Password</Label>
            <FormControl type="password" id="confirm_password" placeholder="Confirm your new password"/>
          </FormGroup>

          <div className="flex gap-4 w-full md:gap-[10px]">
            <div className="basis-[50%] flex flex-col">
              <Button el="button" variant="secondary" type="button">Cancel</Button>
            </div>
            <div className="basis-[50%] flex flex-col">
              <Button el="button" variant="primary" type="submit">Save changes</Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}