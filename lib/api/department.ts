import { StatusCode } from "../enums/status-code";

export async function createDepartment(values: {name: string; facultyId: number}) {
  const response = await fetch("http://localhost:3000/api/departments", {
    method: "POST",
    body: JSON.stringify(values),
    headers: {
      "Content-Type": "application/json"
    }
  });

  const result = await response.json();

  if (response.status !== StatusCode.CREATED) {
    throw new Error(result.message);
  }

  return result;
}