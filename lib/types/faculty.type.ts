import { AvailabilityStatus } from "@prisma/client";
import { Department } from "./department.type";

export type Faculty = {
  id?: number;
  name: string;
  status?: AvailabilityStatus;
  departments?: Department[],
};

export type FacultyProp = {
  id: boolean;
  name: boolean;
  departments: boolean;
}