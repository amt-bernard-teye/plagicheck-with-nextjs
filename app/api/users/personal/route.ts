import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { StatusCode } from "@/lib/enum/status-code";
import { personalValidationSchema } from "@/lib/validation/account-setting.validation";
import { UserRepository } from "@/lib/repository/user.repository";
import { AppException } from "@/lib/exceptions/app.exception";
import { setAuthCookie } from "@/lib/util/setup-cookie.util";
import { verify } from "jsonwebtoken";
import { getExceptionMessage } from "@/lib/exceptions/exception-handler";
import { ensureUserIsLoggedIn } from "@/lib/middleware/authorization-check.middleware";

export async function POST(req: Request) {
  const isLoggedIn = ensureUserIsLoggedIn();

  if (!isLoggedIn) {
    return redirect("/");
  }
  
  const token = cookies().get("_auth-tk")!.value;
  const emailCookie = cookies().get("user_email");
  const email = emailCookie ? emailCookie.value : "";
  const data = await req.json();
  const repo = new UserRepository();

  try {
    const result = <{id: string, email: string}>verify(token, process.env.SECRET_KEY!);

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
    let message = getExceptionMessage(error);

    return Response.json({ message }, {
      status: StatusCode.SERVER
    });
  }
}