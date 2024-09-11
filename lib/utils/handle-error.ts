import { ValidationError } from "yup";

import { StatusCode } from "../enums/status-code";
import { NextApiResponse } from "next";
import { HttpException } from "../exception/http-exception";

export function handleError(error: Error, res: NextApiResponse) {
  let message = "Something went wrong";
  let status = StatusCode.SERVER;

  if (error instanceof ValidationError) {
    message = "Validation failed";
    status = StatusCode.BAD_REQUEST;
  }
  else if (error instanceof HttpException) {
    message = error.message;
    status = error.statusCode;
  }

  return res.status(status).json({ message });
}