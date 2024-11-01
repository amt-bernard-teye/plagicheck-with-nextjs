import { AppException } from "../exceptions/app.exception";
import { DepartmentRepository } from "../repository/department.repository";
import { FacultyRepository } from "../repository/faculty.repository";
import { UserRepository } from "../repository/user.repository";

export async function checkFaculty(facultyId: number) {
  const facultyRepo = new FacultyRepository();
  const existingFaculty = await facultyRepo.find(facultyId);

  if (!existingFaculty) {
    throw new AppException("Faculty doesn't exist");
  }

  return existingFaculty;
}


export async function checkDepartment(departmentId: number) {
  const departmentRepo = new DepartmentRepository();
  const department = await departmentRepo.find(departmentId);

  if (!department) {
    throw new Error("Department doesn't exist");
  }

  return department;
}


export async function ensureEmailNeverExist(email: string) {
  const userRepo = new UserRepository();
  const existingUser = await userRepo.find(email);

  if (existingUser) {
    throw new Error("Email already exist, please try again with another one");
  }
}