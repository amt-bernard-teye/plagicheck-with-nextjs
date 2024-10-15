import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ValidationError } from "yup";

import { StatusCode } from "@/lib/enum/status-code";
import { personalValidationSchema } from "@/lib/validation/account-setting.validation";
import { UserRepository } from "@/lib/repository/user.repository";
import { AppException } from "@/lib/exceptions/app.exception";
import { setAuthCookie } from "@/lib/util/setup-cookie.util";
import { verify } from "jsonwebtoken";

export async function POST(req: Request) {
  const auth = cookies().get("_auth-tk");
  
  if (!auth) {
    return redirect("/");
  }
  
  const emailCookie = cookies().get("user_email");
  const email = emailCookie ? emailCookie.value : "";
  const data = await req.json();
  const repo = new UserRepository();

  try {
    let result = <{id: string, email: string}>verify(auth.value, process.env.SECRET_KEY!);

    const validatedData = await personalValidationSchema.validate(data);
    const existingUser = await repo.find(email);

    if (!existingUser || result.id !== existingUser.id) {
      throw new AppException("Email already taken");
    }

    existingUser.name = `${validatedData.firstName} ${validatedData.lastName}`;
    existingUser.email = validatedData.email;
    existingUser.phoneNumber = validatedData.phone;

    const updatedUser = await repo.update(existingUser);
    setAuthCookie(updatedUser);

    return Response.json({
      message: "Personal information updated successfully"
    });
  }
  catch(error) {
    let message = "Something went wrong";

    if (error instanceof ValidationError) {
      message = "Validation failed";
    }
    else if (error instanceof AppException) {
      message = error.message;
    }

    return Response.json({ message }, {
      status: StatusCode.SERVER
    });
  }
}