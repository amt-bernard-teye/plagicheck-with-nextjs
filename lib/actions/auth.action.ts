"use server";

import { cookies } from "next/headers";

import { StatusCode } from "../enum/status-code";
import { UserRepository } from "../repository/user.repository";
import { loginValidationSchema } from "../validation/login.validation";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { ValidationError } from "yup";
import { AppException } from "../exceptions/app.exception";
import { redirect } from "next/navigation";

type LoginData = {
  username: string;
  password: string;
}

export async function loginAction(initialState: any, formData: FormData) {
  const submittedData = <LoginData>Object.fromEntries(formData.entries())!;

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
    cookies().set("user", JSON.stringify(user), {
      maxAge: tokenDuration,
      path: "/"
    });
    
    return {
      message: "Access granted",
      status: StatusCode.SUCCESS
    };
  }
  catch(error) {
    let message = "Something went wrong";

    if (error instanceof ValidationError) {
      message = "Validation failed"
    }
    else if (error instanceof AppException) {
      message = error.message
    }

    return { message, status: StatusCode.BAD_REQUEST };
  }
}


export async function logoutAction() {
  cookies().delete("user");
  cookies().delete("_auth-tk");
  redirect("/");
} 