import { cookies } from "next/headers";

import PageHeader from "@/components/organisms/page-header";
import AcademicDivisionInteractivity from "@/components/templates/academic-division-interactivity";
import { FacultyRepository } from "@/lib/repository/faculty.repository";

export default async function AcademicDivision() {
  const name = cookies().get("user_name")?.value || "";
  const email = cookies().get("user_email")?.value || "";
  const imagePath = cookies().get("user_image_path")?.value || "";
  const facultyRepo = new FacultyRepository();
  const [faculties, count] = await Promise.all([
    facultyRepo.paginate("", 0),
    facultyRepo.count("")
  ]);


  return (
    <>
      <PageHeader email={email} name={name} image={imagePath} />
      <AcademicDivisionInteractivity faculties={faculties}/>
    </>
  );
}