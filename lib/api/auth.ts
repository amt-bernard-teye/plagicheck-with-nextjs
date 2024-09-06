import { StatusCode } from "../enums/status-code";

export async function login(values: {username: string, password: string}) {
  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (response.status !== StatusCode.SUCCESS) {
    const result = await response.json();
    throw new Error(result.message);
  }

  return await response.json();
} 