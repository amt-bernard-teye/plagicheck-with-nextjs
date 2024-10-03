import GoBack, { GoBackProps } from "@/components/molecules/go-back/go-back";
import SubHeader from "../sub-header/sub-header";
import styles from "./bulk-upload.module.css";
import Button from "@/components/atoms/button/button";
import { ChangeEvent, useRef, useState } from "react";
import { AlertVariant } from "@/lib/enums/alert-variant";
import { StatusCode } from "@/lib/enums/status-code";
import { create } from "@/lib/utils/make-request";
import { UploadButton } from "@/lib/utils/uploadthing-frontend";
import Spinner from "@/components/atoms/spinner/spinner";

type BulkUploadProps = {
  entity: "Lecturers" | "Students";
  onSetAlert: (message: string, variant: AlertVariant) => void;
} & GoBackProps;

export default function BulkUpload({entity, onReturn, onSetAlert}: BulkUploadProps) {
  const [submitting, setSubmitting] = useState(false);
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);


  async function handleTemplateDownload() {
    let bulkEntity = entity === "Lecturers" ? "LECTURERS" : "STUDENTS";
    
    try {
      const response = await fetch(`/api/users/bulk?entity=${bulkEntity}`);

      if (response.status !== StatusCode.SUCCESS) {
        const result = await response.json();
        throw new Error(result.message);
      }

      const blob = await response.blob();
      const file = URL.createObjectURL(blob);
      window.location.assign(file);
    }
    catch(error) {
      if (error instanceof Error) {
        onSetAlert(error.message || "Something went wrong", AlertVariant.ERROR);
      }
    }
  }


  function handleImageSelection(event: ChangeEvent<HTMLInputElement>) {
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
    setSubmitting(true);

    try {
      const response = await fetch(`/api/${entity.toLowerCase()}/bulk`, {
        method: "POST",
        body: JSON.stringify(value),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();

      if (response.status !== StatusCode.SUCCESS) {
        throw new Error(result.message);
      }

      onSetAlert(result.message, AlertVariant.SUCCESS);
    }
    catch(error) {
      if (error instanceof Error) {
        onSetAlert(error.message || "Something went wrong", AlertVariant.ERROR);
      }
    }
    finally {
      setSubmitting(false);
    }
  }


  return (
    <>
      <SubHeader 
        title="Bulk upload"
        description={`Add ${entity} in bulk here`}/>

      <div className="section-padding">
        <GoBack onReturn={onReturn}/>
        <div className={styles.content}>
          <h2 className={styles.contentHeading}>Bulk Upload For {entity}</h2>
          <h3 className={styles.contentSubHeading}>Instructions</h3>
          <ol className={styles.list}>
            <li>Download the CSV template</li>
            <li>Fill in the required information in the following format: Name (First name and last name), Email address, Phone number, Department{entity === "Lecturers" && ', Qualification'}</li>
            <li>Upload the completed CSV file</li>
          </ol>

          <div style={{marginBottom: "85px"}}>
            <h3 className={styles.contentSubHeading}>Download CSV Template</h3>
            <p className="mb-2">Download the CSV template to fill in the required information for bulk upload.</p>
            <Button 
              variant="secondary"
              onClick={handleTemplateDownload}>Download Template</Button>
          </div>

          <div style={{marginBottom: "85px"}}>
            <h3 className={styles.contentSubHeading}>Upload CSV File</h3>
            <p className="mb-2">Choose a CSV file from your computer to initiate the bulk upload process.</p>
            <div className="flex align-items-center gap-1">
              <Button 
                variant="primary"
                disabled={submitting}
                onClick={() => fileUploadRef.current?.click()}>Browse</Button>
              {submitting && <Spinner />}
              <form ref={formRef}>
                <input 
                  type="file" 
                  hidden 
                  ref={fileUploadRef} 
                  accept="text/csv"
                  onChange={handleImageSelection} />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}