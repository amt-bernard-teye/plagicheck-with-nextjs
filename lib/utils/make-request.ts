import { StatusCode } from "../enums/status-code";

export async function create(path: string, value: unknown) {
  const response = await fetch(`/api/${path}`, {
    method: "POST",
    body: JSON.stringify(value),
    headers: {
      "Content-Type": "application/json"
    }
  });

  return sendResult(response);
}


export async function update(path: string, value: unknown) {
  const response = await fetch(`/api/${path}`, {
    method: "PUT",
    body: JSON.stringify(value),
    headers: {
      "Content-Type": "application/json"
    }
  });

  return sendResult(response);
}


export async function destroy(path: string) {
  const response = await fetch(`/api/${path}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  });

  return sendResult(response);
}


async function sendResult(response: Response) {
  const result = await response.json();

  if (response.status !== StatusCode.SUCCESS) {
    throw new Error(result.message || "Something went wrong");
  }

  return result; 
}