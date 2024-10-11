import { sign } from "jsonwebtoken";

import { StatusCode } from "@/lib/enum/status-code";
import { AppException } from "@/lib/exceptions/app.exception";
import { ResetPasswordMailer } from "@/lib/mailer/reset-password.mailer";
import { UserRepository } from "@/lib/repository/user.repository";

export async function POST(req: Request) {
  const data = await req.json();
  
  try {
    const repo = new UserRepository();
    const existingUser = await repo.find(data.email);

    if (!existingUser) {
      throw new AppException("Email doesn't exist, please check and try again");
    }

    const token = sign({
      sub: existingUser.id,
      email: existingUser.email
    }, process.env.SECRET_KEY!, {expiresIn: "1hr"});

    const mailer = new ResetPasswordMailer();
    
    await mailer.sendMail({
      email: existingUser.email,
      name: existingUser.name,
      url: `http://localhost:3000/reset-password?token=${token}`
    });

    return Response.json({
      message: "Please check your email to complete your password reset process",
      status: StatusCode.SUCCESS
    });
  }
  catch(error) {
    let message = error instanceof AppException ? error.message : "Something went wrong";
    
    return Response.json({
      message,
      status: StatusCode.BAD_REQUEST
    });
  }
}