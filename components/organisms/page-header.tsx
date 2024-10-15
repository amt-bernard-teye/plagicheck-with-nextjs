"use client";

import { useDebouncedCallback } from "use-debounce";
import { ChangeEvent } from "react";
// import { useRouter } from "next/navigation";

import FormControl from "../atoms/form-control";
import Search from "@/components/atoms/icons/search";
import Profile from "../molecules/profile";


type PageHeaderProps = {
  name: string;
  email: string;
  onSearch?: (value: string) => void;
}


export default function PageHeader({name, email, onSearch}: PageHeaderProps) {
  // const router = useRouter();
  // const searchTerm = router.query["q"] as string || "";

  const handleSearch = useDebouncedCallback((event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value || "";

    if (onSearch) {
      onSearch(value);
    }
    else {
      const params = new URLSearchParams();
      params.set("q", value);

      // if (value) {
      //   router.replace(`${router.pathname}?${params.toString()}`);
      // } else {
      //   router.replace(`${router.pathname}`);
      // }
    }
  }, 650);


  let searchIcon = (
    <div>
      <Search />
    </div>
  );

  return (
    <header className="flex justify-between py-[15px] px-[21px] xl:py-[19px] xl:px-[41px] border border-b-[#bcbcc0]">
      <div className="w-[100%] lg:w-[307px]">
        <FormControl 
          type="search"
          placeholder="Search anything here"
          onChange={handleSearch}
          // defaultValue={searchTerm}
          leftIcon={searchIcon} />
      </div>
      <div className="hidden lg:block">
        <Profile email={email} name={name} />
      </div>
    </header>
  );
}