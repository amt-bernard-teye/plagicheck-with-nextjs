import { StatusCode } from "../enums/status-code";

export async function createFaculty(formData: {name: string}) {
  const response = await fetch("http://localhost:3000/api/faculties", {
    method: "POST",
    body: JSON.stringify(formData),
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