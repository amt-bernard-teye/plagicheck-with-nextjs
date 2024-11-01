import { redirect } from "next/navigation";
import * as GeneratePassword from "generate-password";
import { hash } from "bcryptjs";

import { lecturerValidationSchema } from "@/lib/validation/manage-users.validation";
import { LecturerRepository } from "@/lib/repository/lecturer.repository";
import { Role } from "@prisma/client";
import { UserInvitationMailer } from "@/lib/mailer/user-invitation.mailer";
import { StatusCode } from "@/lib/enum/status-code";
import { getExceptionMessage } from "@/lib/exceptions/exception-handler";
import { ensureUserIsLoggedIn } from "@/lib/middleware/authorization-check.middleware";
import { checkDepartment, ensureEmailNeverExist } from "@/lib/util/check-entities.util";

export async function POST(req: Request) {
  const isLoggedIn = ensureUserIsLoggedIn();

  if (!isLoggedIn) {
    return redirect("/");
  }

  const data = await req.json();

  try {
    const validatedData = await lecturerValidationSchema.validate(data);
    
    await ensureEmailNeverExist(validatedData.email);
    const department = await checkDepartment(+validatedData.departmentId);

    const generatedPassword = GeneratePassword.generate({length: 10, numbers: true});
    const hashedGeneratedPassword = await hash(generatedPassword, 12);

    const lecturerRepo = new LecturerRepository();
    const lecturer = await lecturerRepo.create({
      qualification: validatedData.qualification,
      department: department!,
      user: {
        ...validatedData,
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

    return Response.json({
      message: "Lecturer added successfully",
      data: lecturer
    });
  }
  catch(error: any) {
    let message = getExceptionMessage(error);
    return Response.json({ message }, {
      status: StatusCode.BAD_REQUEST
    });
  }
}