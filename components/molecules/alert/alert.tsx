import styles from "./alert.module.css";
import { archivo } from "@/lib/utils/font";
import CloseCircle from "@/components/atoms/icons/close-circle";
import CheckCircle from "@/components/atoms/icons/check-circle";
import { AlertVariant } from "@/lib/enums/alert-variant";
import CloseButton from "@/components/atoms/close-button/close-button";

type AlertProps = {
  details: {
    variant: AlertVariant;
    message: string;
  }
  onToggle?: () => void;
}

export default function Alert({details, onToggle}: AlertProps) {
  let { variant, message } = details;
  let variantClass = variant === "error" ? styles.alertError : styles.alertSuccess;

  return (
    <div className={`${styles.alert} ${variantClass} ${archivo.className}`}>
      <div className="flex gap-2 align-items-center">
        { variant === "error" 
          ? <CloseCircle /> 
          : <CheckCircle /> }
        <p>{ message }</p>
      </div>
      <CloseButton />
    </div>
  );
}