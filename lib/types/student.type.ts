import { Department } from "./department.type"
import { User } from "./user.type"

export type Student = {
  id?: number;
  user: User,
  department: Department,
}

export type StudentProp = {
  user: boolean;
  department: boolean;
}