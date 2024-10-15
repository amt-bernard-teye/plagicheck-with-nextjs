import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";

import { User } from "../types/user.type";

export function setAuthCookie(existingUser: User) {
  const {password, ...user} = existingUser;
  const token = sign({id: existingUser.id, email: existingUser.email}, process.env.SECRET_KEY!, {expiresIn: "24h"});
  const tokenDuration = 60 * 60 * 24 * 1000;
  const imagePath = user.image || "";
  
  cookies().set("_auth-tk", token, {
    httpOnly: true,
    maxAge: tokenDuration,
    path: "/"
  });
  cookies().set("user_id", user.id!, { maxAge: tokenDuration, path: "/" });
  cookies().set("user_email", user.email, { maxAge: tokenDuration, path: "/" });
  cookies().set("user_name", user.name, { maxAge: tokenDuration, path: "/" });
  cookies().set("user_image_path", imagePath, {maxAge: tokenDuration, path: "/"});
}