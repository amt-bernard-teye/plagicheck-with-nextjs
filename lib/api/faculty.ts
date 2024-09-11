import { FetchForm } from "../enums/fetch-form";
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


export async function getFaculties(form: FetchForm = FetchForm.PAGINATE, query: string = "", page: number = 0) {
  const params = new URLSearchParams();
  params.append("paginate", form);
  params.append("page", page.toString());
  params.append("q", query);

  const response = await fetch(`http://localhost:3000/api/faculties?${params.toString()}`, {
    method: "GET",
  });

  const result = await response.json();

  if (response.status !== StatusCode.SUCCESS) {
    throw new Error(result.message);
  }

  return result;
}