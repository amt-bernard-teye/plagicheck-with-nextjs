import { NextApiRequest, NextApiResponse } from "next";
import * as Yup from "yup";

import { StatusCode } from "@/lib/enums/status-code";
import { HttpException } from "@/lib/exception/http-exception";
import { FacultyRepository } from "@/lib/repository/faculty.repository";
import { handleError } from "@/lib/utils/handle-error";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    updateFaculty(req, res);
    return;
  }
  else if (req.method === "DELETE") {
    deleteFaculty(req, res);
    return;
  }

  return res.status(StatusCode.NOT_FOUND).json({
    message: "Http Not Found"
  });
}


const repo = new FacultyRepository();

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required")
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be 50 characters or less")
    .matches(/^[a-zA-Z ]+$/, "Only letters and white spaces are allowed")
    .trim(),
  facultyId: Yup.string()
    .required("Faculty is required")
    .matches(/^[0-9]*$/, "Only numbers are allowed")
    .trim()
});

export async function updateFaculty(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body;
  data["facultyId"] = req.query["id"];

  try {
    const validatedData = await validationSchema.validate(data);
    const existingFaculty = await repo.find(+validatedData.facultyId);

    if (!existingFaculty) {
      throw new HttpException("Faculty doesn't exist", StatusCode.BAD_REQUEST);
    }

    existingFaculty.name = validatedData.name;
    existingFaculty.id = +validatedData.facultyId;

    const updatedFaculty = await repo.update(existingFaculty);

    return res.status(StatusCode.SUCCESS).json({
      message: "Faculty updated successfully",
      data: updatedFaculty
    });
  }
  catch(error: any) {
    handleError(error, res);
  }
}


export async function deleteFaculty(req: NextApiRequest, res: NextApiResponse) {
  const data = <{
    id: string;
  }>req.query;

  try {
    const validationSchema = await Yup.object({
      id: Yup.string().required("Id is required")
            .matches(/^[0-9]*$/, "Only numbers are allowed")
    });
    const validatedData = await validationSchema.validate(data);
    const existingFaculty = await repo.find(+validatedData.id);

    if (!existingFaculty) {
      throw new HttpException("Faculty doesn't exist", StatusCode.BAD_REQUEST);
    }

    await repo.delete(+validatedData.id);

    return res.status(StatusCode.SUCCESS).json({
      message: "Faculty deleted successfully"
    });
  }
  catch(error: any) {
    handleError(error, res);
  }
}