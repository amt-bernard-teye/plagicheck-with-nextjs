import { StatusCode } from "../enums/status-code";

export enum HttpMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

type RequestDetails = {
  method: HttpMethods;
  status: StatusCode;
  path: string;
}

export default async function makeHttpRequest<T>(requestDetails: RequestDetails, value: T) {
  const response = await fetch(`/api/${requestDetails.path}`, {
    method: requestDetails.method,
    body: JSON.stringify(value),
    headers: {
      "Content-Type": "application/json"
    }
  });

  const result = await response.json();

  if (response.status !== requestDetails.status) {
    throw new Error(result.message);
  }

  return result;
}