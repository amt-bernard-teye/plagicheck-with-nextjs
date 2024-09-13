import { useState } from "react";

import { UserTabs } from "@/lib/enums/user-tab";
import styles from "./user-details.module.css";
import Button from "@/components/atoms/button/button";
import Funnel from "@/components/atoms/icons/funnel";
import Label from "@/components/atoms/label/label";


export type UserDetailsHeaderProps = {
  activeTab: UserTabs;
  onToggleModal: () => void;
  onSetActiveTab: (tab: UserTabs) => void;
  onNavigateToBulk: () => void;
}


export default function UserDetailsHeader(
  {activeTab, onToggleModal, onSetActiveTab, onNavigateToBulk}: UserDetailsHeaderProps
) {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className={`section-padding ${styles.header}`}>
      <div className={styles.headerTabs}>
        <button 
          className={`${styles.headerTab} ${activeTab === UserTabs.LECTURER && styles.headerTabActive}`}
          onClick={() => onSetActiveTab(UserTabs.LECTURER)}>Lecturer</button>
        <button 
          className={`${styles.headerTab} ${activeTab === UserTabs.STUDENT && styles.headerTabActive}`}
          onClick={() => onSetActiveTab(UserTabs.STUDENT)}>Student</button>
      </div>

      <div className={styles.headerActions}>
        <Button variant="secondary" 
          onClick={() => setShowFilter(!showFilter)}>
          Filter by: All <Funnel />
        </Button>
        <Button 
          variant="secondary"
          onClick={onNavigateToBulk}>Bulk upload</Button>
        <Button variant="primary"
          onClick={onToggleModal}>
          {activeTab === UserTabs.LECTURER ? "Add Lecturer" : "Add Student"}
        </Button>
        {showFilter && (
          <div className={styles.headerFilter}>
            <h5>Filter</h5>
            <div className={styles.headerList}>
              <Label>
                <input type="checkbox" /> ALL
              </Label>
              <Label>
                <input type="checkbox" /> PHD
              </Label>
              <Label>
                <input type="checkbox" /> MSC
              </Label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}