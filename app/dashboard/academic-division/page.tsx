import { cookies } from "next/headers";

import Button from "@/components/atoms/button";
import SubHeader from "@/components/molecules/sub-header";
import PageHeader from "@/components/organisms/page-header";

export default function AcademicDivision() {
  let name = cookies().get("user_name")?.value || "";
  let email = cookies().get("user_email")?.value || "";
  let imagePath = cookies().get("user_image_path")?.value || "";

  return (
    <>
      <PageHeader email={email} name={name} image={imagePath} />
      <SubHeader 
        title="Academic Unit"
        description="Add faculties and departments here">
        <div className="flex gap-4">
            <div className="flex flex-col w-[162px]">
              <Button el="button" variant="secondary">Add Department</Button>
            </div>
            <div className="flex flex-col w-[128px]">
              <Button el="button" variant="primary">Add Faculty</Button>
            </div>
          </div>
      </SubHeader>
    </>
  );
}