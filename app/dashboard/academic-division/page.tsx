import { cookies } from "next/headers";

import PageHeader from "@/components/organisms/page-header";
import AcademicDivisionInteractivity from "@/components/templates/academic-division-interactivity";
import { FacultyRepository } from "@/lib/repository/faculty.repository";

type AcademicDivisionProps = {
  searchParams: {
    page?: number;
    q?: string;
  }
}

export default async function AcademicDivision({searchParams}: AcademicDivisionProps) {
  const name = cookies().get("user_name")?.value || "";
  const email = cookies().get("user_email")?.value || "";
  const imagePath = cookies().get("user_image_path")?.value || "";
  const facultyRepo = new FacultyRepository();

  let page = searchParams.page ? searchParams.page - 1 : 0;
  let query = searchParams.q ? searchParams.q : "";

  const [faculties, count] = await Promise.all([
    facultyRepo.paginate(query, page),
    facultyRepo.count(query)
  ]);

  return (
    <>
      <PageHeader email={email} name={name} image={imagePath} />
      <AcademicDivisionInteractivity faculties={faculties} rowCount={count}/>
    </>
  );
}