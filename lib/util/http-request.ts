import { StatusCode } from "../enum/status-code";

export async function post(path: string, values: unknown) {
  const response = await fetch(path, {
    method: 'POST',
    body: JSON.stringify(values),
    headers: {
      "Content-Type": "application/json"
    }
  });
  const result = await response.json();

  if (response.status !== StatusCode.SUCCESS) {
    throw new Error(result.message);
  }

  return result;
}