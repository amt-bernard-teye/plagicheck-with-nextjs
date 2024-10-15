"use client";

import Image from "next/image";
import Heading from "../atoms/heading";
import profile from "@/public/profile.jpg";
import Camera from "../atoms/icons/camera";
import { useRef } from "react";
import FormGroup from "../atoms/form-group";
import Label from "../atoms/label";
import FormControl from "../atoms/form-control";
import Button from "../atoms/button";

export default function PersonalInformation() {
  const fileUploader = useRef<HTMLInputElement>(null);

  return (
    <>
      <Heading>Personal Information</Heading>
      <div className="flex items-center gap-6 mt-9 mb-10">
        <div className="w-[114px] h-[114px] shadow-md rounded-full border relative">
          <Image src={profile} alt="Profile image" className="w-full h-full object-cover rounded-full" />
          <button 
            className="w-[40px] h-[40px] absolute bottom-0 right-0 flex justify-center items-center bg-[#CCD3E0] rounded-full camera border-2 border-[#fff]"
            onClick={() => fileUploader.current?.click()}>
            <Camera />
          </button>
          <input type="file" hidden ref={fileUploader} accept="image/*"/>
        </div>
        <div className="space-y-2">
          <Heading>Esther Howard</Heading>
          <p className="opacity-50">Staff ID: 1234</p>
        </div>
      </div>

      <form>
        <div className="mb-7 md:flex md:justify-between gap-4 2xl:gap-0 2xl:w-[852px]">
          <div className="basis-full mb-4 md:md-0 md:basis-[368px]">
            <FormGroup className="mb-7">
              <Label htmlFor="first_name" className="mb-1 inline-block">First name</Label>
              <FormControl type="text" id="first_name" placeholder="Enter first name" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email" className="mb-1 inline-block">Email address</Label>
              <FormControl type="email" id="email" placeholder="Eg. example45@gmail.com" />
            </FormGroup>
          </div>

          <div className="basis-full md:basis-[368px]">
            <FormGroup className="mb-7">
              <Label htmlFor="last_name" className="mb-1 inline-block">Last name</Label>
              <FormControl type="text" id="last_name" placeholder="Enter last name" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="phone" className="mb-1 inline-block">Phone</Label>
              <FormControl type="text" id="phone" placeholder="(603) 555-0123"/>
            </FormGroup>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-[368px] md:gap-7">
          <div className="basis-[50%] flex flex-col">
            <Button el="button" variant="secondary" type="button">Cancel</Button>
          </div>
          <div className="basis-[50%] flex flex-col">
            <Button el="button" variant="primary" type="submit">Save changes</Button>
          </div>
        </div>
      </form>
    </>
  );
}