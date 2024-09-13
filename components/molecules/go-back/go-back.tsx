import ArrowLeft from "@/components/atoms/icons/arrow-left";
import styles from "./go-back.module.css";

export type GoBackProps = {
  onReturn: () => void;
}

export default function GoBack({onReturn}: GoBackProps) {
  return (
    <div className={styles.goBack}>
      <button className={styles.goBackBtn} onClick={onReturn}>
        <ArrowLeft /> Back
      </button>
    </div>
  );
}