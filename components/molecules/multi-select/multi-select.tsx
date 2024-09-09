import { useState } from "react";

import styles from "./multi-select.module.css";
import CaretDown from "@/components/atoms/icons/caret-down";
import CaretUp from "@/components/atoms/icons/caret-up";

type MultiSelectProps = {
  placeholder: string;
}

export default function MultiSelect({placeholder}: MultiSelectProps) {
  const [showList, setShowList] = useState(false);

  return (
    <div className={styles.multiSelect}>
      <button className={styles.multiSelectAction} type="button" onClick={() => setShowList(!showList)}>
        <span className={styles.placeholder}>{placeholder}</span>
        {!showList ? <CaretDown /> : <CaretUp />}
      </button>
      {showList && (
        <div className={styles.multiSelectList}>
          <label>
            <input type="radio" name="select" /> <span>Faculty of Engineering</span>
          </label>
          <label>
            <input type="radio" name="select" /> <span>Faculty of Engineering</span>
          </label>
          <label>
            <input type="radio" name="select" /> <span>Faculty of Engineering</span>
          </label>
          <label>
            <input type="radio" name="select" /> <span>Faculty of Engineering</span>
          </label>
        </div>
      )}
    </div>
  );
}