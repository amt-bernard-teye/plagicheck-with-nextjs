import { PropsWithChildren } from "react";

import styles from "./datatable.module.css";

type DataTableProps = PropsWithChildren<{
  columnHeadings: string[]
}>;

export default function DataTable({columnHeadings, children}: DataTableProps) {
  return (
    <div className={styles.datatable}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columnHeadings.map(heading => <th key={heading}>{heading}</th>)}
          </tr>
        </thead>
        <tbody>
          { children }
        </tbody>
      </table>
    </div>
  );
}