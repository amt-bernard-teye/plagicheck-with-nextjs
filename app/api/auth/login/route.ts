import { compare } from "bcryptjs";
import { ValidationError } from "yup";

import { AppException } from "@/lib/exceptions/app.exception";
import { UserRepository } from "@/lib/repository/user.repository";
import { loginValidationSchema } from "@/lib/validation/login.validation";
import { StatusCode } from "@/lib/enum/status-code";
import { setAuthCookie } from "@/lib/util/setup-cookie.util";


export async function POST(req: Request) {
  const submittedData = await req.json();

  try {
    const validatedData = await loginValidationSchema.validate(submittedData);
    const repo = new UserRepository();
    const existingUser = await repo.find(validatedData.username);
    const hashedPassword = existingUser ? existingUser.password! : "";
    const samePassword = await compare(validatedData.password, hashedPassword);

    if (!existingUser || !samePassword) {
      throw new AppException("Wrong credentials");
    }

    setAuthCookie(existingUser);
    
    return Response.json({
      message: "Access granted",
      status: StatusCode.SUCCESS
    });
  }
  catch(error) {
    let message = "Something went wrong";

    if (error instanceof ValidationError) {
      message = "Validation failed"
    }
    else if (error instanceof AppException) {
      message = error.message
    }

    return Response.json({ 
      message, 
      status: StatusCode.BAD_REQUEST 
    });
  }
}