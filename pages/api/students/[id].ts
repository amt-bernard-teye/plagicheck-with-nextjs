import { NextApiRequest, NextApiResponse } from "next";

import { StudentRepository } from "@/lib/repository/student.repository";
import { DepartmentRepository } from "@/lib/repository/department.repository";
import { StatusCode } from "@/lib/enums/status-code";
import { studentValidationSchema } from "@/lib/utils/validators/student.validator";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    updateStudent(req, res);
    return;
  }
  else if (req.method === "DELETE") {
    deleteStudent(req, res);
    return;
  }

  return res.status(StatusCode.NOT_FOUND).json({
    message: "Route not found"
  });
} 


const studentRepo = new StudentRepository();
const departmentRepo = new DepartmentRepository();


async function updateStudent(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body;
  const studentId = <string>req.query.id;

  try {
    const validatedData = await studentValidationSchema.validate(data);
    const student = await studentRepo.findByUserId(studentId);
    const department = await departmentRepo.find(validatedData.departmentId);

    if (!student) {
      throw new Error("Student doesn't exist");
    }

    if (!department) {
      throw new Error("Department doesn't exist");
    }

    student.user.name = validatedData.name;
    student.user.email = validatedData.email;
    student.user.phoneNumber = validatedData.phoneNumber;
    student.department = {
      id: department.id!,
      name: department.name
    }

    const updatedStudent = await studentRepo.update(student);

    return res.status(StatusCode.SUCCESS).json({
      message: "Student updated successfully",
      data: updatedStudent
    });
  }
  catch(error: any) {
    res.status(error.message ? StatusCode.SERVER : StatusCode.BAD_REQUEST).json({
      message: error.message || "Something went wrong"
    });
  }
}


async function deleteStudent(req: NextApiRequest, res: NextApiResponse) {
  const studentId = <string>req.query.id;

  try {
    await studentRepo.delete(studentId);
    const firstPage = 0;
    const query = "";
    let students = await studentRepo.paginate(query, firstPage);

    res.status(StatusCode.SUCCESS).json({
      message: "Student deleted successfully",
      data: students
    });
  }
  catch(error: any) {
    res.status(StatusCode.SERVER).json({
      message: error.message || "Something went wrong"
    });
  }
}