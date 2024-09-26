import { AvailabilityStatus, Role } from "@prisma/client";

export type User = {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  image?: string | null;
  status?: AvailabilityStatus
  phoneNumber: string;
}


export type UserProp = {
  id: boolean;
  name: boolean;
  email: boolean;
  role: boolean;
  image: boolean;
  phoneNumber: boolean;
  status: boolean;
}


export type UserToCreate = {
  name: string;
  email: string;
  phoneNumber: string;
  departmentId: string;
}


export type LecturerToCreate = {
  qualification: string;
} & UserToCreate;