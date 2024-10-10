import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import { ValidationError } from "yup";

import { AppException } from "@/lib/exceptions/app.exception";
import { UserRepository } from "@/lib/repository/user.repository";
import { loginValidationSchema } from "@/lib/validation/login.validation";
import { StatusCode } from "@/lib/enum/status-code";


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

    const {password, ...user} = existingUser;
    const token = sign({id: existingUser.id, email: existingUser.email}, process.env.SECRET_KEY!, {expiresIn: "24h"});
    const tokenDuration = 60 * 60 * 24 * 1000;
    
    cookies().set("_auth-tk", token, {
      httpOnly: true,
      maxAge: tokenDuration,
      path: "/"
    });
    cookies().set("user_id", user.id!, { maxAge: tokenDuration, path: "/" });
    cookies().set("user_email", user.email, { maxAge: tokenDuration, path: "/" });
    cookies().set("user_name", user.name, { maxAge: tokenDuration, path: "/" });
    
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