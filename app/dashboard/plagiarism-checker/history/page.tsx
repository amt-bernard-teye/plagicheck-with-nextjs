import { cookies } from "next/headers";

import PageHeader from "@/components/organisms/page-header";

export default function Page() {
  let name = cookies().get("user_name")?.value || "";
  let email = cookies().get("user_email")?.value || "";

  return (
    <>
      <PageHeader email={email} name={name}/>
    </>
  );
}