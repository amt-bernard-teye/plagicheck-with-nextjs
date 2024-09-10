import { AvailabilityStatus } from "@prisma/client";

export type Faculty = {
  id?: number;
  name: string;
  status?: AvailabilityStatus
};

export type FacultyProp = {
  id: boolean;
  name: boolean;
}