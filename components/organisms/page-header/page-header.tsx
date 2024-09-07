import FormControl from "@/components/molecules/form-control/form-control";
import styles from "./page-header.module.css";
import Search from "@/components/atoms/icons/search";
import UserProfile from "@/components/molecules/user-profile/user-profile";

export default function PageHeader() {
  let searchIcon = (
    <div className={styles.searchIcon}>
      <Search />
    </div>
  );

  return (
    <header className={styles.header}>
      <div className={styles.search}>
        <FormControl 
          placeholder="Search anything here"
          leftIcon={searchIcon} />
      </div>
      <div className={styles.headerProfile}>
        <UserProfile />
      </div>
    </header>
  );
}