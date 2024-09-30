import { UserTabs } from "@/lib/enums/user-tab";
import styles from "./user-details.module.css";
import Button from "@/components/atoms/button/button";


export type UserDetailsHeaderProps = {
  activeTab: UserTabs;
  onToggleModal: () => void;
  onSetActiveTab: (tab: UserTabs) => void;
  onNavigateToBulk: () => void;
}


export default function UserDetailsHeader({activeTab, onToggleModal, onSetActiveTab, onNavigateToBulk}: UserDetailsHeaderProps) {
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
        <Button 
          variant="secondary"
          onClick={onNavigateToBulk}>Bulk upload</Button>
        <Button variant="primary"
          onClick={onToggleModal}>
          {activeTab === UserTabs.LECTURER ? "Add Lecturer" : "Add Student"}
        </Button>
      </div>
    </div>
  );
}