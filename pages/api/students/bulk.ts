import { NextApiRequest, NextApiResponse } from "next";
import PasswordGenerator from "generate-password";

import { StatusCode } from "@/lib/enums/status-code";
import { DepartmentRepository } from "@/lib/repository/department.repository";
import { Role } from "@prisma/client";
import { UserInvitationMailer } from "@/lib/mailer/user-invitation.mailer";
import { UserRepository } from "@/lib/repository/user.repository";
import { StudentRepository } from "@/lib/repository/student.repository";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(StatusCode.BAD_REQUEST).json({
      message: "Route not found"
    });
  }

  const students = req.body;
  const studentRepo = new StudentRepository();
  const departmentRepo = new DepartmentRepository();
  const userRepo = new UserRepository();
  const invitationMailer = new UserInvitationMailer();
  let rowCounter = 0;

  try {
    for (let student of students) {
      const generatedPassword = PasswordGenerator.generate({length: 10, numbers: true});
      const existingDepartment = await departmentRepo.find(student[3]);

      if (!existingDepartment) {
        throw new Error(`Department on row number ${rowCounter + 1}, doesn't exist, Please restart process by excluding the rows above that if any`);
      }

      const existingStudent = await userRepo.find(student[1]);

      if (existingStudent) {
        throw new Error(`Student with email: ${student[1]} on row ${rowCounter + 1} already exist. Please restart process by excluding this row and any above that if any`);
      }
      
      let addedStudent = await studentRepo.create({
        department: existingDepartment,
        user: {
          name: student[0],
          email: student[1],
          phoneNumber: student[2],
          role: Role.LECTURER,
          password: generatedPassword
        }
      });

      await invitationMailer.sendMail({
        email: addedStudent.user.email,
        name: addedStudent.user.name,
        id: addedStudent.user.id!,
        password: generatedPassword,
        role: addedStudent.user.role
      });

      rowCounter++;
    }

    res.status(StatusCode.SUCCESS).json({
      message: "Students added successfully"
    });
  }
  catch(error) {
    if (error instanceof Error) {
      return res.status(StatusCode.SERVER).json({
        message: error.message || "Something went wrong"
      });
    }
  }
}