import { AvailabilityStatus } from "@prisma/client";
import { Faculty } from "./faculty.type";

export type Department = {
  id?: number;
  name: string;
  facultyId?: number;
  faculty?: Faculty;
  status?: AvailabilityStatus
}

export type DepartmentProps = {
  id: boolean;
  name: boolean;
  facultyId: boolean;
}