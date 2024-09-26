import { StatusCode } from "../enums/status-code";
import { LecturerToCreate } from "../types/user.type";

export async function createLecturer(value: LecturerToCreate) {
  const response = await fetch("http://localhost:3000/api/lecturers", {
    method: "POST",
    body: JSON.stringify(value),
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