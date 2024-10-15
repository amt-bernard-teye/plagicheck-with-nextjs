import { ValidationError } from "yup";

import { AppException } from "./app.exception";

export function getExceptionMessage(error: unknown) {
  let message = "Something went wrong";

  if (error instanceof ValidationError) {
    message = "Validation failed";
  }
  else if (error instanceof AppException) {
    message = error.message;
  }

  return message;
}