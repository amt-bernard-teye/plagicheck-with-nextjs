import { useState } from "react";

import styles from "./multi-select.module.css";
import CaretDown from "@/components/atoms/icons/caret-down";
import CaretUp from "@/components/atoms/icons/caret-up";
import { Faculty } from "@/lib/types/faculty.type";

type MultiSelectProps = {
  placeholder: string;
  items: Faculty[],
  selectedItem: Faculty | undefined;
  onSelecteItem: (id: number) => void;
  hasError?: boolean;
}

export default function MultiSelect({hasError, placeholder, items, selectedItem, onSelecteItem}: MultiSelectProps) {
  const [showList, setShowList] = useState(false);

  function handleSelectedItem(id: number) {
    onSelecteItem(id);
    setShowList(false);
  }

  let fieldText = selectedItem ? selectedItem.name : placeholder;
  let fieldStyle = selectedItem ? styles.selected : styles.placeholder;

  return (
    <div className={styles.multiSelect}>
      <button className={`${styles.multiSelectAction} ${hasError && styles.multiSelectError}`} type="button" onClick={() => setShowList(!showList)}>
        <span className={fieldStyle}>{fieldText}</span>
        <span className="flex gap-1">
          {!showList ? <CaretDown /> : <CaretUp />}
        </span>
      </button>
      {showList && (
        <div className={styles.multiSelectList}>
          {items.map(item => (
            <label key={item.id}>
              <input 
                type="radio" 
                name="select" 
                value={item.id} onChange={() => handleSelectedItem(item.id!)}
                checked={item.id === selectedItem?.id} /> 
              <span>{item.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}