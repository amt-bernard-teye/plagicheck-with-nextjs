import { hash } from "bcryptjs";

import * as GeneratePassword from "generate-password";
import { UserInvitationMailer } from "@/lib/mailer/user-invitation.mailer";
import { StatusCode } from "@/lib/enum/status-code";
import { getExceptionMessage } from "@/lib/exceptions/exception-handler";
import { checkDepartment, ensureEmailNeverExist } from "@/lib/util/check-entities.util";
import { studentValidationSchema } from "@/lib/validation/manage-users.validation";
import { StudentRepository } from "@/lib/repository/student.repository";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const validatedData = await studentValidationSchema.validate(data);
    const department = await checkDepartment(+validatedData.departmentId);

    await ensureEmailNeverExist(validatedData.email);

    const generatedPassword = GeneratePassword.generate({length: 10, numbers: true});
    const hashedGeneratedPassword = await hash(generatedPassword, 12);

    const studentRepo = new StudentRepository();
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

    return Response.json({
      message: "Student added successfully",
      data: student
    });
  }
  catch(error: any) {
    let message = getExceptionMessage(error);
    return Response.json({ message }, {
      status: StatusCode.BAD_REQUEST
    });
  }
}