import UserDetailsHeader, { UserDetailsHeaderProps } from "./user-details-header";
import styles from "./user-details.module.css";

type UserDetailsProps = {

} & UserDetailsHeaderProps;

export default function UserDetails({activeTab, onToggleModal, onSetActiveTab, onNavigateToBulk}: UserDetailsProps) {
  return (
    <>
      <UserDetailsHeader 
        activeTab={activeTab} 
        onToggleModal={onToggleModal}
        onSetActiveTab={onSetActiveTab}
        onNavigateToBulk={onNavigateToBulk} />
      
      <div className="section-padding">

      </div>
    </>
  )
} 