import { useDebouncedCallback } from "use-debounce";
import { ChangeEvent } from "react";
import { useRouter } from "next/router";

import FormControl from "@/components/molecules/form-control/form-control";
import styles from "./page-header.module.css";
import Search from "@/components/atoms/icons/search";
import UserProfile from "@/components/molecules/user-profile/user-profile";


type PageHeaderProps = {
  onSearch?: (value: string) => void;
}


export default function PageHeader({onSearch}: PageHeaderProps) {
  const router = useRouter();
  const searchTerm = router.query["q"] as string || "";

  const handleSearch = useDebouncedCallback((event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value || "";

    if (onSearch) {
      onSearch(value);
    }
    else {
      const params = new URLSearchParams();
      params.set("q", value);

      if (value) {
        router.replace(`${router.pathname}?${params.toString()}`);
      } else {
        router.replace(`${router.pathname}`);
      }
    }
  }, 650);


  let searchIcon = (
    <div className={styles.searchIcon}>
      <Search />
    </div>
  );

  return (
    <header className={styles.header}>
      <div className={styles.search}>
        <FormControl 
          type="search"
          placeholder="Search anything here"
          onChange={handleSearch}
          defaultValue={searchTerm}
          leftIcon={searchIcon} />
      </div>
      <div className={styles.headerProfile}>
        <UserProfile />
      </div>
    </header>
  );
}