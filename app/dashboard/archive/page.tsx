import { cookies } from "next/headers";

import PageHeader from "@/components/organisms/page-header";

export default function Archive() {
  let name = cookies().get("user_name")?.value || "";
  let email = cookies().get("user_email")?.value || "";
  let imagePath = cookies().get("user_image_path")?.value || "";

  return (
    <>
      <PageHeader email={email} name={name} image={imagePath}/>
    </>
  );
}