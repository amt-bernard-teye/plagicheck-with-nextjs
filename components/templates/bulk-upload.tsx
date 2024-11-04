"use client";

import { ChangeEvent, useRef, useState } from "react";

import GoBack, { GoBackProps } from "../molecules/go-back";
import SubHeader from "../molecules/sub-header";
import Button from "../atoms/button";
import { StatusCode } from "@/lib/enum/status-code";
import Spinner from "../atoms/spinner";
import { UserTabs } from "@/lib/enum/user-tab.enum";
import { AlertResponse } from "@/lib/types/alert-response.type";
import { post } from "@/lib/util/http-request";
import { FormSubmissionState } from "@/lib/enum/form-submission-state.enum";
import Alert from "../molecules/alert";
import { useFormStateTimer } from "@/lib/hooks/use-form-state-timer";

type BulkUploadProps = {
  entity: UserTabs;
} & GoBackProps;

export default function BulkUpload({entity, onReturn}: BulkUploadProps) {
  const [formSubmissionState, setFormSubmissionState] = useState<FormSubmissionState>(FormSubmissionState.PENDING);
  const { setAlertResolverTimer } = useFormStateTimer(setFormSubmissionState);
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [alertResponse, setAlertResponse] = useState<AlertResponse>();


  function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", onLoad);

    function onLoad(event: ProgressEvent<FileReader>) {
      let text = event.target?.result as string;
      let lines = text.split("\r\n");
      let rows = [];
      
      for (let line of lines) {
        const row = line.split(",").map(value => value.trim());
        rows.push(row);
      }

      sendFile(rows);
      formRef.current?.reset();
    }

    reader.readAsText(file);
  }


  async function sendFile(value: string[][]) {
    setFormSubmissionState(FormSubmissionState.SUBMITTING);

    try {
      const result = await post(`/api/${entity.toLowerCase()}s/bulk`, value);
      setAlertResponse({
        message: result.message, 
        status: StatusCode.SUCCESS
      });
    }
    catch(error) {
      let message = "";

      if (error instanceof Error) {
        message = error.message;
      }

      setAlertResponse({ message, status: StatusCode.BAD_REQUEST });
    }
    finally {
      setFormSubmissionState(FormSubmissionState.DONE);
    }

    setAlertResolverTimer();
  }


  let entityText = entity === UserTabs.LECTURER ? "Lecturers" : "Students";

  return (
    <>
      <SubHeader 
        title="Bulk upload"
        description={`Add ${entityText} in bulk here`}/>

      <div className="py-[15px] px-[21px] lg:py-[19px] lg:px-[41px]">
        <GoBack onReturn={onReturn}/>
        <div className="mt-[50px] md:w-[90%] lg:w-[80%] xl:w-[791px]">
          <h2 className="mb-[46px] text-[1.73em] font-semibold">Bulk Upload For {entityText}</h2>
          <h3 className="text-[1.44em] mb-2 font-semibold">Instructions</h3>
          <ol className="ml-5 mb-10 list-decimal">
            <li className="text-[1.1em]">Download the CSV template</li>
            <li className="text-[1.1em]">Fill in the required information in the following format: Name (First name and last name), Email address, Phone number, Department{entity === UserTabs.LECTURER && ', Qualification'}</li>
            <li className="text-[1.1em]">Upload the completed CSV file</li>
          </ol>

          <div className="mb-4 xl:mb-[55px] xl:mt-[55px]">
            <h3 className="text-[1.44em] mb-2 font-semibold">Download CSV Template</h3>
            <p className="mb-2 text-[1.1em]">Download the CSV template to fill in the required information for bulk upload.</p>
            <div className="w-[197px] flex flex-col">
              <Button el="link" 
                variant="secondary"
                href={entity as UserTabs === UserTabs.LECTURER ? '/bulk/lecturers.csv' : '/bulk/students.csv'}>Download Template</Button>
            </div>
          </div>

          <div className="mb-4 xl:mb-[55px]">
            <h3 className="text-[1.44em] mb-2 font-semibold">Upload CSV File</h3>
            <p className="mb-2 text-[1.1em]">Choose a CSV file from your computer to initiate the bulk upload process.</p>
            <div className="flex items-center gap-3">
              <div className="basis-[197px] flex flex-col">
                <Button el="button"
                  variant="primary"
                  disabled={formSubmissionState === FormSubmissionState.SUBMITTING}
                  onClick={() => fileUploadRef.current?.click()}>Browse</Button>  
              </div>
              {formSubmissionState === FormSubmissionState.SUBMITTING && <Spinner />}
              <form ref={formRef}>
                <input 
                  type="file" 
                  hidden 
                  ref={fileUploadRef} 
                  accept="text/csv"
                  onChange={handleFileSelection} />
              </form>
            </div>
          </div>
        </div>
      </div>

      {(formSubmissionState === FormSubmissionState.DONE && alertResponse) && (
        <Alert
          message={alertResponse.message}
          variant={alertResponse.status === StatusCode.SUCCESS ? "success" : "error"} />
      )}
    </>
  );
}