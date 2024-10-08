import { useState } from "react";

import PencilEdit from "@/components/atoms/icons/pencil-edit";
import styles from "./department-list.module.css";
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
        <span className={styles.listItem} key={item.id}>{item.name}</span>
      );
    }
  }

  return (
    <div className={styles.list}>
      {listItems}
      {totalItems !== 0 ? (
        <button 
          className={styles.action} 
          onClick={() => setShowMainList(!showMainList)}>{ actionText }</button>
      ) : <span className={styles.emptyAction}>&nbps;</span>}
      <div className={styles.actualList}>
        {showMainList && (
          <div className={styles.row}>
            {list?.map(item => (
              <div className={styles.col} key={item.id}>
                <span>{item.name}</span>
                <div className={styles.actions}>
                  <button className={`${styles.actionItem} ${styles.editAction}`}
                    onClick={() => {
                      onEdit();
                      setShowMainList(!showMainList);
                      onSelectItem(item.id!, item.facultyId!);
                    }}>
                    <PencilEdit />
                  </button>
                  <button className={`${styles.actionItem} ${styles.dangerAction}`}
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