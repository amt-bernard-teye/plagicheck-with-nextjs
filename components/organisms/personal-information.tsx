"use client";

import { useRef, useState } from "react";
import { useFormik } from "formik";

import Image from "next/image";
import Heading from "../atoms/heading";
import Camera from "../atoms/icons/camera";
import FormGroup from "../atoms/form-group";
import Label from "../atoms/label";
import FormControl from "../atoms/form-control";
import Button from "../atoms/button";
import FormControlError from "../atoms/form-control-error";
import { personalValidationSchema } from "@/lib/validation/account-setting.validation";
import { post } from "@/lib/util/http-request";
import Alert from "../molecules/alert";
import { AlertResponse } from "@/lib/types/alert-response.type";
import { StatusCode } from "@/lib/enum/status-code";
import Person from "../atoms/icons/person";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

type PersonalInformationProps = {
  id: string;
  name: string;
  imagePath: string;
}

export default function PersonalInformation({id, name, imagePath}: PersonalInformationProps) {
  const timerRef = useRef<NodeJS.Timeout>();
  const [alertResponse, setAlertResponse] = useState<AlertResponse>();
  const [formSubmissionState, setFormSubmissionState] = useState<"pending" | "submitting" | "done">("pending");
  const fileUploader = useRef<HTMLInputElement>(null);
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: ""
    },
    validationSchema: personalValidationSchema,
    onSubmit: handleSubmit
  });


  async function handleSubmit(values: FormValues) {
    setFormSubmissionState("submitting");

    try {
      const result = await post("/api/users/personal", values);
      setAlertResponse({
        message: result.message,
        status: StatusCode.SUCCESS
      });
      formik.resetForm();
    }
    catch(error) {
      let message = error instanceof Error ? error.message : "Something went wrong";
      setAlertResponse({
        message,
        status: StatusCode.BAD_REQUEST
      });
    }
    finally {
      setFormSubmissionState("done");
    }

    timerRef.current = setTimeout(() => {
      setFormSubmissionState("pending");
    }, 2000);
  }


  return (
    <>
      <Heading>Personal Information</Heading>
      <div className="flex items-center gap-6 mt-9 mb-10">
        <div className="w-[114px] h-[114px] shadow-md rounded-full border relative">
          {imagePath 
            ? (
                <div className="relative w-full h-full">
                  <Image src={imagePath} alt="Profile image" className="w-full h-full object-cover rounded-full" priority fill/>
                </div>
              )
            : <div className="w-full h-full flex justify-center items-center rounded-full profile"><Person /></div>
          }
          <button
            className="w-[40px] h-[40px] absolute bottom-0 right-0 flex justify-center items-center bg-[#CCD3E0] rounded-full camera border-2 border-[#fff]"
            onClick={() => fileUploader.current?.click()}>
            <Camera />
          </button>
          <input type="file" hidden ref={fileUploader} accept="image/*"/>
        </div>
        <div className="space-y-2">
          <Heading>{name}</Heading>
          <p className="opacity-50">Staff ID: {id}</p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="mb-7 md:flex md:justify-between gap-4 2xl:gap-0 2xl:w-[852px]">
          <div className="basis-full mb-4 md:md-0 md:basis-[368px]">
            <FormGroup className="mb-7">
              <Label htmlFor="firstName" className="mb-1 inline-block">First name</Label>
              <FormControl type="text" id="firstName" placeholder="Enter first name"
                {...formik.getFieldProps("firstName")}
                hasError={!!formik.errors.firstName && formik.touched.firstName} />
              {(formik.errors.firstName && formik.touched.firstName) && <FormControlError errorMessage={formik.errors.firstName} />}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email" className="mb-1 inline-block">Email address</Label>
              <FormControl type="email" id="email" placeholder="Eg. example45@gmail.com"
                {...formik.getFieldProps("email")}
                hasError={!!formik.errors.email && formik.touched.email} />
              {(formik.errors.email && formik.touched.email) && <FormControlError errorMessage={formik.errors.email} />}
            </FormGroup>
          </div>

          <div className="basis-full md:basis-[368px]">
            <FormGroup className="mb-7">
              <Label htmlFor="last_name" className="mb-1 inline-block">Last name</Label>
              <FormControl type="text" id="last_name" placeholder="Enter last name"
                {...formik.getFieldProps("lastName")}
                hasError={!!formik.errors.lastName && formik.touched.lastName} />
              {(formik.errors.lastName && formik.touched.lastName) && <FormControlError errorMessage={formik.errors.lastName} />}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="phone" className="mb-1 inline-block">Phone</Label>
              <FormControl type="text" id="phone" placeholder="(603) 555-0123"
                {...formik.getFieldProps("phone")}
                hasError={!!formik.errors.phone && formik.touched.phone}/>
              {(formik.errors.phone && formik.touched.phone) && <FormControlError errorMessage={formik.errors.phone} />}
            </FormGroup>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-[368px] md:gap-7">
          <div className="basis-[50%] flex flex-col">
            <Button el="button" variant="secondary" type="button">Cancel</Button>
          </div>
          <div className="basis-[50%] flex flex-col">
            <Button el="button" variant="primary" type="submit" disabled={formSubmissionState !== "pending"}>
              {formSubmissionState === "pending" ? 'Save changes' : 'Loading...'}
            </Button>
          </div>
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