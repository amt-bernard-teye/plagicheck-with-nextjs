import { UserTabs } from "@/lib/enum/user-tab.enum";
import Button from "@/components/atoms/button";


export type UserDetailsHeaderProps = {
  activeTab: UserTabs;
  onToggleModal: () => void;
  onSetActiveTab: (tab: UserTabs) => void;
  onNavigateToBulk: () => void;
}


export default function UserDetailsHeader({activeTab, onToggleModal, onSetActiveTab, onNavigateToBulk}: UserDetailsHeaderProps) {
  return (
    <div className="py-[15px] px-[21px] lg:py-[19px] lg:px-[41px] flex flex-col border-b border-b-[var(--gray-800)] md:flex-row md:justify-between md:items-center">
      <div className="flex gap-2 mb-4 md:m-0">
        <button 
          className={`px-[12px] py-2 ${activeTab === UserTabs.LECTURER && "bg-[var(--gray-1000)] border-b-2 border-b-[var(--sea-blue-100)] text-[var(--sea-blue-100)]"}`}
          onClick={() => onSetActiveTab(UserTabs.LECTURER)}>Lecturer</button>
        <button 
          className={`px-[12px] py-2 ${activeTab === UserTabs.STUDENT && "bg-[var(--gray-1000)] border-b-2 border-b-[var(--sea-blue-100)] text-[var(--sea-blue-100)]"}`}
          onClick={() => onSetActiveTab(UserTabs.STUDENT)}>Student</button>
      </div>

      <div className="flex flex-wrap w-full justify-between md:w-[315px] md:gap-4">
        <div className="basis-[48%] flex flex-col md:basis-[147px]">
          <Button el="button" variant="secondary" onClick={onNavigateToBulk}>Bulk upload</Button>
        </div>
        <div className="basis-[48%] flex flex-col md:basis-[152px]">
          <Button el="button" variant="primary" onClick={onToggleModal}>
            {activeTab === UserTabs.LECTURER ? "Add Lecturer" : "Add Student"}
          </Button>
        </div>
      </div>
    </div>
  );
}