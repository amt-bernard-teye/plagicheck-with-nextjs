import { Department } from "./department.type"
import { User } from "./user.type"

export type Lecturer = {
  id?: number;
  user: User,
  department: Department,
  qualification: string;
}

export type LecturerProp = {
  user: boolean;
  department: boolean;
  qualification: boolean;
}