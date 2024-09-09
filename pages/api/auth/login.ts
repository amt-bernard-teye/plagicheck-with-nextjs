import { NextApiRequest, NextApiResponse } from "next";
import { compare } from "bcryptjs";
import * as cookie from "cookie";
import { sign } from "jsonwebtoken";
import * as Yup from "yup";

import { StatusCode } from "@/lib/enums/status-code";
import { UserRepository } from "@/lib/repository/user.repository";


const validationSchema = Yup.object({
  username: Yup.string().required("Username is required").trim(),
  password: Yup.string().required("Password is required").trim()
});


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "POST") {
    res.status(StatusCode.BAD_REQUEST).json({
      message: "Not Found"
    });
  }
  
  try {
    const data = <{username: string; password: string;}>req.body;
    const validatedData = await validationSchema.validate(data);

    const repo = new UserRepository();
    const existingUser = await repo.find(validatedData.username);
    const hashedPassword = existingUser ? existingUser.password! : "";
    const samePassword = await compare(validatedData.password, hashedPassword);

    if (!existingUser || !samePassword) {
      return res.status(StatusCode.BAD_REQUEST).json({
        message: "Wrong credentials"
      });
    }

    const {password, ...user} = existingUser;
    const token = sign({id: existingUser.id, email: existingUser.email}, process.env.SECRET_KEY!, {expiresIn: "24h"});
    const tokenDuration = 60 * 60 * 24;
    const authSession = cookie.serialize("_auth-tk", token, {
      httpOnly: true,
      maxAge: tokenDuration,
      path: "/"
    });

    res.setHeader("Set-Cookie", authSession);
    res.status(StatusCode.SUCCESS).json({
      message: "Access granted",
      data: user
    });
  }
  catch(error) {
    let message = "Something went wrong";

    if (error instanceof Yup.ValidationError) {
      message = "Validation failed";
    }

    res.status(StatusCode.SERVER).json({ message });
  }
}