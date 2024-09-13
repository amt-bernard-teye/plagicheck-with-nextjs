import { NextApiRequest, NextApiResponse } from "next";
import * as cookies from "cookie";
import { StatusCode } from "@/lib/enums/status-code";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authCookie = cookies.serialize("_auth-tk", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/"
  });

  res.setHeader("Set-Cookie", authCookie);

  res.status(StatusCode.SUCCESS).json({
    message: "You are logged-out"
  });
}