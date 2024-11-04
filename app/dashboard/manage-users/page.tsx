import { cookies } from "next/headers";

import PageHeader from "@/components/organisms/page-header";
import { ManageUsersInteractivity } from "@/components/templates/manage-users-interactivity/manage-users-interactivity";
import { DepartmentRepository } from "@/lib/repository/department.repository";
import { LecturerRepository } from "@/lib/repository/lecturer.repository";
import { StudentRepository } from "@/lib/repository/student.repository";

type SearchParams = {
  searchParams: {
    q?: string;
    page?: number;
  }
}

export default async function ManageUsers({searchParams}: SearchParams) {
  let name = cookies().get("user_name")?.value || "";
  let email = cookies().get("user_email")?.value || "";
  let imagePath = cookies().get("user_image_path")?.value || "";

  let page = searchParams.page ? searchParams.page - 1 : 0;
  let query = searchParams.q ? searchParams.q : "";

  const departmentRepo = new DepartmentRepository();
  const lecturerRepo = new LecturerRepository();
  const studentRepo = new StudentRepository();

  const [ departments, lecturers, lecturerCount, students, studentCount ] = await Promise.all([
    departmentRepo.findAll(),
    lecturerRepo.paginate(query, page),
    lecturerRepo.count(query),
    studentRepo.paginate(query, page),
    studentRepo.count(query)
  ]);

  return (
    <>
      <PageHeader name={name} email={email} image={imagePath}/>
      <ManageUsersInteractivity
        studentCount={studentCount}
        students={students}
        lecturers={lecturers}
        departments={departments}
        lecturerCount={lecturerCount} />
    </>
  );
}