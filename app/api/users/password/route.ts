import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { compare, hash } from "bcryptjs";

import { StatusCode } from "@/lib/enum/status-code";
import { getExceptionMessage } from "@/lib/exceptions/exception-handler";
import { passwordValidationSchema } from "@/lib/validation/account-setting.validation";
import { UserRepository } from "@/lib/repository/user.repository";
import { AppException } from "@/lib/exceptions/app.exception";


export async function POST(req: Request) {
  const data = await req.json();

  try {
    const validatedData = await passwordValidationSchema.validate(data);

    if (validatedData.newPassword !== validatedData.confirmPassword) {
      throw new AppException("Passwords do not match each other");
    }

    const token = cookies().get("_auth-tk")!.value;
    const result = <{id: string, email: string}>verify(token, process.env.SECRET_KEY!);

    const repo = new UserRepository();
    const existingUser = await repo.find(result.email);
    const samePassword = await compare(validatedData.currentPassword, existingUser!.password!);

    if (!samePassword) {
      throw new AppException("Invalid current password");
    }

    const hashedPassword = await hash(validatedData.confirmPassword, 10);
    existingUser!.password = hashedPassword;

    await repo.update(existingUser!);

    return Response.json({
      message: "Changed password successfully"
    });
  }
  catch(error) {
    let message = getExceptionMessage(error);

    return Response.json({ message }, {
      status: StatusCode.SERVER
    });
  }
}