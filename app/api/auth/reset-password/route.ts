import { ValidationError } from "yup";
import { verify } from "jsonwebtoken";

import { AppException } from "@/lib/exceptions/app.exception";
import { UserRepository } from "@/lib/repository/user.repository";
import { resetValidationSchema } from "@/lib/validation/reset-password.validation";
import { StatusCode } from "@/lib/enum/status-code";
import { hash } from "bcryptjs";
import { ConfirmResetMailer } from "@/lib/mailer/confirm-reset.mailer";

export async function POST(req: Request) {
  const url = req.url;
  const searchParams = new URL(url).searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return Response.json({
      message: "Please provide token",
      status: StatusCode.BAD_REQUEST
    });
  }

  const data = await req.json();
  const repo = new UserRepository();
  
  try {
    const validatedData = await resetValidationSchema.validate(data);
    const verificationResult = <{sub: string, email: string;}>verify(token!, process.env.SECRET_KEY!);
    
    const existingUser = await repo.find(verificationResult.sub);

    if (!existingUser || existingUser.email !== verificationResult.email) {
      throw new AppException("User doesn't exist")
    }

    const hashedPassword = await hash(validatedData.confirmPassword, 10);
    existingUser.password = hashedPassword;

    await repo.update(existingUser);

    const mailer = new ConfirmResetMailer();
    await mailer.sendMail({
      email: existingUser.email,
      name: existingUser.name
    });

    return Response.json({
      message: "Successfully reset your password",
      status: StatusCode.SUCCESS
    });
  }
  catch(error) {
    let message = "Token expired, go to the forgot password page and try again";

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