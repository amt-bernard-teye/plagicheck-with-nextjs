import { ReactNode, useState } from "react";

import styles from "./datatable-actions.module.css";

type DataTableActionsProps = {
  children: ReactNode
}

export default function DataTableActions({ children }: DataTableActionsProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className={styles.actionHolder}>
      <button className={styles.actionController} onClick={() => setShowActions(!showActions)}>
        <i className="bi bi-three-dots-vertical"></i>
      </button>
      {showActions && (
        <div className={styles.actions}>
          { children }
        </div>
      )}
    </div>
  );
}