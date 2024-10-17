import { PropsWithChildren } from "react";

type DataTableProps = PropsWithChildren<{
  columnHeadings: string[]
}>;

export default function DataTable({columnHeadings, children}: DataTableProps) {
  return (
    <div>
      <table className="w-full align-middle border-collapse">
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