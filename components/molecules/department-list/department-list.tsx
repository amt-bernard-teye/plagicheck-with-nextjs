import { useState } from "react";

import PencilEdit from "@/components/atoms/icons/pencil-edit";
import styles from "./department-list.module.css";
import TrashCan from "@/components/atoms/icons/trash-can";

export default function DepartmentList() {
  const [ showMainList, setShowMainList ] = useState(false);

  return (
    <div className={styles.list}>
      <span className={styles.listItem}>Civil eng</span>
      <span className={styles.listItem}>Civil eng</span>
      <button className={styles.action} onClick={() => setShowMainList(!showMainList)}>+2</button>
      <div className={styles.actualList}>
        {showMainList && (
          <div className={styles.row}>
            <div className={styles.col}>
              <span>Business department</span>
              <div className={styles.actions}>
                <button className={`${styles.actionItem} ${styles.editAction}`}>
                  <PencilEdit />
                </button>
                <button className={`${styles.actionItem} ${styles.dangerAction}`}>
                  <TrashCan />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}