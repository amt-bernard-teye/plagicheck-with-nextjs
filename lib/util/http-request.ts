import { StatusCode } from "../enum/status-code";


export async function get(path: string) {
  const response = await fetch(path, {
    method: "GET",
  });

  return getResponse(response);
}


export async function post(path: string, values: unknown) {
  const response = await fetch(path, {
    method: 'POST',
    body: JSON.stringify(values),
    headers: {
      "Content-Type": "application/json"
    }
  });

  return getResponse(response);
}


export async function put(path: string, values: unknown) {
  const response = await fetch(path, {
    method: 'PUT',
    body: JSON.stringify(values),
    headers: {
      "Content-Type": "application/json"
    }
  });

  return getResponse(response);
}


export async function destroy(path: string) {
  const response = await fetch(path, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  });

  return getResponse(response);
}


async function getResponse(response: Response) {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
}