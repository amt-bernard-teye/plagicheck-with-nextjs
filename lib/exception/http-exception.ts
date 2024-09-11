import { StatusCode } from "../enums/status-code";

export class HttpException extends Error {
  statusCode: StatusCode;

  constructor(message: string, statusCode: StatusCode) {
    super();

    this.message = message;
    this.statusCode = statusCode;
  }
}