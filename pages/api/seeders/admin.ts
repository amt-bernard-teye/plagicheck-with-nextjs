import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcryptjs";

import { UserRepository } from "@/lib/repository/user.repository";
import { Role } from "@prisma/client";
import { StatusCode } from "@/lib/enums/status-code";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const repo = new UserRepository();

  try {
    const existingAdmin = await repo.find(process.env.ADMIN_EMAIL!);
    
    if (existingAdmin) {
      return res.status(StatusCode.SUCCESS).json({
        message: "Admin already created"
      });
    }

    const hashedPassword = await hash(process.env.ADMIN_PASSWORD!, 10);
    await repo.create({
      name: process.env.ADMIN_NAME!,
      email: process.env.ADMIN_EMAIL!,
      password: hashedPassword,
      phoneNumber: process.env.ADMIN_PHONE!,
      role: Role.ADMIN
    });
  
    res.status(StatusCode.CREATED).json({
      message: "Admin created successfully"
    });
  }
  catch(error) {
    res.status(StatusCode.SERVER).json({
      message: "Something went wrong"
    });
  }
}