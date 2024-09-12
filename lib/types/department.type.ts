import { Faculty, FacultyProp } from "./faculty.type";

export type Department = {
  id?: number;
  name: string;
  facultyId?: number;
  faculty?: Faculty;
}

export type DepartmentProps = {
  id: boolean;
  name: boolean;
  faculty: boolean;
}