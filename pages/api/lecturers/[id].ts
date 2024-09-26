import { NextApiRequest, NextApiResponse } from "next";

import { LecturerRepository } from "@/lib/repository/lecturer.repository";
import { DepartmentRepository } from "@/lib/repository/department.repository";
import { StatusCode } from "@/lib/enums/status-code";
import { lecturerValidationSchema } from "@/lib/utils/validators/lecturer.validator";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    updateLecturer(req, res);
    return;
  }
  else if (req.method === "DELETE") {
    deleteLecturer(req, res);
    return;
  }

  return res.status(StatusCode.NOT_FOUND).json({
    message: "Route not found"
  });
} 


const lecturerRepo = new LecturerRepository();
const departmentRepo = new DepartmentRepository();


async function updateLecturer(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body;
  const lecturerId = <string>req.query.id;

  try {
    const validatedData = await lecturerValidationSchema.validate(data);
    const lecturer = await lecturerRepo.findByUserId(lecturerId);
    const department = await departmentRepo.find(validatedData.departmentId);

    if (!lecturer) {
      throw new Error("Lecturer doesn't exist");
    }

    if (!department) {
      throw new Error("Department doesn't exist");
    }

    lecturer.user.name = validatedData.name;
    lecturer.user.email = validatedData.email;
    lecturer.user.phoneNumber = validatedData.phoneNumber;
    lecturer.department = {
      id: department.id!,
      name: department.name
    }

    const updatedLecturer = await lecturerRepo.update(lecturer);

    return res.status(StatusCode.SUCCESS).json({
      message: "Lecturer updated successfully",
      data: updatedLecturer
    });
  }
  catch(error: any) {
    res.status(error.message ? StatusCode.SERVER : StatusCode.BAD_REQUEST).json({
      message: error.message || "Something went wrong"
    });
  }
}


async function deleteLecturer(req: NextApiRequest, res: NextApiResponse) {
  const lecturerId = <string>req.query.id;

  try {
    await lecturerRepo.delete(lecturerId);
    const firstPage = 0;
    const query = "";
    let lecturers = await lecturerRepo.paginate(query, firstPage);

    res.status(StatusCode.SUCCESS).json({
      message: "Lecturer deleted successfully",
      data: lecturers
    });
  }
  catch(error: any) {
    res.status(StatusCode.SERVER).json({
      message: error.message || "Something went wrong"
    });
  }
}