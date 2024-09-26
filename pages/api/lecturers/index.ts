import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";
import { hash } from "bcryptjs";
import * as PasswordGenerator from "generate-password";

import { LecturerRepository } from "@/lib/repository/lecturer.repository";
import { DepartmentRepository } from "@/lib/repository/department.repository";
import { handleError } from "@/lib/utils/handle-error";
import { Role } from "@prisma/client";
import { StatusCode } from "@/lib/enums/status-code";
import { UserInvitationMailer } from "@/lib/mailer/user-invitation.mailer";
import { getQueryPageForm } from "@/lib/utils/get-query-page-form";
import { Lecturer } from "@/lib/types/lecturer.type";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    await createLecturer(req, res);
    return;
  }
  else if (req.method === "GET") {
    await getLecturers(req, res);
    return;
  }

  return res.status(StatusCode.NOT_FOUND).json({
    message: "Http not found"
  });
}


const lecturerRepo = new LecturerRepository();
const departmentRepo = new DepartmentRepository();

const validationSchema = Yup.object({
  name: Yup.string().required().matches(/^[a-zA-Z ]*$/),
  email: Yup.string().required().email(),
  departmentId: Yup.number().required(),
  qualification: Yup.string().required().matches(/^[a-zA-Z ]*$/),
  phoneNumber: Yup.string().required().matches(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/)
});

async function createLecturer(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body;

  try {
    const validatedData = await validationSchema.validate(data);
    const department = await departmentRepo.find(validatedData.departmentId);

    if (!department) {
      throw new Error("Selected department not found");
    }

    const generatedPassword = PasswordGenerator.generate({length: 10, numbers: true});
    const hashedGeneratedPassword = await hash(generatedPassword, 12);

    const lecturer = await lecturerRepo.create({
      qualification: validatedData.qualification,
      department: department!,
      user: {
        name: validatedData.name,
        email: validatedData.email,
        phoneNumber: validatedData.phoneNumber,
        role: Role.LECTURER,
        password: hashedGeneratedPassword
      }
    });

    const mailer = new UserInvitationMailer();
    await mailer.sendMail({
      email: lecturer.user.email,
      id: lecturer.user.id!,
      password: generatedPassword,
      role: lecturer.user.role,
      name: lecturer.user.name
    });

    return res.status(StatusCode.SUCCESS).json({
      message: "Lecturer added successfully",
      data: lecturer
    });
  }
  catch(error: any) {
    handleError(error, res);
  }
}


async function getLecturers(req: NextApiRequest, res: NextApiResponse) {
  const values = getQueryPageForm(req);

  try {
    const [lecturers, count] = await Promise.all([
      lecturerRepo.paginate(values.query, values.page),
      lecturerRepo.count(values.query)
    ]);

    return res.status(StatusCode.SUCCESS).json({
      count,
      data: lecturers
    });
  }
  catch(error: any) {
    res.status(StatusCode.SERVER).json({
      message: error.message || "Something went wrong" 
    });
  }
}