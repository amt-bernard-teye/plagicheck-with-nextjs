import { Role } from "@prisma/client";

export type UserInvitationDetails = {
  id: string;
  role: Role;
  email: string;
  password: string;
  name: string;
}