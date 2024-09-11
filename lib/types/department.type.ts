import { Faculty, FacultyProp } from "./faculty.type";

export type Department = {
  facultId?: number;
  faculty?: Faculty;
} & Faculty;

export type DepartmentProps = {
  faculty: boolean;
} & FacultyProp