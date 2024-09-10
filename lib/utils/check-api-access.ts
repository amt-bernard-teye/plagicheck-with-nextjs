import { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";
import { StatusCode } from "../enums/status-code";

export async function CheckApiAccess(req: NextApiRequest, res: NextApiResponse) {
  const accessToken = req.cookies["_auth-tk"] || "";

  if (accessToken === "") {
    return res.status(StatusCode.UN_AUTHORIZED).json({
      message: "Access Denied"
    });
  }

  try {
    verify(accessToken, process.env.SECRET_KEY!);
  }
  catch(error) {
    return res.status(StatusCode.UN_AUTHORIZED).json({
      message: "Access Denied"
    });
  }
}