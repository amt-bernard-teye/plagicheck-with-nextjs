import { AppException } from "../exceptions/app.exception";
import { FacultyRepository } from "../repository/faculty.repository";

export async function checkFaculty(facultyId: number) {
  const facultyRepo = new FacultyRepository();

  const existingFaculty = await facultyRepo.find(facultyId);

  if (!existingFaculty) {
    throw new AppException("Faculty doesn't exist");
  }

  return existingFaculty;
}