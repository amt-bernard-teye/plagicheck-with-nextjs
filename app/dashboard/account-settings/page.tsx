import { cookies } from "next/headers";

import PageHeader from "@/components/organisms/page-header";
import AccountInteractivity from "@/components/templates/account-interactivity";

export default function AccountSettings() {
  let id = cookies().get("user_id")?.value || "";
  let name = cookies().get("user_name")?.value || "";
  let email = cookies().get("user_email")?.value || "";
  let imagePath = cookies().get("user_image_path")?.value || "";

  return (
    <>
      <PageHeader email={email} name={name} image={imagePath} />
      <AccountInteractivity 
        id={id} 
        name={name}
        imagePath={imagePath} />
    </>
  );
}