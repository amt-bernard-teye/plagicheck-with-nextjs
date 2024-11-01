import { ValidationError } from "yup";

import { AppException } from "./app.exception";

export function getExceptionMessage(error: unknown) {
  let message = "Something went wrong";

  if (error instanceof ValidationError) {
    return "Validation failed";
  }
  
  if (error instanceof AppException) {
    return error.message;
  }

  return message;
}