import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

import { StatusCode } from "@/lib/enums/status-code";
import { DepartmentRepository } from "@/lib/repository/department.repository";
import { FacultyRepository } from "@/lib/repository/faculty.repository";
import { handleError } from "@/lib/utils/handle-error";
import { HttpException } from "@/lib/exception/http-exception";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    createDepartment(req, res);
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
  facultyId: Yup.string().required().matches(/^[0-9]*$/)
});

async function createDepartment(req: NextApiRequest, res: NextApiResponse) {
  const data = <{
    name: string;
    facultyId: string;
  }>req.body;

  try {
    const validatedData = await validationSchema.validate(data);
    const faculty = await facultyRepo.find(+data.facultyId);

    if (!faculty) {
      throw new HttpException("Selected faculty doesn't exist", StatusCode.BAD_REQUEST);
    }

    const existingDepartment = await departmentRepo.find(data.name);

    if (existingDepartment) {
      throw new HttpException("Department already exist", StatusCode.BAD_REQUEST);
    }

    const department = await departmentRepo.create({
      name: validatedData.name,
      facultyId: faculty?.id
    });

    return res.status(StatusCode.CREATED).json({
      message: "Department added successfully",
      data: department
    });
  }
  catch(error: any) {
    handleError(error, res);
  }
}