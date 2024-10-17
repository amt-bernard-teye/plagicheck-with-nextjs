import { useState } from "react";

import PencilEdit from "../atoms/icons/pencil-edit";
import TrashCan from "@/components/atoms/icons/trash-can";
import { Department } from "@/lib/types/department.type";

type DepartmentListProps = {
  list: Department[] | undefined;
  onEdit: () => void;
  onDelete: () => void;
  onSelectItem: (departmentId: number, facultyId: number) => void;
}

export default function DepartmentList({list, onEdit, onDelete, onSelectItem}: DepartmentListProps) {
  const [ showMainList, setShowMainList ] = useState(false);

  let totalItems = list ? list.length : 0;
  let actionText = totalItems > 2 ? `+${totalItems}` : totalItems.toString();
  let listItems: React.JSX.Element[] = [];

  if (list) {
    for (let item of list) {
      if (listItems.length === 2) {
        break;
      }

      listItems.push(
        <span 
          key={item.id}
          className="p-2 inline-block rounded-lg text-[var(--black-200)] opacity-70 bg-[var(--gray-1000)]">{item.name}</span>
      );
    }
  }

  return (
    <div className="flex flex-col gap-2 items-start md:flex-row md:items-center">
      {listItems}
      {totalItems !== 0 ? (
        <button 
          className="p-2 inline-block rounded-lg text-[var(--black-200)] opacity-70 border-2 border-[var(--gray-1000)] bg-white hover:bg-[var(--gray-1000)]"
          onClick={() => setShowMainList(!showMainList)}>{ actionText }</button>
      ) : <span className="inline-block p-2 invisible">&nbps;</span>}
      <div className="relative">
        {showMainList && (
          <div className="absolute top-0 right-[-190px] bg-white min-w-[330px] max-w-[400px] shadow-md rounded-lg space-y-4 border border-[var(--gray-1000)] p-2 z-[2] md:p-4 md:min-w-[410px] md:right-[8px] md:top-[23px]">
            {list?.map(item => (
              <div key={item.id} className="w-full flex justify-between items-center text-[0.875em] md:text-[1em]">
                <span>{item.name}</span>
                <div className="space-x-4">
                  <button className="btn-dep-edit"
                    onClick={() => {
                      onEdit();
                      setShowMainList(!showMainList);
                      onSelectItem(item.id!, item.facultyId!);
                    }}>
                    <PencilEdit />
                  </button>
                  <button className="btn-dep-delete"
                    onClick={() => {
                      onDelete();
                      setShowMainList(!showMainList);
                      onSelectItem(item.id!, item.facultyId!);
                    }}>
                    <TrashCan />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}