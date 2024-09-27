import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcryptjs";
import * as PasswordGenerator from "generate-password";

import { StudentRepository } from "@/lib/repository/student.repository";
import { DepartmentRepository } from "@/lib/repository/department.repository";
import { handleError } from "@/lib/utils/handle-error";
import { Role } from "@prisma/client";
import { StatusCode } from "@/lib/enums/status-code";
import { UserInvitationMailer } from "@/lib/mailer/user-invitation.mailer";
import { getQueryPageForm } from "@/lib/utils/get-query-page-form";
import { studentValidationSchema } from "@/lib/utils/validators/student.validator";
import { UserRepository } from "@/lib/repository/user.repository";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    await createStudent(req, res);
    return;
  }
  else if (req.method === "GET") {
    await getStudents(req, res);
    return;
  }

  return res.status(StatusCode.NOT_FOUND).json({
    message: "Http not found"
  });
}


const studentRepo = new StudentRepository();
const departmentRepo = new DepartmentRepository();
const userRepo = new UserRepository();

async function createStudent(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body;

  try {
    const validatedData = await studentValidationSchema.validate(data);
    const department = await departmentRepo.find(validatedData.departmentId);

    const existingUser = await userRepo.find(validatedData.email);

    if (existingUser) {
      throw new Error("Email already exist, please try again with another one");
    }

    if (!department) {
      throw new Error("Selected department not found");
    }

    const generatedPassword = PasswordGenerator.generate({length: 10, numbers: true});
    const hashedGeneratedPassword = await hash(generatedPassword, 12);

    const student = await studentRepo.create({
      department: department!,
      user: {
        name: validatedData.name,
        email: validatedData.email,
        phoneNumber: validatedData.phoneNumber,
        role: Role.STUDENT,
        password: hashedGeneratedPassword
      }
    });

    const mailer = new UserInvitationMailer();
    await mailer.sendMail({
      email: student.user.email,
      id: student.user.id!,
      password: generatedPassword,
      role: student.user.role,
      name: student.user.name
    });

    return res.status(StatusCode.CREATED).json({
      message: "Student added successfully",
      data: student
    });
  }
  catch(error: any) {
    handleError(error, res);
  }
}


async function getStudents(req: NextApiRequest, res: NextApiResponse) {
  const values = getQueryPageForm(req);

  try {
    const [students, count] = await Promise.all([
      studentRepo.paginate(values.query, values.page),
      studentRepo.count(values.query)
    ]);

    return res.status(StatusCode.SUCCESS).json({
      count,
      data: students
    });
  }
  catch(error: any) {
    res.status(StatusCode.SERVER).json({
      message: error.message || "Something went wrong" 
    });
  }
}