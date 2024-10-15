import { compare } from "bcryptjs";

import { AppException } from "@/lib/exceptions/app.exception";
import { UserRepository } from "@/lib/repository/user.repository";
import { loginValidationSchema } from "@/lib/validation/login.validation";
import { StatusCode } from "@/lib/enum/status-code";
import { setAuthCookie } from "@/lib/util/setup-cookie.util";
import { AvailabilityStatus } from "@prisma/client";
import { getExceptionMessage } from "@/lib/exceptions/exception-handler";


export async function POST(req: Request) {
  const submittedData = await req.json();

  try {
    const validatedData = await loginValidationSchema.validate(submittedData);
    const repo = new UserRepository();
    const existingUser = await repo.find(validatedData.username);
    const hashedPassword = existingUser ? existingUser.password! : "";
    const samePassword = await compare(validatedData.password, hashedPassword);

    if (!existingUser || !samePassword || existingUser.status === AvailabilityStatus.UN_AVAILABLE) {
      throw new AppException("Wrong credentials");
    }

    setAuthCookie(existingUser);
    
    return Response.json({
      message: "Access granted",
      status: StatusCode.SUCCESS
    });
  }
  catch(error) {
    let message = getExceptionMessage(error);

    return Response.json({ 
      message, 
      status: StatusCode.BAD_REQUEST 
    });
  }
}