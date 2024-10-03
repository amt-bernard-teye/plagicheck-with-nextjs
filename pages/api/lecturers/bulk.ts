import { NextApiRequest, NextApiResponse } from "next";
import PasswordGenerator from "generate-password";

import { StatusCode } from "@/lib/enums/status-code";
import { LecturerRepository } from "@/lib/repository/lecturer.repository";
import { DepartmentRepository } from "@/lib/repository/department.repository";
import { Role } from "@prisma/client";
import { UserInvitationMailer } from "@/lib/mailer/user-invitation.mailer";
import { UserRepository } from "@/lib/repository/user.repository";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(StatusCode.BAD_REQUEST).json({
      message: "Route not found"
    });
  }

  const lecturers = req.body;
  const lecturerRepo = new LecturerRepository();
  const departmentRepo = new DepartmentRepository();
  const userRepo = new UserRepository();
  const invitationMailer = new UserInvitationMailer();
  let rowCounter = 0;

  try {
    for (let lecturer of lecturers) {
      const generatedPassword = PasswordGenerator.generate({length: 10, numbers: true});
      const existingDepartment = await departmentRepo.find(lecturer[3]);

      if (!existingDepartment) {
        throw new Error(`Department on row number ${rowCounter + 1}, doesn't exist, Please restart process by excluding the rows above that if any`);
      }

      const existingLecturer = await userRepo.find(lecturer[1]);

      if (existingLecturer) {
        throw new Error(`Lecturer with email: ${lecturer[1]} on row ${rowCounter + 1} already exist. Please restart process by excluding the rows above that if any`)
      }
      
      let addedLecturer = await lecturerRepo.create({
        qualification: lecturer[4],
        department: existingDepartment,
        user: {
          name: lecturer[0],
          email: lecturer[1],
          phoneNumber: lecturer[2],
          role: Role.LECTURER,
          password: generatedPassword
        }
      });

      await invitationMailer.sendMail({
        email: addedLecturer.user.email,
        name: addedLecturer.user.name,
        id: addedLecturer.user.id!,
        password: generatedPassword,
        role: addedLecturer.user.role
      });

      rowCounter++;
    }

    res.revalidate("/dashboard/manage-users");

    res.status(StatusCode.SUCCESS).json({
      message: "Lecturers added successfully"
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