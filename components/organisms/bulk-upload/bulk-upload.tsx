import GoBack, { GoBackProps } from "@/components/molecules/go-back/go-back";
import SubHeader from "../sub-header/sub-header";
import styles from "./bulk-upload.module.css";
import Button from "@/components/atoms/button/button";

type BulkUploadProps = {
  entity: "Lecturers" | "Students"
} & GoBackProps;

export default function BulkUpload({entity, onReturn}: BulkUploadProps) {
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
            <Button variant="secondary">Download Template</Button>
          </div>

          <div style={{marginBottom: "85px"}}>
            <h3 className={styles.contentSubHeading}>Upload CSV File</h3>
            <p className="mb-2">Choose a CSV file from your computer to initiate the bulk upload process.</p>
            <Button variant="primary">Browse</Button>
          </div>
        </div>

      </div>
    </>
  );
}