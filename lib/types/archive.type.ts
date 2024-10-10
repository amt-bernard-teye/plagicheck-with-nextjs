import { DocumentType } from "@prisma/client";
import { Department } from "./department.type";

export type Archive = {
  id?: number;
  fileName: string;
  path: string;
  createdAt?: Date;
  departmentId?: number;
  documentType: DocumentType;
  department?: Department
};

export type ArchiveProps = {
  id: boolean;
  fileName: boolean;
  path: boolean;
  createdAt: boolean;
  department: boolean;
  documentType: boolean;
}