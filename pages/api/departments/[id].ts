import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

import { StatusCode } from "@/lib/enums/status-code";
import { checkApiAccess } from "@/lib/utils/check-api-access";
import { DepartmentRepository } from "@/lib/repository/department.repository";
import { FacultyRepository } from "@/lib/repository/faculty.repository";
import { HttpException } from "@/lib/exception/http-exception";
import { handleError } from "@/lib/utils/handle-error";
import { AvailabilityStatus } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  checkApiAccess(req, res);

  if (req.method === "PUT") {
    updateDepartment(req, res);
    return;
  }
  else if (req.method === "DELETE") {
    deleteDepartment(req, res);
    return;
  }

  return res.status(StatusCode.BAD_REQUEST).json({
    message: "Route not found"
  });
}

const departmentRepo = new DepartmentRepository();
const facultyRepo = new FacultyRepository();

const validationSchema = Yup.object({
  name: Yup.string().required().matches(/^[a-zA-Z ]*$/).min(3).max(50),
  facultyId: Yup.string().required().matches(/^[0-9]*$/),
  id: Yup.string().required().matches(/^[0-9]*$/)
});

async function updateDepartment(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body;
  data["id"] = req.query.id;

  try {
    const validatedData = await validationSchema.validate(data);
    const existingDepartment = await departmentRepo.find(+validatedData.id);
    
    if (!existingDepartment || (existingDepartment && existingDepartment.status === AvailabilityStatus.UN_AVAILABLE)) {
      throw new HttpException("Department doesn't exist", StatusCode.BAD_REQUEST);
    }

    const existingFaculty = await facultyRepo.find(+validatedData.facultyId);

    if (!existingFaculty) {
      throw new HttpException("Faculty doesn't exist", StatusCode.BAD_REQUEST);
    }

    existingDepartment.name = validatedData.name;
    existingDepartment.facultyId = existingFaculty.id;
    const updatedDepartment = await departmentRepo.update(existingDepartment);

    res.status(StatusCode.SUCCESS).json({
      message: "Department updated successfully",
      data: updatedDepartment
    });
  }
  catch(error: any) {
    handleError(error, res);
  }
}


async function deleteDepartment(req: NextApiRequest, res: NextApiResponse) {
  const departmentId = <string>req.query["id"];

  try {
    const existingDepartment = await departmentRepo.find(+departmentId);

    if (!existingDepartment || (existingDepartment && existingDepartment.status === AvailabilityStatus.UN_AVAILABLE)) {
      throw new HttpException("Department doesn't exist", StatusCode.BAD_REQUEST);
    }

    await departmentRepo.delete(existingDepartment.id!);

    res.status(StatusCode.SUCCESS).json({
      message: "Department deleted successfully",
    });
  }
  catch(error: any) {
    handleError(error, res);
  }
}