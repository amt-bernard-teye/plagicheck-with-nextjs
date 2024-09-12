import { StatusCode } from "../enums/status-code";
import { Department } from "../types/department.type";

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


export async function updateDepartment(value: Department) {
  const response = await fetch(`http://localhost:3000/api/departments/${value.id}`, {
    method: "PUT",
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


export async function deleteDepartment(id: number) {
  const response = await fetch(`http://localhost:3000/api/departments/${id}`, {
    method: "DELETE",
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