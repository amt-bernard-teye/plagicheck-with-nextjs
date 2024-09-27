import { StatusCode } from "../enums/status-code";

export default async function create(path: string, value: unknown) {
  const response = await fetch(`/api/${path}`, {
    method: "POST",
    body: JSON.stringify(value),
    headers: {
      "Content-Type": "application/json"
    }
  });

  const result = await response.json();

  if (response.status !== StatusCode.CREATED) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
}